import express from "express";
import cors from 'cors';
import db from "./db.js";

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', "https://exciting-miracle-production.up.railway.app/"],
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

app.listen(3000, () => {
  console.log("Server escuchando en el puerto 3000");
});
