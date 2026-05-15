import app from './src/app.js'
import connectToDB from './src/config/database.js'
import dotenv from "dotenv";
dotenv.config();
import http from 'http'
import {initSocket} from './src/sockets/server.socket.js'

connectToDB()
// testAi()
const httpServer=http.createServer(app)
initSocket(httpServer)
const PORT=process.env.PORT || 3000
httpServer.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})