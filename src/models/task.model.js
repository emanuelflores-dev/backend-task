import { dbConnection } from "./database/db_connection.js";

export class TaskModel {
  static getAllTaskByUserId(user_id) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        `SELECT * FROM task WHERE user_id = ?`,
        [user_id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }

  static postTask(task_title, task_description, task_content, user_id) {
    return new Promise((resolve, reject) => {
      dbConnection.query(
        `INSERT INTO task (task_title, task_description, task_content, user_id) VALUES (?,?,?,?)`,
        [task_title, task_description, task_content, user_id],
        (err, results) => {
          if (err) reject(err);

          resolve(results);
        }
      );
    });
  }
}
