import * as hex from "jsr:@std/encoding/hex";
import { Buffer } from "node:buffer";
import crypto from "node:crypto";

const eapiKey = "e82ckenh8dichen8";
const iv = "0102030405060708";

export function encodeParams(
	url: string,
	data: string | Record<string, unknown>,
): string {
	const text = typeof data === "object" ? JSON.stringify(data) : data;
	const message = `nobody${url}use${text}md5forencrypt`;

	const digest = crypto.createHash("md5").update(message).digest("hex");

	const input = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;

	const cipher = crypto.createCipheriv("aes-128-ecb", eapiKey, iv);
	return Buffer.concat([cipher.update(input), cipher.final()])
		.toString("hex")
		.toUpperCase();
}

export function decodeParams(data: string | Uint8Array): [string, string] {
	const buffer = typeof data === "string" ? hex.decodeHex(data) : data;

	const text = decodeBody(buffer);

	const slice = text.split("-36cd479b6b5-");
	return [slice[0], slice[1]];
}

export function decodeBody(cipherBuffer: Uint8Array): string {
	const cipher = crypto.createDecipheriv("aes-128-ecb", eapiKey, iv);
	return Buffer.concat([
		cipher.update(cipherBuffer),
		cipher.final(),
	]).toString("utf-8");
}
