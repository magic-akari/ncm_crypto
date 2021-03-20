import { decodeString } from "https://deno.land/std/encoding/hex.ts";
import { createHash } from "https://deno.land/std/hash/mod.ts";
import { AES } from "https://deno.land/x/god_crypto/aes.ts";

const eapiKey = "e82ckenh8dichen8";
const iv = "e82ckenh8dichen8";

const aes = new AES(eapiKey, {
  mode: "ecb",
  iv,
});

export const encodeParams = async (
  url: string,
  data: string | Record<string, unknown>
): Promise<string> => {
  const text = typeof data === "object" ? JSON.stringify(data) : data;
  const message = `nobody${url}use${text}md5forencrypt`;

  const digest = createHash("md5").update(message).toString("hex");

  const input = `${url}-36cd479b6b5-${text}-36cd479b6b5-${digest}`;

  const cipher = await aes.encrypt(input);

  return cipher.hex().toUpperCase();
};

export const decodeParams = async (
  data: string | Uint8Array
): Promise<[string, string]> => {
  const buffer = typeof data === "string" ? decodeString(data) : data;

  const text = await decodeBody(buffer);

  const slice = text.split("-36cd479b6b5-");
  return [slice[0], slice[1]];
};

export const decodeBody = async (cipherBuffer: Uint8Array): Promise<string> => {
  const decode = await aes.decrypt(cipherBuffer);
  return decode.toString();
};
