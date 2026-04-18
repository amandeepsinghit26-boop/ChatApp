import express from 'express'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js'
import cookieParser from 'cookie-parser'
import morgan from 'morgan';
import cors from 'cors'
const app = express()
app.use(cors({
    origin: 'https://chatapp-frontend-z92f.onrender.com',
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/chats",chatRouter)
app.use(morgan('dev'))

export default app
