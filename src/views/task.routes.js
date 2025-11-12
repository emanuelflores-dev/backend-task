import { Router } from "express";
import { verifyCookieToken } from "../middleware/auth.middleware.js";
import { TaskController } from "../controllers/task.controller.js";

export const taskRoutes = Router();

taskRoutes.get("/", verifyCookieToken, TaskController.getTaskUser);
taskRoutes.post("/", verifyCookieToken, TaskController.createTask);
