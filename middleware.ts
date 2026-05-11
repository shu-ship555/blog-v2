// Vercel Routing Middleware
// /resume への Basic 認証を実装
export const config = {
	matcher: ["/resume", "/resume/:path*"],
};

export default function middleware(request: Request): Response | undefined {
	const auth = request.headers.get("authorization");

	if (auth) {
		const [scheme, encoded] = auth.split(" ");
		if (scheme === "Basic" && encoded) {
			const decoded = atob(encoded);
			const idx = decoded.indexOf(":");
			const user = decoded.slice(0, idx);
			const pass = decoded.slice(idx + 1);

			if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASS) {
				return; // 認証成功時はそのまま通す
			}
		}
	}

	return new Response("Authentication required", {
		status: 401,
		headers: { "WWW-Authenticate": 'Basic realm="Resume"' },
	});
}
