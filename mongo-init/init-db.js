// This script will run when MongoDB container starts for the first time
// Debug version with detailed logging

print('🚀 === MongoDB Initialization Script Starting ===');
print('Current user context:', db.runCommand({ connectionStatus: 1 }));

// Switch to the leetcode database
print('🔄 Switching to leetcode database...');
db = db.getSiblingDB('leetcode');
print('📍 Current database:', db.getName());

// First, let's check if we can write to this database
try {
    print('🧪 Testing database write permissions...');
    var testResult = db.test.insertOne({ test: true, timestamp: new Date() });
    print('✅ Write test successful. Inserted ID:', testResult.insertedId);
    db.test.drop();
    print('🗑️ Test collection cleaned up');
} catch (error) {
    print('❌ Write test failed:', error);
}

// Create a user specifically for the leetcode database
print('👤 Creating leetcodeuser...');
try {
    var userResult = db.createUser({
        user: "leetcodeuser",
        pwd: "leetcodepass",
        roles: [
            {
                role: "readWrite",
                db: "leetcode"
            }
        ]
    });
    print('✅ leetcodeuser created successfully');
} catch (error) {
    print('⚠️ User creation error (might already exist):', error.message);
}

// Seed problems data
print('🌱 Starting to seed problems collection...');
print('📊 Current problems count before insert:', db.problems.countDocuments());

