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

// find user by email

app.get('/user', async (req, res)=>{
   const email = req.body.emailId
 try{
  const user = await User.find({emailId: email})
  if(user.length === 0){
    res.status(400).send('user not matched')
  }else{
 res.send(user)

  }
 }catch(error){
    res.status(400).send('Somethimg went wrong')
 }

})

app.get("/feed", async (req, res)=>{
   
    try{
    const users = await User.find({})
        console.log('users', users)
    if(users.length){
    await res.send(users)
    }else{
        res.status(400).send('no data avialble')
    }

    }catch(error){
        res.status(400).send('something wrong')
    }
})

app.delete("/user", async (req, res)=>{
    const userId = req.body.userId
    try{
        const user = await User.findByIdAndDelete(userId)
        res.send('user data deleted successfully')
    }catch(error){
        res.status(400).send('something wrong')
    }
})

// update the user of data


app.patch("/user", async (req, res)=>{
    const userId = req.body.userId
    const userData = req.body
    try{
        const user = await User.findByIdAndUpdate(userId, userData)
        res.send('user data updated successfully')
    }catch(error){
        res.status(400).send('something wrong')
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

