import * as fs from "fs/promises";
import path from "path";
import { createDiff, patchDiff } from "../src/components/diff.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
app.use(express.static(path.join(import.meta.dirname, "..", "dist")));
const httpServer = createServer(app);
const io = new Server(httpServer, {});

let page = JSON.parse(
	(await fs.readFile(path.join(import.meta.dirname, "page"))).toString(),
);

io.on("connect", (sock) => {
	console.log("new connect");
	sock.emit("pageReplace", page);
	sock.on("pageEdit", async (data) => {
		page = patchDiff(page, data);
		await fs.writeFile(
			path.join(import.meta.dirname, "page"),
			JSON.stringify(page),
		);
		sock.broadcast.emit("pageEdit", data);
	});
});

app.get("*a", async (req, res) => {
	res.type("html");
	res.send(
		await fs.readFile(
			path.join(import.meta.dirname, "..", "dist", "index.html"),
		),
	);
});

httpServer.listen(3000);
console.log("http://localhost:3000/");
