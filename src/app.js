import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Parse allowed origins from environment variable
const allowedOrigins = process.env.CORS_ORIGIN?.split(",") || [];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like curl or Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import UserRouter from "./routes/User.routes.js";
import VideoRouter from "./routes/video.routes.js";
import ImageRouter from "./routes/image.routes.js";
import likeRouter from "./routes/like.route.js";
import CommentRouter from "./routes/comment.route.js";
import Cart from "./routes/cart.router.js";
import payment from "./routes/payment.routes.js";

// Routes declaration
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/videos", VideoRouter);
app.use("/api/v1/image", ImageRouter);
app.use("/api/v1/like", likeRouter);
app.use("/api/v1/comments", CommentRouter);
app.use("/api/v1/cart", Cart);
app.use("/api/v1/payment", payment);

export default app;
