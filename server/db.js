import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "mysql.railway.internal",
  user: "root",
  database: "railway",
  password: "obAGhUdmDsLctHPpQLbGEZyfoaPSmJFR",
});

export default db;
