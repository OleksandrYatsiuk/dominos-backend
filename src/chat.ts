export function chat(io: SocketIO.Server) {
    return io.on("connect", (socket: any) => {
        io.use(function (socket: any, next: any) {
            console.log(socket)
            next();
        })
        console.log("Connected client on port http://localhost:%s.", 5000);
        socket.on("message", (m: any) => {
            console.log("[server](message): %s", JSON.stringify(m));
            io.emit("message", m);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    })
}
