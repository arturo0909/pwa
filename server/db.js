import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "cdi",
  password: "arturo09",
});

export default db;