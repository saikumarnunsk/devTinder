
const express = require('express')

const {adminAuth, userAuth} = require('./middlewares/auth')


const app = express() // created a server
//handle Auth middleware for all request GET, Post...etc using middleware

app.use("/admin", adminAuth)

app.post("/user/login", (req, res)=>{
    res.send('user logged in successfully!')
})

app.get("/user", userAuth ,(req,res)=>{
    res.send('User data send')
})

app.get("/admin/getAllData",(req,res)=>{s
    res.send('All Data sent')
})

app.get("/admin/deleteUser",(req,res)=>{
    console.log('admin delete log ')
    res.send('Data user data')
})

app.listen(3000, ()=>{
    console.log('server is successfully listaning on port 3000')
})
