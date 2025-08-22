import express from "express";
import problemRoutes from "./problem.route.js";

const router = express.Router();

// API v1 routes
router.use("/v1/problems", problemRoutes);

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0"
  });
});

// API info endpoint
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LeetCode Clone Backend API",
    version: "1.0.0",
    endpoints: {
      problems: "/api/v1/problems",
      health: "/api/health"
    },
    timestamp: new Date().toISOString()
  });
});

export default router;
