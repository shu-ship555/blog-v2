// ビルド前に Notion の画像を public/notion/ にダウンロードしておく
// Astro は public/ を dist/ にコピーするタイミングがページレンダリング前なので、
// レンダリング中に書き込んだファイルは初回ビルドでは反映されないことへの対策。
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";

// ローカル開発時は .env を読み込む（Vercel ではビルド環境の env を使うので不要）
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
	for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
		const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
		if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
	}
}

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_PROFILE_PAGE_ID = process.env.NOTION_PROFILE_PAGE_ID;

const NOTION_VERSION = "2022-06-28";
const MIME_EXT = {
	"image/svg+xml": "svg",
	"image/png": "png",
	"image/jpeg": "jpg",
	"image/jpg": "jpg",
	"image/webp": "webp",
	"image/gif": "gif",
	"image/avif": "avif",
};

const log = (msg) => console.log(`[prefetch-notion-images] ${msg}`);

const queryProfile = async () => {
	const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_PROFILE_PAGE_ID}/query`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${NOTION_API_KEY}`,
			"Notion-Version": NOTION_VERSION,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({}),
	});
	if (!res.ok) throw new Error(`profile query failed: ${res.status}`);
	return res.json();
};

const downloadFile = async (url, filename) => {
	const publicDir = path.join(process.cwd(), "public", "notion");
	await fsPromises.mkdir(publicDir, { recursive: true });
	const res = await fetch(url);
	if (!res.ok) throw new Error(`download failed: ${res.status}`);
	const contentType = (res.headers.get("content-type") ?? "image/png").split(";")[0].trim().toLowerCase();
	const ext = MIME_EXT[contentType] ?? "png";
	const buffer = Buffer.from(await res.arrayBuffer());
	await fsPromises.writeFile(path.join(publicDir, `${filename}.${ext}`), buffer);
	return `${filename}.${ext}`;
};

const main = async () => {
	if (!NOTION_API_KEY || !NOTION_PROFILE_PAGE_ID) {
		log("Skipped: NOTION_API_KEY / NOTION_PROFILE_PAGE_ID not set");
		return;
	}
	try {
		const data = await queryProfile();
		const page = data.results?.[0];
		if (!page) {
			log("Skipped: profile DB has no rows");
			return;
		}
		const avatar = page.properties?.avatar;
		if (avatar?.type !== "files" || !avatar.files?.length) {
			log("Skipped: avatar property is empty");
			return;
		}
		const f = avatar.files[0];
		const url = f.type === "file" ? f.file?.url : f.external?.url;
		if (!url) {
			log("Skipped: avatar URL is empty");
			return;
		}
		const written = await downloadFile(url, "avatar");
		log(`✓ Downloaded public/notion/${written}`);
	} catch (e) {
		log(`Error: ${e.message}`);
	}
};

main();
