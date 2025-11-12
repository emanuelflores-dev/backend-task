import { dbConnection } from "./database/db_connection.js";

export class UserModel {
  static async getAll() {
    return new Promise((resolve, reject) => {
      dbConnection.query("SELECT * FROM user", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
  }

  static getUser(user_handle) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        "SELECT * FROM user WHERE user_handle = ?",
        [user_handle],
        (err, results) => {
          if (err) reject(err);
          resolve(results[0]);
        }
      );
    });
  }

  static getByEmail(email_address) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        "SELECT * FROM user WHERE email_address = ?",
        [email_address],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0] || null);
        }
      );
    });
  }

  static getByVerificationToken(token) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        "SELECT * FROM user WHERE verification_token = ?",
        [token],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0] || null);
        }
      );
    });
  }

  static postUser(
    first_name,
    last_name,
    user_handle,
    email_address,
    user_password,
    verification_token,
    token_expires
  ) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        `INSERT INTO user
          (first_name, last_name, user_handle, email_address, user_password, 
           verification_token, token_expires, is_verified) 
          VALUES (?, ?, ?, ?, ?, ?, ?, FALSE)`,
        [first_name, last_name, user_handle, email_address, user_password, 
         verification_token, token_expires],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  static verifyUser(user_id) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        "UPDATE user SET is_verified = TRUE, verification_token = NULL WHERE user_id = ?",
        [user_id],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }

  static updateVerificationToken(user_id, token, expires) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        "UPDATE user SET verification_token = ?, token_expires = ? WHERE user_id = ?",
        [token, expires, user_id],
        (err, results) => {
          if (err) reject(err);
          resolve(results);
        }
      );
    });
  }
}
