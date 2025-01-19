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
        limit : "16kb" 
    }
))
app.use(express.json({limit:"16kb"}))
app.use(cookieParser());//to parse cookies

export default app