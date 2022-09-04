const jwt=require('jsonwebtoken')
const User=require("../model/userSchema")
const dotenv = require("dotenv");
dotenv.config({ path: './config.env' })

const Authentication=async(req,res,next)=>{



    try
    {
        //compering the token
        //geeting token
        const token=req.cookies.jwtoken;
        //now we varify the token
        const verifytoken=jwt.verify(token,process.env.SECRET_KEY)
        //now check for the user
        /// comparing the token form cookie and the token from mongodb
        const rootuser= await User.findOne({_id:verifytoken._id,"tokens.token":token});
               
        if(!rootuser){ throw new Error('use not found')}
        console.log(rootuser);
        
        req.token=token;
        req.rootuser=rootuser;
        req.userId=rootuser._id;
        next(); 
    }catch(error){
        res.status(401).send("no token provaided");
       console.log(error)
    }

}
module.exports=Authentication;