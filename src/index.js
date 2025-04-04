import express from "express";

import apiRouter from "./api.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Welcome route
/**
 * GET / - Welcome route for the API.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
app.get("/", (req, res) => {
  res.json("Welcome to the Kabir Ke Dohe API! Explore our endpoints to retrieve and filter couplets.");
});

// Base API route
/**
 * API routes are handled by the apiRouter.
 * @type {import('express').Router}
 */
app.use("/api", apiRouter);

// 404 Error Handler
/**
 * Middleware to handle 404 errors.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Oops! The requested resource could not be found. Please check the URL and try again.",
  });
});

// Start the server
/**
 * Starts the Express server and listens on the specified port.
 */
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
