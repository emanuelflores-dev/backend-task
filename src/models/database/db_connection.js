import mysql from "mysql2";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER } from "../../config.js";

// Create a connection database TaskManagerDB
export const dbConnection = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
});

dbConnection.connect((err) => {
  if (err) {
    throw err;
  }

  console.log("database connected correctly");
});
