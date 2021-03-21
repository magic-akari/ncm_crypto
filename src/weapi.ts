import { encodeToString } from "https://deno.land/std/encoding/hex.ts";
import { randomBytes } from "https://deno.land/std/node/crypto.ts";
import { AES } from "https://deno.land/x/god_crypto/aes.ts";
import { rsaEncrypt } from "./rsa.ts";

const aesKey = "0CoJUm6Qyw8W8jud";
const iv = "0102030405060708";

const aes = new AES(aesKey, {
  mode: "cbc",
  iv,
});

const base62 = new TextEncoder().encode(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
);

const pubKey = BigInt("0x010001");

const modulus = BigInt(
  "0x00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7"
);

export const weapi = async (
  data: Record<string, unknown>
): Promise<{
  params: string;
  encSecKey: string;
}> => {
  const text = JSON.stringify(data);

  const encodedBin = new TextEncoder().encode(
    (await aes.encrypt(text)).base64()
  );

  const secretKey = randomBytes(16).map((n) => base62[n % 62]);

  const paramsBin = await new AES(secretKey, {
    mode: "cbc",
    iv,
  }).encrypt(encodedBin);

  const params = paramsBin.base64();

  const reverseSecretKeyHex = BigInt(
    "0x" + encodeToString(secretKey.reverse())
  );

  const encSecKey = await rsaEncrypt(reverseSecretKeyHex, pubKey, modulus);

  return { params, encSecKey };
};
