// src/utils/linkify.ts

export type LinkPart = { type: "text"; value: string } | { type: "url"; value: string };

export const linkify = (text: string): LinkPart[] => {
	const urlRegex = /(https?:\/\/[^\s)]+)/g;
	const parts: LinkPart[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;
	while ((match = urlRegex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ type: "text", value: text.slice(lastIndex, match.index) });
		}
		parts.push({ type: "url", value: match[0] });
		lastIndex = match.index + match[0].length;
	}
	if (lastIndex < text.length) {
		parts.push({ type: "text", value: text.slice(lastIndex) });
	}
	return parts;
};
