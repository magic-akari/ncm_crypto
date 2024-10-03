import { encodeHex } from "jsr:@std/encoding/hex";
import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import { rsaEncrypt } from "./rsa.ts";

const aesKey = "0CoJUm6Qyw8W8jud";
const iv = "0102030405060708";

const base62 = new TextEncoder().encode(
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
);

const pubKey = 65537n;

const modulus = BigInt(
	"0x\
00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725\
152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312\
ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424\
d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8\
e7",
);

export function weapi(data: Record<string, unknown>): {
	params: string;
	encSecKey: string;
} {
	const text = JSON.stringify(data);

	const secretKey = crypto.randomBytes(16).map((n) => base62[n % 62]);

	const params = aes_cbc_encrypt(
		aes_cbc_encrypt(Buffer.from(text), aesKey, iv).toString("base64"),
		secretKey,
		iv,
	).toString("base64");

	const reverseSecretKeyHex = BigInt(
		"0x" + encodeHex(secretKey.toReversed()),
	);

	const encSecKey = rsaEncrypt(reverseSecretKeyHex, pubKey, modulus);

	return { params, encSecKey };
}

function aes_cbc_encrypt(
	buffer: crypto.BinaryLike,
	key: crypto.CipherKey,
	iv: string,
) {
	const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
	return Buffer.concat([cipher.update(buffer), cipher.final()]);
}
