import { modPow } from "https://deno.land/x/modpow@v0.1.1/modpow.ts";

export function rsaEncrypt(
	text: bigint,
	pubKey: bigint,
	modules: bigint,
): string {
	const biRet = modPow(text, pubKey, modules);

	// leading zero fill
	const result = biRet.toString(16).padStart(256, "0");
	return result;
}
