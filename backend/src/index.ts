import express from "express"
import router from "./routes/index.js";
import dbConnect from "./config/db.js";
import cors from "cors"

const app = express();
app.use(cors());
app.use(express.json());

await dbConnect();
app.use("/api/v1", router);
app.listen(3000, ()=>{
    console.log("Server is Running at Port 3000");
})