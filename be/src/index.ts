import express from "express";
import dotenv from "dotenv";
import routerV1 from "./routes/v1";
import cors from 'cors'

dotenv.config();


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use("/api/v1", routerV1);



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});