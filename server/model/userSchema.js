const mongoose = require("mongoose");
const dotenv = require('dotenv');
const bcrypt= require("bcryptjs")
const jwt = require('jsonwebtoken')
dotenv.config({ path: './config.env' })
const userSchema= new  mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    work:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    cpassword:{
        type:String,
        require:true
    },
    data:{
      type:Date,
      default:Date.now
    },
    messages:[
        {
            name:{
                type:String,
                require:true
            },
            email:{
                type:String,
                require:true
            },
            phone:{
                type:Number,
                require:true
            },
            message:{
                type:String,
                require:true
            },
        }
    ],
    tokens:[
        {
            token:{
                type:String,
                require:true
            }
        }
    ]
})

userSchema.pre('save',async function(next){
    console.log("hii from in side")
 if(this.isModified('password'))
 {
  this.password= await bcrypt.hash(this.password,12);
  this.cpassword=await bcrypt.hash(this.cpassword,12);
 }
 next();
})
//genrate token
userSchema.methods.generateauthtoken = async function(){

    try{
        //this will geneate token
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
        this.tokens=this.tokens.concat({token:token})
        await this.save();
        return token;

    }catch(error){
       console.log(error);
    }

}

//store the messsage
userSchema.methods.Addmessage= async function( name,email,phone,message){
   
    try{

        this.messages=this.messages.concat({name,email,phone,message})
        await this.save();
        return this.messages;

    }catch(e){
console.log(e);
    }
}
const User= mongoose.model("USER",userSchema);
module.exports=User;