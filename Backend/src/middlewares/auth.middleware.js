import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const authUser=async (req,res,next) => {
    const token=req.cookies.token
    if (!token) {
        return res.status(401).json({
            message:'Unauthorized',
            success:false,
            err:'token not found'
        })
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user=decoded
        next()

    } catch (error) {
          return res.status(401).json({
            message:'Unauthorized',
            success:false,
            err:'Invalid Token'
        })
    }
}


