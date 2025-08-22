/**
 * Data Seeder Script
 * Populates MongoDB with initial problem data
 */
import mongoose from 'mongoose';
import Problem from '../models/problem.model.js';
import connectToDatabase from '../config/db.config.js';

// Sample problem data
const sampleProblems = [
  {
    title: "Two Sum",
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
    difficulty: "easy",
    category: "Array",
    testCases: [
      {
        input: "[2,7,11,15], target = 9",
        output: "[0,1]",
        description: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "[3,2,4], target = 6",
        output: "[1,2]",
        description: "Because nums[1] + nums[2] == 6, we return [1, 2]."
      },
      {
        input: "[3,3], target = 6",
        output: "[0,1]",
        description: "Because nums[0] + nums[1] == 6, we return [0, 1]."
      }
    ],
    constraints: [
      "2 <= nums.length <= 104",
      "-109 <= nums[i] <= 109",
      "-109 <= target <= 109",
      "Only one valid answer exists"
    ],
    tags: ["array", "hash-table", "two-pointers"],
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Add Two Numbers",
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list. You may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    difficulty: "medium",
    category: "Linked List",
    testCases: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        description: "342 + 465 = 807"
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]",
        description: "0 + 0 = 0"
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]",
        description: "9999999 + 9999 = 10009998"
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros"
    ],
    tags: ["linked-list", "math", "recursion"],
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "medium",
    category: "String",
    testCases: [
      {
        input: "s = \"abcabcbb\"",
        output: "3",
        description: "The answer is \"abc\", with the length of 3."
      },
      {
        input: "s = \"bbbbb\"",
        output: "1",
        description: "The answer is \"b\", with the length of 1."
      },
      {
        input: "s = \"pwwkew\"",
        output: "3",
        description: "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 104",
      "s consists of English letters, digits, symbols and spaces"
    ],
    tags: ["string", "sliding-window", "hash-table"],
    timeLimit: 1000,
    memoryLimit: 128
  },
  {
    title: "Median of Two Sorted Arrays",
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
    difficulty: "hard",
    category: "Array",
    testCases: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        description: "merged array = [1,2,3] and median is 2."
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        description: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-106 <= nums[i], nums2[i] <= 106"
    ],
    tags: ["array", "binary-search", "divide-and-conquer"],
    timeLimit: 2000,
    memoryLimit: 256
  },
  {
    title: "Valid Parentheses",
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "easy",
    category: "Stack",
    testCases: [
      {
        input: "s = \"()\"",
        output: "true",
        description: "Simple valid parentheses"
      },
      {
        input: "s = \"()[]{}\"",
        output: "true",
        description: "Multiple valid parentheses"
      },
      {
        input: "s = \"(]\"",
        output: "false",
        description: "Invalid parentheses"
      }
    ],
    constraints: [
      "1 <= s.length <= 104",
      "s consists of parentheses only '()[]{}'"
    ],
    tags: ["stack", "string"],
    timeLimit: 1000,
    memoryLimit: 128
  }
];

/**
 * Seed the database with sample problems
 */
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await connectToDatabase();
    
    // Show connection details
    console.log(`📊 Connected to database: ${mongoose.connection.db.databaseName}`);
    console.log(`🔗 Connection string: ${mongoose.connection.host}:${mongoose.connection.port}`);
    
    // Clear existing problems
    console.log('🗑️  Clearing existing problems...');
    const deleteResult = await Problem.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} existing problems`);
    
    // Insert sample problems
    console.log('📝 Inserting sample problems...');
    const insertedProblems = await Problem.insertMany(sampleProblems);
    console.log(`✅ Successfully inserted ${insertedProblems.length} problems`);
    
    // Verify insertion
    const totalProblems = await Problem.countDocuments({});
    console.log(`📊 Total problems in database after insertion: ${totalProblems}`);
    
    // Display inserted problems
    console.log('\n📊 Inserted Problems:');
    insertedProblems.forEach((problem, index) => {
      console.log(`${index + 1}. ${problem.title} (${problem.difficulty}) - ${problem.category}`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeder
seedDatabase();
