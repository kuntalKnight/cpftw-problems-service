/**
 * Problem Service
 * Contains business logic for problem operations
 */
import problemRepository from '../repositories/problem.repository.js';

/**
 * Get all problems with pagination and filtering
 */
export async function getProblemService(filters = {}) {
  try {
    console.log('🔍 getProblemService called with filters:', filters);
    const result = await problemRepository.findAll(filters);
    console.log('✅ getProblemService result:', { count: result.problems.length, total: result.total });
    return result;
  } catch (error) {
    console.error('❌ Error in getProblemService:', error);
    throw new Error('Failed to retrieve problems');
  }
}

/**
 * Get problem by ID
 */
export async function getProblemByIdService(id) {
  try {
    const problem = await problemRepository.findById(id);
    if (!problem) {
      const error = new Error('Problem not found');
      error.name = 'NotFoundError';
      throw error;
    }
    return problem;
  } catch (error) {
    console.error('Error in getProblemByIdService:', error);
    throw error;
  }
}

/**
 * Create new problem
 */
export async function createProblemService(problemData) {
  try {
    // Additional business logic can be added here
    // For example: validation, authorization checks, etc.
    
    const newProblem = await problemRepository.create(problemData);
    return newProblem;
  } catch (error) {
    console.error('Error in createProblemService:', error);
    throw new Error('Failed to create problem');
  }
}

/**
 * Update problem by ID
 */
export async function updateProblemService(id, updateData) {
  try {
    // Check if problem exists
    const existingProblem = await problemRepository.findById(id);
    if (!existingProblem) {
      const error = new Error('Problem not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Additional business logic can be added here
    // For example: validation, authorization checks, etc.
    
    const updatedProblem = await problemRepository.update(id, updateData);
    return updatedProblem;
  } catch (error) {
    console.error('Error in updateProblemService:', error);
    throw error;
  }
}

/**
 * Delete problem by ID
 */
export async function deleteProblemService(id) {
  try {
    // Check if problem exists
    const existingProblem = await problemRepository.findById(id);
    if (!existingProblem) {
      const error = new Error('Problem not found');
      error.name = 'NotFoundError';
      throw error;
    }
    
    // Additional business logic can be added here
    // For example: authorization checks, dependency checks, etc.
    
    const deleted = await problemRepository.delete(id);
    return deleted;
  } catch (error) {
    console.error('Error in deleteProblemService:', error);
    throw error;
  }
}

/**
 * Search problems
 */
export async function searchProblemsService(searchParams) {
  try {
    return await problemRepository.search(searchParams);
  } catch (error) {
    console.error('Error in searchProblemsService:', error);
    throw new Error('Failed to search problems');
  }
}
