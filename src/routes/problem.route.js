import express from "express";
import { 
    getProblems, 
    getProblemById, 
    createProblem, 
    updateProblem, 
    deleteProblem, 
    searchProblems 
} from "../controllers/problem.controller.js";

const router = express.Router();

// GET /api/v1/problems - Get all problems with pagination and filtering
router.get("/", getProblems);

// GET /api/v1/problems/search - Search problems
router.get("/search", searchProblems);

// GET /api/v1/problems/:id - Get problem by ID
router.get("/:id", getProblemById);

// POST /api/v1/problems - Create new problem
router.post("/", createProblem);

// PUT /api/v1/problems/:id - Update problem by ID
router.put("/:id", updateProblem);

// DELETE /api/v1/problems/:id - Delete problem by ID
router.delete("/:id", deleteProblem);

export default router;