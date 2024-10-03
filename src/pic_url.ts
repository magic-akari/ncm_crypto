import { decodeBase64 } from "jsr:@std/encoding/base64";
import crypto from "node:crypto";

// TODO: Uint8Array.fromBase64
const code = decodeBase64("M2dvOCYkOCozKjNoMGsoMiky");

export function id_hash(id: string | number): string {
	const input = new TextEncoder().encode(String(id));

	for (let i = 0; i < input.length; i++) {
		input[i] ^= code[i % code.length];
	}

	const md5 = crypto.createHash("md5");
	const b64 = md5.update(input).digest("base64url");

	return addPaddingToBase64url(b64);
}

export function pic_url(id: string | number): string {
	const hash = id_hash(id);
	return `//p2.music.126.net/${hash}/${id}.jpg`;
}

/**
 * Some variants allow or require omitting the padding '=' signs:
 * https://en.wikipedia.org/wiki/Base64#The_URL_applications
 *
 * @param base64url
 */
function addPaddingToBase64url(base64url: string): string {
	if (base64url.length % 4 === 2) return base64url + "==";
	if (base64url.length % 4 === 3) return base64url + "=";
	if (base64url.length % 4 === 1) {
		throw new TypeError("Illegal base64url string!");
	}
	return base64url;
}
