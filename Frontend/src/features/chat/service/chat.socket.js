import { io } from "socket.io-client";

export const initalizeSocketConnection=()=>{
    const socket=io("https://chatapp-backend-qq7s.onrender.com", {
withCredentials: true,
    })

    socket.on("connect",()=>{
        console.log("Connected to socket server with id:",socket.id)
    })

    socket.on("disconnect",()=>{
        console.log("Disconnected from socket server")
    })
}