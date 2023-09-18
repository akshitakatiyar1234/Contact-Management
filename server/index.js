require("dotenv").config({ path: "./config/config.env" });
const express = require("express");
const morgan = require("morgan");
const cors=require("cors");
const connectDB = require("./config/db");

const auth = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(morgan("tiny"));
app.use(require("cors")());

// routes
app.use(cors());
app.use("/api", require("./routes/auth"));
app.use("/api", require("./routes/contact"));

//server
const PORT=process.env.PORT||8000;
app.listen(PORT,async()=>{
    try {
        await connectDB();
        console.log("SERVER IS RUNNING");
    } catch (error) {
        console.log(error);
    }
    
})