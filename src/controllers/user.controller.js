import { UserModel } from "../models/user.model.js";
import { JWT_SECRET, NODE_ENV, EMAIL_USER, EMAIL_PASS } from "../config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // o tu proveedor de email
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS, // App password de Gmail
  },
});

// Función de validación de email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export class UserController {
  static async getAll(req, res) {
    try {
      const users = await UserModel.getAll();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req, res) {
    try {
      const {
        first_name,
        last_name,
        user_handle,
        email_address,
        user_password,
      } = req.body;

      // Validación de campos requeridos
      if (
        !first_name ||
        !last_name ||
        !user_handle ||
        !email_address ||
        !user_password
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Validación de formato de email
      if (!validateEmail(email_address)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Verificar si el email ya existe
      const existingEmail = await UserModel.getByEmail(email_address);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }

      // Verificar si el user_handle ya existe
      const existingHandle = await UserModel.getUser(user_handle);
      if (existingHandle) {
        return res.status(409).json({ message: "Username already taken" });
      }

      // Validación de contraseña (mínimo 8 caracteres)
      if (user_password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters long",
        });
      }

      const hashedPassword = await bcrypt.hash(user_password, 10);

      // Generar token de verificación
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      const result = await UserModel.postUser(
        first_name,
        last_name,
        user_handle,
        email_address,
        hashedPassword,
        verificationToken,
        tokenExpires
      );

      // Enviar email de verificación
      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/user/verify/${verificationToken}`;

      const mailOptions = {
        from: EMAIL_USER,
        to: email_address,
        subject: "Verify your email - MyTaskManager",
        html: `
          <h1>Welcome to MyTaskManager!</h1>
          <p>Hi ${first_name},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message:
          "User created successfully. Please check your email to verify your account.",
        userId: result.insertId,
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: error.message });
    }
  }

  static async verifyEmail(req, res) {
    try {
      const { token } = req.params;

      const user = await UserModel.getByVerificationToken(token);

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }

      // Verificar si el token ha expirado
      if (new Date() > new Date(user.token_expires)) {
        return res
          .status(400)
          .json({ message: "Verification token has expired" });
      }

      // Marcar usuario como verificado
      await UserModel.verifyUser(user.user_id);

      res
        .status(200)
        .json({ message: "Email verified successfully. You can now login." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resendVerification(req, res) {
    try {
      const { email_address } = req.body;

      if (!email_address) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await UserModel.getByEmail(email_address);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.is_verified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Generar nuevo token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await UserModel.updateVerificationToken(
        user.user_id,
        verificationToken,
        tokenExpires
      );

      // Enviar email
      const verificationLink = `${req.protocol}://${req.get(
        "host"
      )}/user/verify/${verificationToken}`;

      const mailOptions = {
        from: EMAIL_USER,
        to: email_address,
        subject: "Verify your email - MyTaskManager",
        html: `
          <h1>Email Verification</h1>
          <p>Hi ${user.first_name},</p>
          <p>Please verify your email address by clicking the link below:</p>
          <a href="${verificationLink}">Verify Email</a>
          <p>This link will expire in 24 hours.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async loginUser(req, res) {
    try {
      const { email_address, user_password } = req.body;

      if (!email_address || !user_password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await UserModel.getByEmail(email_address);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verificar si el email está verificado
      if (!user.is_verified) {
        return res.status(403).json({
          message: "Please verify your email before logging in",
        });
      }

      const isMatch = await bcrypt.compare(user_password, user.user_password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          user_handle: user.user_handle,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user.user_id,
          name: user.first_name,
          email: user.email_address,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  }

  static async getByUserHandle(req, res) {
    const { userHandle } = req.params;
    try {
      const user = await UserModel.getUser(userHandle);

      if (!user || user.length === 0) {
        return res.status(404).json({
          message: `The user ${userHandle} does not exist`,
        });
      }

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
