import { decodeBody, encodeParams } from "../eapi.ts";

const params = encodeParams("/api/v3/song/detail", {
	e_r: true,
	c: JSON.stringify([{ id: 496902086 }]),
});

console.log(params);

const search = new URLSearchParams({
	params,
});

const response = await fetch("http://music.163.com/eapi/v3/song/detail", {
	method: "POST",
	body: search,
});

const data = await response
	.arrayBuffer()
	.then((ab) => new Uint8Array(ab))
	.then(decodeBody)
	.then(JSON.parse);

console.log(data);
