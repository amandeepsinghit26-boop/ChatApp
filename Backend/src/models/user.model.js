import mongoose from 'mongoose'
const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
},
password:{
    type:String,
    required:true,
    minlength:6
},
verified:{
    type:Boolean,
    default:false
}
},{
timestamps:true
})

const userModel= mongoose.model('user',userSchema)

export default userModel