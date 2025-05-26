
const express = require('express')


const app = express() // created a server

// Router, request handler
// order of the writing the code is an importent matter

app.get("/user/:id/:useName", (req, res)=>{
    // dynamic routes
    console.log(req.params)
    res.send({
        firstName: "saikumar", 
        age: 26
    })
})

app.get("/user", (req, res)=>{
    // accessing query parsms
    console.log(req.query)
    res.send({
        firstName: "saikumar", 
        age: 26
    })
})


app.post("/user", (req, res)=>{
    // write some code data in DB
    res.send("Data stored successfully")
})

app.delete("/user", (req, res)=>{
    // write some code data in DB
    res.send("Data deleted successfully")
})
// if you use "use" mathod it will match with all the http methods
app.use("/test",(req,res)=>{
    res.send("this is test rote")
})


app.listen(3000, ()=>{
    console.log('server is successfully listaning on port 3000')
})
