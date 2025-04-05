import { io } from "socket.io-client";
const socket = io({ transports: ["websocket"] });

socket.on("alert", (msg) => {
	console.log(msg);
});

export { socket };
