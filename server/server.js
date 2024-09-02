import dotenv from 'dotenv/config';
import express from "express";
import cors from 'cors';
import db from "./db.js";

const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_FRONTEND,
    credentials: true
  }));
app.get("/", async(req, res) => {
  try {
    const sql = "SELECT * FROM writing";
    const [result] = await db.query(sql);
    res.json(result);
    console.log(result);
    console.table(result);
  } catch (error) {
    console.error("Database error:", error);
  }
});

app.listen(PORT, () => {
  console.log(`Server escuchando en el puerto ${PORT}`);
});
