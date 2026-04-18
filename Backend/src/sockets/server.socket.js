import {Server} from 'socket.io'

let io;

export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: 'https://chatapp-frontend-z92f.onrender.com',
            credentials: true
        }
    }); 

    console.log("Socket.io is RUNNING ");
    

    io.on('connection',(socket)=>{
        console.log('A user connected: '+ socket.id);
        
    })
}

export function getIO(){
if (!io) {
    throw new Error('Socket.io not initialized!')
}
return io;
}
