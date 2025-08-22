import express from "express";
import problemRoutes from "./routes/problemRoutes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Register routes
app.use("/problems", problemRoutes);

app.get("/", (req, res) => {
  res.send("LeetCode Clone Backend is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
