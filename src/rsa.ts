import { modPow } from "https://deno.land/x/modpow@v0.1.1/modpow.ts";

export const rsaEncrypt = (
  text: bigint,
  pubKey: bigint,
  modules: bigint,
): Promise<string> => {
  const biRet = modPow(text, pubKey, modules);

  // leading zero fill
  const result = biRet.toString(16).padStart(256, "0");
  return Promise.resolve(result);
};
