import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config.js";
import { userRoutes } from "./views/user.routes.js";
import { taskRoutes } from "./views/task.routes.js";
import { corsMiddleware } from "./middleware/cors.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);

app.get("/", (req, res) => {
  res.send({ message: "¡API MyTaskManager! 😎" });
});

app.use("/user", userRoutes);
app.use("/task", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server listen on port: http://localhost:${PORT}`);
});
