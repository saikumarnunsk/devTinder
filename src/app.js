
const express = require('express')

const {adminAuth, userAuth} = require('./middlewares/auth')


const app = express() 

app.get("/getUserData", (req, res)=>{
    // try{
        throw new Error("this is me")
        // res.send("User Data sent")
    // }catch(err){
    //     res.status(500).send("Some Error contact support team")
    // }
})

app.use('/', (err, req, res)=>{
    if(err){
        res.status(500).send("Some Error contact support team handled in global")
    }
})



app.listen(3000, ()=>{
    console.log('server is successfully listaning on port 3000')
})
