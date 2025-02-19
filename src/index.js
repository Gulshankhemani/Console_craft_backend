//require('dotenv').config({path:'./env'})


// Import the 'dotenv' package to load environment variables from a .env file  ,, to keep sensitive information (like database credentials) out of the code.
import dotenv from "dotenv";
// Import the function that connects to the MongoDB database
import connectDB from "./db/index.js";
// Import the Express application instance from the 'app.js' file
import app from "./app.js";

// Load environment variables from the '.env' file into `process.env`
dotenv.config({ path: "./.env" });

// Call the function to connect to the MongoDB database
connectDB()

.then(() => {
    // If the database connection is successful, start the server
     app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
     // If database connection fails, log the error message
    console.log("MONGO db connection failed !!! ", err);
})


/*
import express from "express"
const app =express()

;(async ()=>{
    try{
       await mongooes.connect(`${process.env.MONGODB_URI}/ ${DB_NAME}`)
       app.on("error",(error)=>{
              console.log("ERRR:",error)
              throw error
       })

       app.listen(process.env.PORT,()=>{
        console.log(`app is listning on port ${process.env.PORT}`);
       })
    }catch (error){
        console.error("Error", error)
        throw err 
    }
})()
*/
