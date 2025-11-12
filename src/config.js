import dotenv from "dotenv";
dotenv.config();

export const {
  EMAIL_USER,
  EMAIL_PASS,
  NODE_ENV,
  JWT_SECRET,
  PORT = 1234,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
} = process.env;
