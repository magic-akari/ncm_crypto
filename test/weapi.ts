import { weapi } from "../weapi.ts";

const params = weapi({
	c: JSON.stringify([{ id: 496902086 }]),
});

console.log(params);

const search = new URLSearchParams(params);

const response = await fetch("http://music.163.com/weapi/v3/song/detail", {
	method: "POST",
	body: search,
});

const data = await response.json();
console.log(data);
