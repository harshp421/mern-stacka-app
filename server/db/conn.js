//mongo atlace
//uname=: harsh
//password:=harshparmar
//mongo script=:mongodb+srv://harsh:<password>@cluster0.46zey.mongodb.net/?retryWrites=true&w=majority
//MIddleware

const mongoose=require("mongoose")
const dotenv= require('dotenv');
dotenv.config({path:'./config.env'})


const db=process.env.DATABASE;
mongoose.connect(db).then(()=>{ console.log(`connect succesfulll`)}).catch((err)=>{console.log(`no conect`)});
