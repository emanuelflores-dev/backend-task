import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { TaskModel } from "../models/task.model.js";

export class TaskController {
  static async getTaskUser(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, JWT_SECRET);

      const user_id = decoded.user_id;

      const tasks = await TaskModel.getAllTaskByUserId(user_id);

      res.status(200).json(tasks);
    } catch (error) {
      console.error("Error displaying tasks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async createTask(req, res) {
    try {
      const token = req.cookies.token;

      if (!token) return res.status(401).json({ message: "No token provided" });

      const decoded = jwt.verify(token, JWT_SECRET);

      const { task_title, task_description, task_content } = req.body;

      if (!task_title || !task_description || !task_content) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user_id = decoded.user_id;

      const newTask = await TaskModel.postTask(
        task_title,
        task_description,
        task_content,
        user_id
      );

      res.status(201).json({
        message: "Task created successfully",
        taskId: newTask.insertId,
      });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: error.message });
    }
  }
}
