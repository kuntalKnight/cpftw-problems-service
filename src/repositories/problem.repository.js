/**
 * Problem Repository
 * Handles data access and persistence for problems using MongoDB
 */
import Problem from '../models/problem.model.js';

class ProblemRepository {
  /**
   * Get all problems with pagination and filtering
   */
  async findAll(filters = {}) {
    try {
      const { page = 1, limit = 10, difficulty, category } = filters;
      
      console.log('🔍 findAll called with filters:', filters);
      
      // Build query (treat docs without isActive as active)
      const query = { $or: [ { isActive: { $exists: false } }, { isActive: true } ] };
      
      if (difficulty) {
        query.difficulty = difficulty.toLowerCase();
      }
      
      if (category) {
        query.category = { $regex: category, $options: 'i' };
      }
      
      console.log('🔍 MongoDB query:', JSON.stringify(query, null, 2));
      
      // Execute query with pagination
      const total = await Problem.countDocuments(query);
      console.log('📊 Total documents found:', total);
      
      const problems = await Problem.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();
      
      console.log('📝 Problems retrieved:', problems.length);
      
      return {
        problems,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('❌ Error in findAll:', error);
      throw new Error('Failed to retrieve problems');
    }
  }

  /**
   * Find problem by ID
   */
  async findById(id) {
    try {
      const problem = await Problem.findById(id).lean();
      return problem;
    } catch (error) {
      console.error('Error in findById:', error);
      throw new Error('Failed to retrieve problem');
    }
  }

  /**
   * Create new problem
   */
  async create(problemData) {
    try {
      const problem = new Problem(problemData);
      const savedProblem = await problem.save();
      return savedProblem.toObject();
    } catch (error) {
      console.error('Error in create:', error);
      if (error.code === 11000) {
        throw new Error('Problem with this title already exists');
      }
      throw new Error('Failed to create problem');
    }
  }

  /**
   * Update problem by ID
   */
  async update(id, updateData) {
    try {
      const updatedProblem = await Problem.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();
      
      if (!updatedProblem) {
        throw new Error('Problem not found');
      }
      
      return updatedProblem;
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  }

  /**
   * Delete problem by ID (soft delete)
   */
  async delete(id) {
    try {
      const deletedProblem = await Problem.findByIdAndUpdate(
        id,
        { isActive: false, updatedAt: new Date() },
        { new: true }
      );
      
      if (!deletedProblem) {
        throw new Error('Problem not found');
      }
      
      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  }

  /**
   * Search problems
   */
  async search(searchParams) {
    try {
      const { query, page = 1, limit = 10, difficulty, category } = searchParams;
      
      // Build search query (treat docs without isActive as active)
      const searchQuery = { $or: [ { isActive: { $exists: false } }, { isActive: true } ] };
      
      if (query) {
        searchQuery.$text = { $search: query };
      }
      
      if (difficulty) {
        searchQuery.difficulty = difficulty.toLowerCase();
      }
      
      if (category) {
        searchQuery.category = { $regex: category, $options: 'i' };
      }
      
      // Execute search with pagination
      const total = await Problem.countDocuments(searchQuery);
      const problems = await Problem.find(searchQuery)
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();
      
      return {
        problems,
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      console.error('Error in search:', error);
      throw new Error('Failed to search problems');
    }
  }

  /**
   * Get problems by difficulty
   */
  async findByDifficulty(difficulty) {
    try {
      return await Problem.findByDifficulty(difficulty).lean();
    } catch (error) {
      console.error('Error in findByDifficulty:', error);
      throw new Error('Failed to retrieve problems by difficulty');
    }
  }

  /**
   * Get problems by category
   */
  async findByCategory(category) {
    try {
      return await Problem.findByCategory(category).lean();
    } catch (error) {
      console.error('Error in findByCategory:', error);
      throw new Error('Failed to retrieve problems by category');
    }
  }

  /**
   * Get problem statistics
   */
  async getStatistics() {
    try {
      const stats = await Problem.aggregate([
        { $match: { $or: [ { isActive: { $exists: false } }, { isActive: true } ] } },
        {
          $group: {
            _id: null,
            totalProblems: { $sum: 1 },
            easyProblems: { $sum: { $cond: [{ $eq: ['$difficulty', 'easy'] }, 1, 0] } },
            mediumProblems: { $sum: { $cond: [{ $eq: ['$difficulty', 'medium'] }, 1, 0] } },
            hardProblems: { $sum: { $cond: [{ $eq: ['$difficulty', 'hard'] }, 1, 0] } },
            totalSubmissions: { $sum: '$submissions' },
            totalAcceptedSubmissions: { $sum: '$acceptedSubmissions' }
          }
        }
      ]);
      
      return stats[0] || {
        totalProblems: 0,
        easyProblems: 0,
        mediumProblems: 0,
        hardProblems: 0,
        totalSubmissions: 0,
        totalAcceptedSubmissions: 0
      };
    } catch (error) {
      console.error('Error in getStatistics:', error);
      throw new Error('Failed to retrieve statistics');
    }
  }
}

export default new ProblemRepository();
