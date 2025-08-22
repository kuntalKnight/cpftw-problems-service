import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";

// Import database connection
import connectToDatabase from "./config/db.config.js";

// Import middleware
import { 
    corsMiddleware, 
    rateLimitMiddleware, 
    requestLoggerMiddleware 
} from "./middlewares/index.js";

// Import interceptors
import { 
    traceIdInterceptor, 
    requestContextInterceptor, 
    userContextInterceptor 
} from "./interceptors/index.js";

// Import API routes
import apiRouter from "./routes/api.router.js";

dotenv.config();

const app = express();

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  });

// Global middleware (applied to all routes)
app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(requestLoggerMiddleware);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global interceptors (applied to all routes)
app.use(traceIdInterceptor);
app.use(requestContextInterceptor);
app.use(userContextInterceptor);

// API routes with versioning
app.use("/api", apiRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LeetCode Clone Backend is running!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
    database: "MongoDB",
    endpoints: {
      api: "/api",
      health: "/api/health"
    }
  });
});

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: "NOT_FOUND",
    timestamp: new Date().toISOString(),
    requestedUrl: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message || "Unknown error",
    timestamp: new Date().toISOString(),
    traceId: req.traceId
  });
});

export default app;
