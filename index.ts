import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { trainRouter } from "./src/routers/trainRouter";

const PORT = process.env.PORT || 4000;

const app = express();

app.use(express.json());
app.use("/", trainRouter);

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Server is running on port 4000, at host http://localhost:4000`);
});
