import { decodeBody } from "./eapi.ts";

if (import.meta.main) {
	const file = Deno.args[0];
	const data = Deno.readFileSync(file);
	const decrypt = decodeBody(data);
	console.log(decrypt);
}
