
const express = require('express')


const app = express() // created a server

// Router, request handler

app.use("/test",(req,res)=>{
    res.send("Hello I am listaningds tested!!!!")
})

app.listen(3000, ()=>{
    console.log('server is successfully listaning on port 3000')
})

