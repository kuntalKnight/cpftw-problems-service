import { getProblemService, getProblemByIdService, createProblemService, updateProblemService, deleteProblemService, searchProblemsService } from "../services/problem.service.js";
import ProblemRequestValidator from "../validators/problemRequest.validator.js";
import ProblemResponseValidator from "../validators/problemResponse.validator.js";

/**
 * Get all problems with pagination and filtering
 */
async function getProblems(req, res) {
    try {
        console.log('🔍 getProblems called with query:', req.query);
        
        // Validate request
        const validation = ProblemRequestValidator.validateGetProblems(req);
        console.log('✅ Validation result:', validation);
        
        if (!validation.isValid) {
            console.log('❌ Validation failed:', validation.errors);
            return res.status(validation.statusCode).json({
                success: false,
                message: validation.errors.join(', '),
                timestamp: new Date().toISOString(),
                statusCode: validation.statusCode
            });
        }
        
        // Extract validated parameters
        const { page = 1, limit = 10, difficulty, category } = req.query;
        console.log('📝 Extracted params:', { page, limit, difficulty, category });
        
        // Call service
        const result = await getProblemService({ page, limit, difficulty, category });
        
        // Validate and format response
        const responseValidation = ProblemResponseValidator.validateGetProblemsResponse(
            result.problems,
            parseInt(page),
            parseInt(limit),
            result.total
        );
        
        if (!responseValidation.isValid) {
            return res.status(responseValidation.statusCode).json(responseValidation.response);
        }
        
        res.status(responseValidation.statusCode).json(responseValidation.response);
    } catch (error) {
        console.error('❌ Error in getProblems controller:', error);
        const errorResponse = ProblemResponseValidator.validateProblemErrorResponse(error, 'retrieval');
        res.status(errorResponse.statusCode).json(errorResponse.response);
    }
}

/**
 * Get problem by ID
 */
async function getProblemById(req, res) {
    try {
        // Validate request
        const validation = ProblemRequestValidator.validateGetProblemById(req);
        if (!validation.isValid) {
            return res.status(validation.statusCode).json({
                success: false,
                message: validation.errors.join(', '),
                timestamp: new Date().toISOString(),
                statusCode: validation.statusCode
            });
        }

        const id = parseInt(req.params.id);
        
        // Call service
        const problem = await getProblemByIdService(id);
        
        // Validate and format response
        const responseValidation = ProblemResponseValidator.validateGetProblemByIdResponse(problem);
        
        if (!responseValidation.isValid) {
            return res.status(responseValidation.statusCode).json(responseValidation.response);
        }
        
        res.status(responseValidation.statusCode).json(responseValidation.response);
    } catch (error) {
        console.error('Error in getProblemById controller:', error);
        const errorResponse = ProblemResponseValidator.validateProblemErrorResponse(error, 'retrieval');
        res.status(errorResponse.statusCode).json(errorResponse.response);
    }
}

/**
 * Create new problem
 */
async function createProblem(req, res) {
    try {
        // Validate request
        const validation = ProblemRequestValidator.validateCreateProblem(req);
        if (!validation.isValid) {
            return res.status(validation.statusCode).json({
                success: false,
                message: validation.errors.join(', '),
                timestamp: new Date().toISOString(),
                statusCode: validation.statusCode
            });
        }

        // Call service with validated data
        const problem = await createProblemService(validation.validatedData);
        
        // Validate and format response
        const responseValidation = ProblemResponseValidator.validateCreateProblemResponse(problem);
        
        if (!responseValidation.isValid) {
            return res.status(responseValidation.statusCode).json(responseValidation.response);
        }
        
        res.status(responseValidation.statusCode).json(responseValidation.response);
    } catch (error) {
        console.error('Error in createProblem controller:', error);
        const errorResponse = ProblemResponseValidator.validateProblemErrorResponse(error, 'creation');
        res.status(errorResponse.statusCode).json(errorResponse.response);
    }
}

/**
 * Update problem by ID
 */
async function updateProblem(req, res) {
    try {
        // Validate request
        const validation = ProblemRequestValidator.validateUpdateProblem(req);
        if (!validation.isValid) {
            return res.status(validation.statusCode).json({
                success: false,
                message: validation.errors.join(', '),
                timestamp: new Date().toISOString(),
                statusCode: validation.statusCode
            });
        }

        const id = parseInt(req.params.id);
        
        // Call service
        const problem = await updateProblemService(id, validation.validatedData);
        
        // Validate and format response
        const responseValidation = ProblemResponseValidator.validateUpdateProblemResponse(problem);
        
        if (!responseValidation.isValid) {
            return res.status(responseValidation.statusCode).json(responseValidation.response);
        }
        
        res.status(responseValidation.statusCode).json(responseValidation.response);
    } catch (error) {
        console.error('Error in updateProblem controller:', error);
        const errorResponse = ProblemResponseValidator.validateProblemErrorResponse(error, 'update');
        res.status(errorResponse.statusCode).json(errorResponse.response);
    }
}

/**
 * Delete problem by ID
 */
async function deleteProblem(req, res) {
    try {
        // Validate request
        const validation = ProblemRequestValidator.validateDeleteProblem(req);
        if (!validation.isValid) {
            return res.status(validation.statusCode).json({
                success: false,
                message: validation.errors.join(', '),
                timestamp: new Date().toISOString(),
                statusCode: validation.statusCode
            });
        }

        const id = parseInt(req.params.id);
        
        // Call service
        const deleted = await deleteProblemService(id);
        
        // Validate and format response
        const responseValidation = ProblemResponseValidator.validateDeleteProblemResponse(deleted);
        
        if (!responseValidation.isValid) {
            return res.status(responseValidation.statusCode).json(responseValidation.response);
        }
        
        res.status(responseValidation.statusCode).json(responseValidation.response);
    } catch (error) {
        console.error('Error in deleteProblem controller:', error);
        const errorResponse = ProblemResponseValidator.validateProblemErrorResponse(error, 'deletion');
        res.status(errorResponse.statusCode).json(errorResponse.response);
    }
}

/**
 * Search problems
 */
async function searchProblems(req, res) {
    try {
        // Validate request
        const validation = ProblemRequestValidator.validateSearchProblems(req);
        if (!validation.isValid) {
            return res.status(validation.statusCode).json({
                success: false,
                message: validation.errors.join(', '),
                timestamp: new Date().toISOString(),
                statusCode: validation.statusCode
            });
        }

        const { query, page = 1, limit = 10, difficulty, category } = req.query;
        
        // Call service
        const result = await searchProblemsService({ query, page, limit, difficulty, category });
        
        // Validate and format response
        const responseValidation = ProblemResponseValidator.validateSearchProblemsResponse(
            result.problems,
            query,
            parseInt(page),
            parseInt(limit),
            result.total
        );
        
        if (!responseValidation.isValid) {
            return res.status(responseValidation.statusCode).json(responseValidation.response);
        }
        
        res.status(responseValidation.statusCode).json(responseValidation.response);
    } catch (error) {
        console.error('Error in searchProblems controller:', error);
        const errorResponse = ProblemResponseValidator.validateProblemErrorResponse(error, 'search');
        res.status(errorResponse.statusCode).json(errorResponse.response);
    }
}

export {
    getProblems,
    getProblemById,
    createProblem,
    updateProblem,
    deleteProblem,
    searchProblems
};
