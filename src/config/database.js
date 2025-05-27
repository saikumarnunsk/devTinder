const mongoose = require('mongoose');

const connectDB = async () =>{
 await mongoose.connect('mongodb+srv://saikumarnunnagoppula:P8pkg1XBMUyHwYgi@namastenode.qi8yegn.mongodb.net/devTinder')
}


module.exports = connectDB

