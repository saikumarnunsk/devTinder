const express = require('express')
const connectDB = require("./config/database")
const app = express() 
const User = require('./models/user')

app.use(express.json())

app.post("/signup",async (req, res)=>{
   const userObject = req.body
   // creating new instance of the user modal
   const user = new User(userObject)

   try{
        await user.save()
        res.send('user added succsessfully !!!!')
   }catch(error){
        res.status(400).send("error saving the user:" + error.message)
   }

})

connectDB().then(()=>{
    console.log('Database connected successfully')
    app.listen(3000, ()=>{
    console.log('server is successfully listaning on port 3000')
})
}).catch((error)=>{
    console.log("Database cannot be connected", error.message)
})

