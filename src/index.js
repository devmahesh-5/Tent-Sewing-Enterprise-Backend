
import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({ path: '../.env' });










connectDB().then(() => {

    app.on("error", (err) => {
        console.log(err);
        throw err;
    });

    app.listen(process.env.PORT || 3000, () => {
        console.log(`\n Server started on port ${process.env.PORT || 8000} !! \n`);
    });
}).catch((err) => {
    console.log("Database connection Error",err);
    process.exit(1);
});