try {
    var problemsData = [
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
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
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
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
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
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
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
            memoryLimit: 256,
            createdAt: new Date(),
            updatedAt: new Date()
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
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        // New problems added below
        {
            title: "Reverse Integer",
            description: "Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-231, 231 - 1], then return 0.",
            difficulty: "medium",
            category: "Math",
            testCases: [
                {
                    input: "x = 123",
                    output: "321",
                    description: "Simple positive number reversal"
                },
                {
                    input: "x = -123",
                    output: "-321",
                    description: "Negative number reversal"
                },
                {
                    input: "x = 120",
                    output: "21",
                    description: "Trailing zeros are dropped"
                }
            ],
            constraints: [
                "-231 <= x <= 231 - 1"
            ],
            tags: ["math", "integer-overflow"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Palindrome Number",
            description: "Given an integer x, return true if x is palindrome integer. An integer is a palindrome when it reads the same backward as forward.",
            difficulty: "easy",
            category: "Math",
            testCases: [
                {
                    input: "x = 121",
                    output: "true",
                    description: "121 reads as 121 from left to right and from right to left."
                },
                {
                    input: "x = -121",
                    output: "false",
                    description: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome."
                },
                {
                    input: "x = 10",
                    output: "false",
                    description: "Reads 01 from right to left. Therefore it is not a palindrome."
                }
            ],
            constraints: [
                "-231 <= x <= 231 - 1"
            ],
            tags: ["math", "palindrome"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Roman to Integer",
            description: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.",
            difficulty: "easy",
            category: "String",
            testCases: [
                {
                    input: "s = \"III\"",
                    output: "3",
                    description: "III = 3"
                },
                {
                    input: "s = \"LVIII\"",
                    output: "58",
                    description: "L = 50, V= 5, III = 3"
                },
                {
                    input: "s = \"MCMXC\"",
                    output: "1994",
                    description: "M = 1000, CM = 900, XC = 90"
                }
            ],
            constraints: [
                "1 <= s.length <= 15",
                "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M')",
                "It is guaranteed that s is a valid roman numeral in the range [1, 3999]"
            ],
            tags: ["hash-table", "math", "string"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Longest Common Prefix",
            description: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
            difficulty: "easy",
            category: "String",
            testCases: [
                {
                    input: "strs = [\"flower\",\"flow\",\"flight\"]",
                    output: "\"fl\"",
                    description: "Common prefix is \"fl\""
                },
                {
                    input: "strs = [\"dog\",\"racecar\",\"car\"]",
                    output: "\"\"",
                    description: "There is no common prefix among the input strings"
                },
                {
                    input: "strs = [\"ab\", \"a\"]",
                    output: "\"a\"",
                    description: "Common prefix is \"a\""
                }
            ],
            constraints: [
                "1 <= strs.length <= 200",
                "0 <= strs[i].length <= 200",
                "strs[i] consists of only lower-case English letters"
            ],
            tags: ["string", "trie"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "3Sum",
            description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.",
            difficulty: "medium",
            category: "Array",
            testCases: [
                {
                    input: "nums = [-1,0,1,2,-1,-4]",
                    output: "[[-1,-1,2],[-1,0,1]]",
                    description: "The distinct triplets are [-1,0,1] and [-1,-1,2]."
                },
                {
                    input: "nums = [0,1,1]",
                    output: "[]",
                    description: "The only possible triplet does not sum up to 0."
                },
                {
                    input: "nums = [0,0,0]",
                    output: "[[0,0,0]]",
                    description: "The only possible triplet sums up to 0."
                }
            ],
            constraints: [
                "3 <= nums.length <= 3000",
                "-105 <= nums[i] <= 105"
            ],
            tags: ["array", "two-pointers", "sorting"],
            timeLimit: 1500,
            memoryLimit: 256,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Remove Nth Node From End of List",
            description: "Given the head of a linked list, remove the nth node from the end of the list and return its head.",
            difficulty: "medium",
            category: "Linked List",
            testCases: [
                {
                    input: "head = [1,2,3,4,5], n = 2",
                    output: "[1,2,3,5]",
                    description: "Remove the 2nd node from the end"
                },
                {
                    input: "head = [1], n = 1",
                    output: "[]",
                    description: "Remove the only node"
                },
                {
                    input: "head = [1,2], n = 1",
                    output: "[1]",
                    description: "Remove the last node"
                }
            ],
            constraints: [
                "The number of nodes in the list is sz",
                "1 <= sz <= 30",
                "0 <= Node.val <= 100",
                "1 <= n <= sz"
            ],
            tags: ["linked-list", "two-pointers"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Generate Parentheses",
            description: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
            difficulty: "medium",
            category: "String",
            testCases: [
                {
                    input: "n = 3",
                    output: "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
                    description: "All valid combinations for 3 pairs"
                },
                {
                    input: "n = 1",
                    output: "[\"()\"]",
                    description: "Only one valid combination"
                },
                {
                    input: "n = 2",
                    output: "[\"(())\",\"()()\"]",
                    description: "Two valid combinations for 2 pairs"
                }
            ],
            constraints: [
                "1 <= n <= 8"
            ],
            tags: ["string", "dynamic-programming", "backtracking"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Merge Two Sorted Lists",
            description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.",
            difficulty: "easy",
            category: "Linked List",
            testCases: [
                {
                    input: "list1 = [1,2,4], list2 = [1,3,4]",
                    output: "[1,1,2,3,4,4]",
                    description: "Merge two sorted lists"
                },
                {
                    input: "list1 = [], list2 = []",
                    output: "[]",
                    description: "Both lists are empty"
                },
                {
                    input: "list1 = [], list2 = [0]",
                    output: "[0]",
                    description: "One list is empty"
                }
            ],
            constraints: [
                "The number of nodes in both lists is in the range [0, 50]",
                "-100 <= Node.val <= 100",
                "Both list1 and list2 are sorted in non-decreasing order"
            ],
            tags: ["linked-list", "recursion", "merge"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Search Insert Position",
            description: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime complexity.",
            difficulty: "easy",
            category: "Array",
            testCases: [
                {
                    input: "nums = [1,3,5,6], target = 5",
                    output: "2",
                    description: "Target found at index 2"
                },
                {
                    input: "nums = [1,3,5,6], target = 2",
                    output: "1",
                    description: "Target should be inserted at index 1"
                },
                {
                    input: "nums = [1,3,5,6], target = 7",
                    output: "4",
                    description: "Target should be inserted at the end"
                }
            ],
            constraints: [
                "1 <= nums.length <= 104",
                "-104 <= nums[i] <= 104",
                "nums contains distinct values sorted in ascending order",
                "-104 <= target <= 104"
            ],
            tags: ["array", "binary-search"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            title: "Maximum Subarray",
            description: "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum. A subarray is a contiguous part of an array.",
            difficulty: "medium",
            category: "Array",
            testCases: [
                {
                    input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                    output: "6",
                    description: "The subarray [4,-1,2,1] has the largest sum 6"
                },
                {
                    input: "nums = [1]",
                    output: "1",
                    description: "Single element array"
                },
                {
                    input: "nums = [5,4,-1,7,8]",
                    output: "23",
                    description: "The entire array has the largest sum"
                }
            ],
            constraints: [
                "1 <= nums.length <= 105",
                "-104 <= nums[i] <= 104"
            ],
            tags: ["array", "divide-and-conquer", "dynamic-programming"],
            timeLimit: 1000,
            memoryLimit: 128,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    print('📝 Attempting to insert', problemsData.length, 'problems...');
    
    // Insert the problems data
    var insertResult = db.problems.insertMany(problemsData);
    print('✅ Successfully inserted problems. Insert result:', JSON.stringify(insertResult.insertedIds));
    
} catch (error) {
    print('❌ Error inserting problems:', error);
    print('Error details:', JSON.stringify(error));
}

// Verify insertion
print('📊 Problems count after insert:', db.problems.countDocuments());

// Show what was actually inserted
print('📋 Verifying inserted problems:');
try {
    db.problems.find({}, { title: 1, difficulty: 1, category: 1 }).forEach(function(doc) {
        print('  • ' + doc.title + ' (' + doc.difficulty + ') - ' + doc.category);
    });
} catch (error) {
    print('❌ Error reading problems:', error);
}

// Create indexes for better performance
print('🔍 Creating indexes...');
try {
    db.problems.createIndex({ "title": 1 }, { unique: true });
    db.problems.createIndex({ "difficulty": 1 });
    db.problems.createIndex({ "category": 1 });
    db.problems.createIndex({ "tags": 1 });
    print('✅ Indexes created successfully');
} catch (error) {
    print('⚠️ Error creating indexes:', error);
}

// Create a sample users collection
print('👥 Creating sample user...');
try {
    var userInsertResult = db.users.insertOne({
        username: 'sample_user',
        email: 'sample@example.com',
        createdAt: new Date(),
        isActive: true
    });
    print('✅ Sample user created with ID:', userInsertResult.insertedId);
    
    // Create indexes for users
    db.users.createIndex({ "email": 1 }, { unique: true });
    db.users.createIndex({ "username": 1 }, { unique: true });
    print('✅ User indexes created');
} catch (error) {
    print('⚠️ Error with users collection:', error);
}

// Final verification
print('🏁 === Final Database Status ===');
print('📊 Total problems in database:', db.problems.countDocuments());
print('👥 Total users in database:', db.users.countDocuments());
print('📚 Collections in database:', db.getCollectionNames());

print('🎉 === MongoDB Initialization Script Completed ===');