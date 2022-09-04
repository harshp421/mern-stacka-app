const { Route } = require("express");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const authentication = require('../middleware/authencation')
const cookieParser = require('cookie-parser')

//to save data in mongodb
//to connect db
require("../db/conn")
//to make modal
const User = require('../model/userSchema');

router.use(cookieParser())

router.get("/", (req, res) => {
  res.send("hello from home page router");
})

//using promicess 

// router.post("/register",(req,res)=>{

//     const {name,email,phone,work,password,cpassword}=req.body;

//     if(!name || !email || !phone ||!work || !password || !cpassword){
//         return res.status(420).json({error:"please fill the feild"})
//     }

//     User.findOne({email:email}).then((userExist)=>{
//       if(userExist){
//         return res.json({error:"email alwaready exixte"});
//       }
//       const user=new User({name,email,phone,work,password,cpassword});
//       user.save().then(()=>{
//           res.status(201).json({message:"user register successfull"})
//       }).catch((err)=>{
//         res.status(500).json({error:"faild to save data"})
//       })
//     }).catch(error=>{ console.log(error)});

// })

 
//register route
router.post("/register", async (req, res) => {
  const { name, email, phone, work, password, cpassword } = req.body;

  if (!name || !email || !phone || !work || !password || !cpassword) {
    return res.status(420).json({ error: "please fill the feild" })
  }

  try {

    const userExist = await User.findOne({ email: email })
    if (userExist) {
      return res.json({ error: "email alwaready exixte" });
    } else if (password != cpassword) {
      return res.json({ error: "passsword not match" })
    } else {

      const user = new User({ name, email, phone, work, password, cpassword });
      //bcrypt work hear
      const userRegister = await user.save();
      if (userRegister) {
        res.status(201).json({ message: "user register successfull" })
      } else {
        res.status(500).json({ error: "faild to save data" })
      }

    }

  } catch (err) {
    console.log(err)

  }
})

//login route
router.post("/signin", async (req, res) => {

  // console.log(req.body);
  // res.json({massage:"login data"})
  try {
    const { email, password } = req.body;

    if (!email || !password) 
     {
      return res.status(400).json({ massage: "please fell data" })
     }
    const usersignin = await User.findOne({ email: email })
    // console.log(usersignin);
    ///  we have to comapre  with bcrypt.compare

    if (usersignin) {
      const userop = await bcrypt.compare(password, usersignin.password);

      //make a function to jenrate token
      const token = await usersignin.generateauthtoken();

      //we have one methos to store data in cookie
      res.cookie('jwtoken', token, {
        expires: new Date(Date.now() + 258920000000),
        httpOnly: true
       })

      //console.log(token);

      if (!userop) 
      {
        res.status(400).json({ massage: "invallid credenttial" });
      } else {
        res.json({ massage: "user login succesfully" });
      }
    }
    else {
      res.status(400).json({ massage: "invalb credential email" })
    }

  } catch (error) {
    console.log(error);
  }


})

//about  us page

router.get("/about",authentication,(req,res)=>{
  res.send(req.rootuser)
})
//for getting data from contect us page
router.get("/useme",authentication,(req,res)=>{
  res.send(req.rootuser)
})


/// log out page funcnality
router.get("/logout",authentication,(req,res)=>{
  res.clearCookie('jwtoken',{path:'/'});
  res.status(200).send("user log out")
})



router.post('/contact',authentication,async(req,res)=>{
     
  try{
  const {name,email,phone,message} = req.body;
  if(!name || !email || !phone|| !message){
    console.log("errorr in contect form");
  }
 const userContact = await User.findOne({_id:req.userId});
  if(userContact){
    const UserMessage=  await userContact.Addmessage(name,email,phone,message)
     await userContact.save();
   //  alert("messsage send")
  }
  
}catch(e){
 console.log(e);
}
});
module.exports = router;