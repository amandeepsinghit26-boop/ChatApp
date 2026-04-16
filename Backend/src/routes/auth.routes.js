import {Router} from 'express'
import {registerController,verifyEmail,login,getMe,logout} from '../controllers/auth.controller.js'
import {registerValidator,loginValidator} from '../validators/auth.validator.js'
import {authUser} from '../middlewares/auth.middleware.js'
const authRouter=Router()

authRouter.post('/register',registerValidator,registerController)

authRouter.get('/verify-email',verifyEmail)

authRouter.post('/login',loginValidator,login)
authRouter.get('/get-me',authUser,getMe)
authRouter.post('/logout',authUser,logout)
export default authRouter