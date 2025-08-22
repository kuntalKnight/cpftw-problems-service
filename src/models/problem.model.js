import mongoose from 'mongoose';

// Test Case Schema
const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
    trim: true
  },
  output: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, { _id: true });

// Problem Schema
const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Problem title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  difficulty: {
    type: String,
    required: [true, 'Problem difficulty is required'],
    enum: {
      values: ['easy', 'medium', 'hard'],
      message: 'Difficulty must be one of: easy, medium, hard'
    },
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Problem category is required'],
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  testCases: {
    type: [testCaseSchema],
    required: [true, 'At least one test case is required'],
    validate: {
      validator: function(testCases) {
        return testCases && testCases.length > 0;
      },
      message: 'At least one test case is required'
    }
  },
  constraints: {
    type: [String],
    default: []
  },
  tags: {
    type: [String],
    default: []
  },
  timeLimit: {
    type: Number,
    default: 1000, // milliseconds
    min: [100, 'Time limit must be at least 100ms'],
    max: [30000, 'Time limit cannot exceed 30 seconds']
  },
  memoryLimit: {
    type: Number,
    default: 128, // MB
    min: [16, 'Memory limit must be at least 16MB'],
    max: [512, 'Memory limit cannot exceed 512MB']
  },
  submissions: {
    type: Number,
    default: 0
  },
  acceptedSubmissions: {
    type: Number,
    default: 0
  },
  acceptanceRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for acceptance rate calculation
problemSchema.virtual('calculatedAcceptanceRate').get(function() {
  if (this.submissions === 0) return 0;
  return Math.round((this.acceptedSubmissions / this.submissions) * 100);
});

// Indexes for better query performance
problemSchema.index({ title: 'text', description: 'text', category: 'text' });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ category: 1 });
problemSchema.index({ isActive: 1 });
problemSchema.index({ createdAt: -1 });

// Pre-save middleware to update acceptance rate
problemSchema.pre('save', function(next) {
  if (this.submissions > 0) {
    this.acceptanceRate = this.calculatedAcceptanceRate;
  }
  next();
});

// Static method to find problems by difficulty
problemSchema.statics.findByDifficulty = function(difficulty) {
  return this.find({ difficulty: difficulty.toLowerCase(), isActive: true });
};

// Static method to find problems by category
problemSchema.statics.findByCategory = function(category) {
  return this.find({ 
    category: { $regex: category, $options: 'i' }, 
    isActive: true 
  });
};

// Instance method to increment submissions
problemSchema.methods.incrementSubmissions = function() {
  this.submissions += 1;
  return this.save();
};

// Instance method to increment accepted submissions
problemSchema.methods.incrementAcceptedSubmissions = function() {
  this.acceptedSubmissions += 1;
  this.submissions += 1;
  return this.save();
};

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;
