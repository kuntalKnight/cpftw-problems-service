// import { problems } from "../data/problems.js";

// // Get all problems
// export const getProblems = (req, res) => {
//   res.json(problems);
// };

// // Get problem by ID
// export const getProblemById = (req, res) => {
//   const id = parseInt(req.params.id);
//   const problem = problems.find(p => p.id === id);

//   if (!problem) {
//     return res.status(404).json({ message: "Problem not found" });
//   }

//   res.json(problem);
// };

import {getProblemService, getProblemByIdService} from "../services/problemService.js";

export default async function getProblems(req, res) {
    try {
        const problems = await getProblemService();
        res.json(problems);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
    
}

export async function getProblemById(req, res) {
    const id = parseInt(req.params.id);
    try {
        const problem = await getProblemByIdService(id);
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }
        res.json(problem);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}