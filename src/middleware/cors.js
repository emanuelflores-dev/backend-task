export const ACCEPTED_ORIGINS = ["http://127.0.0.1:3001"];

export const corsMiddleware = (req, res, next) => {
  const origin = req.header("origin");
  if (ACCEPTED_ORIGINS.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};
