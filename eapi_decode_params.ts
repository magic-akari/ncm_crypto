import { decodeParams } from "./eapi.ts";

if (import.meta.main) {
	const file = Deno.args[0];
	const data = Deno.readTextFileSync(file);
	const decrypt = decodeParams(data);
	console.log(decrypt);
}
