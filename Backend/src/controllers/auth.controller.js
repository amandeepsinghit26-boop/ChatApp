import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../services/mail.service.js";

export const registerController = async (req, res) => {
  const { username, email, password } = req.body;
  const isUserAlreadyExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserAlreadyExist) {
    return res.status(400).json({
      message: "User already exist with username or email",
      success: false,
      err: "user already exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to FindoRA",
    text: `Hi ${username},\n\nThank you for registering at Perplexity. We are excited to have you on board!`,
    html: `<p>Hi ${username},</p>
           <p>Thank you for registering at <strong>Perplexity</strong>.</p>
           <p>We are excited to have you on board!</p>
          <p>Please verify yourself by clicking the link below.</p> 
          <a href="https://chatapp-backend-qq7s.onrender.com/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a> `,
  });

  res.status(201).json({
    message: "User register successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

export const verifyEmail=async (req,res) => {
    const {token}=req.query
   try {
     const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY)
     const user=await userModel.findOne({email:decoded.email})
 
     if (!user) {
       return res.status(400).json({
         message:"Invalid Token",
         success:false,
         err:'User not found'
       })
     }
     user.verified=true
     await user.save()
    
     const html=`
     <h1>Email Verified Successfully</h1>
     <p>Your email has been verified.You can now log in to your account.</p>
     <a href="https://chatapp-frontend-z92f.onrender.com/login">Go to login</a>
     `
    return res.send(html);
   } catch (error) {
    return res.status(400).json({
      message:'Invalid Token',
      err:error.message
    })
   }
}

export const login=async (req,res) => {
  const {email,password}=req.body
  const user=await userModel.findOne({email})
if (!user) {
  return res.status(400).json({
    message:'Invalid Email'
  })
}
const isPasswordMatch=await bcrypt.compare(password,user.password)

if (!isPasswordMatch) {
  return res.status(400).json({
    message:'Invalid Password',
    success:false,
    err:'Incorrect password'
  })
}

if (!user.verified) {
 return res.status(400).json({
    message:'Please verify email before login',
    success:false,
    err:'Email not verified'
  })
}
const token=jwt.sign({
  id:user._id,
  username:user.username,
},process.env.JWT_SECRET_KEY)

res.cookie("token",token,{
    httpOnly: true,
   secure: true,
  sameSite: "None"
})

console.log("SECRET:", process.env.JWT_SECRET_KEY);


res.status(200).json({
  message:'Login Succesfully',
  success:true,
  username:user.username,
})
}

export const logout= async(req,res)=>{
  const token =req.cookies.token
  if(!token ){
    return res.status(400).json({
      message:'Token not found',
      success:false,
      err:'Token not found'
    })
  }
  res.clearCookie('token')
  res.status(200).json({
    message:'Logout successfully',
    success:true,
  })

  
}

export const getMe=async (req,res) => {
  const userId=req.user.id
  const user=await userModel.findById(userId).select('-password')
  if (!user) {
    return res.status(404).json({
      message:'User not found',
      success:false,
      err:'user not found'
    })
  }
  res.status(200).json({
    message:'User details fetched successfully',
    success:true,
    user
  })
}