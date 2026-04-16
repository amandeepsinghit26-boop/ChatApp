import app from './src/app.js'
import connectToDB from './src/config/database.js'
import http from 'http'
import {initSocket} from './src/sockets/server.socket.js'
import dotenv from "dotenv";
dotenv.config();
connectToDB()
// testAi()
const httpServer=http.createServer(app)
initSocket(httpServer)

httpServer.listen(3000,()=>{
    console.log('Server is running on port 3000')
})