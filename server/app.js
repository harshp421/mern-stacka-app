const dotenv = require('dotenv');
const express = require("express")
const mongoose = require('mongoose')
const app = express();
require("./db/conn")
const User=require("./model/userSchema");


dotenv.config({ path: './config.env' })

const PORT = process.env.PORT;



//middlaware
app.use(express.json())
//we link routerfile 
app.use(require("./router/auth"))
// const middleware = () => {

//     console.log("hello middlaware")
//     // next();  //if we dont do that next our middelware will be in padding stage
// }
// middleware();



//routing

app.get("/", (req, res) => {

    res.send("hello from home page");

})

// app.get("/about", (req, res) => {

//     res.send("hello from about page page");

// })
// app.get("/contect", (req, res) => {

//     res.send("hello from contect page");

// })
 app.get("/signin", (req, res) => {

     res.send("hello from sign inpage");

 })
// app.get("/signup", (req, res) => {

//     res.send("hello from login  page");

// })
app.listen(PORT, () => {

    console.log(`the server is running in port ${PORT}`)

})