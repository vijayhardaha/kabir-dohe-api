import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import apiRouter from "./api.js";

dotenv.config({ path: ".env.local" });

if (!process.env.PORT) {
  throw new Error("Missing required environment variable: PORT");
}

const app = express();
const port = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the Kabir Ke Dohe API! Explore our endpoints to retrieve and filter couplets.",
  });
});

// Base API route
app.use("/api", apiRouter);

// 404 Error Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Oops! The requested resource could not be found. Please check the URL and try again.",
  });
});

// Global Error Handler
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An unexpected error occurred. Please try again later.",
  });
});

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});
