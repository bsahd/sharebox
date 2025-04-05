import { Server } from "socket.io";
import * as fs from "fs";
import path from "path";
import applyPatch from "textdiff-patch";
import createPatch from "textdiff-create";

const io = new Server();
io.listen(3000);
let page = fs.readFileSync(path.join(import.meta.dirname, "page")).toString();

io.on("connect", (sock) => {
	console.log("new connect");
	sock.emit("pageEdit", createPatch("", page));
	sock.on("pageEdit", (data) => {
		page = applyPatch(page, data);
		fs.writeFileSync(path.join(import.meta.dirname, "page"), page);
		sock.broadcast.emit("pageEdit", data);
	});
});

console.log("websocket on 3000");
