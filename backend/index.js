import { Server } from "socket.io";
const io = new Server();
io.listen(3000);
let pageData = "# Welcome"
io.on("connect", (sock) => {
    console.log("new connect")
	sock.emit("alert","Welcome");
    sock.emit("pageEdit",pageData)
    sock.on("pageEdit",(data)=>{
        pageData = data
        io.volatile.emit("pageEdit",data)
    })
});


console.log("websocket on 3000");
