import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import route from "./routes/route1.js";

const app =express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.text());
app.use(express.urlencoded());

route(app);

export default app;

