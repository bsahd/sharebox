import { Server } from "socket.io";
import * as fs from "fs";
import path from "path";
import { createDiff, patchDiff } from "../src/components/diff.js";

const io = new Server();
io.listen(3000);
let page = JSON.parse(
	fs.readFileSync(path.join(import.meta.dirname, "page")).toString(),
);

io.on("connect", (sock) => {
	console.log("new connect");
	sock.emit("pageReplace", page);
	sock.on("pageEdit", (data) => {
		page = patchDiff(page, data);
		fs.writeFileSync(
			path.join(import.meta.dirname, "page"),
			JSON.stringify(page),
		);
		sock.broadcast.emit("pageEdit", data);
	});
});

console.log("websocket on 3000");
