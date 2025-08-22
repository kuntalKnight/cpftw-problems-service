// import express from "express";
// import { getProblems, getProblemById } from "../controllers/problemController.js";

// const router = express.Router();

// // GET /problems
// router.get("/", getProblems);

// // GET /problems/:id
// router.get("/:id", getProblemById);

// export default router;

import express from "express";
import { getProblems, getProblemById } from "../controllers/problemController.js";

const router = express.Router();

router.get("/problems", getProblems);
router.get("/problems/:id", getProblemById);

export default router;