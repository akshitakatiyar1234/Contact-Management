// const mongoose=require('mongoose');

// const connectDB=async()=>{
//     return mongoose
//     .connect('mongodb+srv://aditya:X8z5Bx8tfRNmB1ik@ecommerce.k8a4tuz.mongodb.net/contact_management')
//     .then(()=>console.log("Connected to database successfully"))
//     .catch((err)=>console.log(err));
// };

// module.exports=connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log(`connected to database successfully`))
    .catch((err) => console.log(err));
};

module.exports = connectDB;