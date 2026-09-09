import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

export default app;