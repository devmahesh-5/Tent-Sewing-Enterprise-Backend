import express from "express";
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();

//cors setup to allow cross origin request
app.use(cors(
    {
        origin:process.env.ORIGIN,
        credentials:true
    }
))

app.use(express.static("public"))

app.use(express.urlencoded(
    {
        extended: true,
        limit : "10mb" 
    }
))
app.use(express.json({limit:"10mb"}))
app.use(cookieParser());//to parse cookies

    //import routes
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import achivementRouter from "./routes/achivement.routes.js";

//user routes
app.use("/api/v1/users",userRouter);

//product routes
app.use("/api/v1/products",productRouter);

//achivement routes
app.use("/api/v1/achivements",achivementRouter);
export default app