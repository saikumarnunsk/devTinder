
const express = require('express')


const app = express() // created a server

// Router, request handler
// order of the writing the code is an importent matter
app.use("/user", (req,res, next)=>{
    console.log('this is me')
    next() // next will execute the next request handler function
},  (req,res, next)=>{
    // res.send("Route handler 1")
    res.send("Route handler 2")
    next()
    console.log('this is me 2')
}, (req,res, next)=>{
    // res.send("Route handler 1")
    res.send("Route handler 2")
    console.log('this is me 2')
},
(req,res, next)=>{
    // res.send("Route handler 1")
    res.send("Route handler 2")
    console.log('this is me 2')
})


app.listen(3000, ()=>{
    console.log('server is successfully listaning on port 3000')
})
