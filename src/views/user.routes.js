import express from "express";
import { UserController } from "../controllers/user.controller.js";

export const userRoutes = express.Router();

userRoutes.get("/", UserController.getAll);
userRoutes.post("/register", UserController.createUser);
userRoutes.post("/login", UserController.loginUser);
userRoutes.post("/logout", UserController.logoutUser);
userRoutes.get("/verify/:token", UserController.verifyEmail);
userRoutes.post("/resend-verification", UserController.resendVerification);
userRoutes.get("/:userHandle", UserController.getByUserHandle);
