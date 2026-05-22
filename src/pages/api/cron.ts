export const prerender = false;

export async function GET(): Promise<Response> {
	const hookUrl = import.meta.env.DEPLOY_HOOK_URL;
	if (!hookUrl) {
		return new Response("DEPLOY_HOOK_URL is not set", { status: 500 });
	}

	const res = await fetch(hookUrl, { method: "POST" });
	if (!res.ok) {
		return new Response("Failed to trigger deploy hook", { status: 502 });
	}

	return new Response("Rebuild triggered", { status: 200 });
}
