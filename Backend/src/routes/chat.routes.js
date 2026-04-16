import {Router} from 'express'
import { sendMessage,getChats,getMessages,chatDelete } from '../controllers/chat.controller.js'
import {authUser} from '../middlewares/auth.middleware.js'
const chatRouter=Router()

chatRouter.post('/message',authUser,sendMessage)
chatRouter.get('/',authUser,getChats)
chatRouter.get('/:chatId/messages',authUser,getMessages)

chatRouter.delete('/delete/:chatId',authUser,chatDelete)
export default chatRouter