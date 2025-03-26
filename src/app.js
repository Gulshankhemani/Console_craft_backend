import express from "express";
import cors from "cors"; //Cross-Origin Resource Sharing , middleware to enable CORS with various options
import cookieParser from "cookie-parser";// middleware to parse cookies attached to the client request object


// Create an instance of Express application , we can use express functionality 
const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,// Allow requests only from the specified origin (defined in environment variables)
    credentials:true // Allow sending cookies with cross-origin requests
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended:true, limit: "16kb"}));
app.use(express.static("public"));// Middleware to serve static files (e.g., images, CSS, JavaScript) from the "public" folder

app.use(cookieParser());


//routes import 

import UserRouter from "./routes/User.routes.js";
import VideoRouter from "./routes/video.routes.js";
import ImageRouter from "./routes/image.routes.js"

//routes declaration
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/videos", VideoRouter);
app.use("/api/v1/image", ImageRouter);

export default app;
