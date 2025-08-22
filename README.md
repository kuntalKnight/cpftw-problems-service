# LeetCode Clone Backend

A robust Node.js backend API built with REST API best practices, featuring proper separation of concerns, validation layers, API versioning, and MongoDB integration.

## 🏗️ Architecture Overview

The application follows a layered architecture pattern with clear separation of responsibilities:

```
Request Flow: Router → Middleware → Interceptor → Controller → Validator → Service → Repository → MongoDB
```

### Architecture Layers

1. **Router Layer** - Handles HTTP routing and API versioning
2. **Middleware Layer** - Filters requests (auth, rate limiting, CORS, logging)
3. **Interceptor Layer** - Embeds additional context (trace ID, user context, request metadata)
4. **Controller Layer** - Handles HTTP requests/responses and orchestrates the flow
5. **Validator Layer** - Validates requests and responses, prevents 4XX errors from reaching services
6. **Service Layer** - Contains business logic
7. **Repository Layer** - Handles data access and persistence
8. **MongoDB** - Database layer with Mongoose ODM

## 🚀 Features

- **API Versioning**: `/api/v1/*` prefix for maintaining API versions
- **Request Validation**: Comprehensive validation using Joi schemas
- **Response Validation**: Ensures consistent API response format
- **Trace ID Tracking**: Unique trace ID for each request for debugging
- **Rate Limiting**: Built-in rate limiting to prevent abuse
- **CORS Support**: Configurable CORS settings
- **Request Logging**: Detailed request/response logging
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Modular Design**: Clean separation of concerns for maintainability
- **MongoDB Integration**: Full database integration with Mongoose ODM
- **Data Seeding**: Automated database population with sample problems

## 📁 Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── config/               # Configuration files
│   └── db.config.js     # MongoDB connection configuration
├── controllers/          # Request handlers
├── interceptors/         # Request context enhancers
├── middlewares/          # Request filters
├── models/               # MongoDB models with Mongoose
│   └── problem.model.js # Problem entity model
├── repositories/         # Data access layer
├── routes/               # Route definitions
├── scripts/              # Utility scripts
│   └── seedData.js      # Database seeding script
├── services/             # Business logic
└── validators/           # Request/response validation
```

## 🛠️ Installation & Setup

### Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (v5 or higher) running locally or MongoDB Atlas connection

### MongoDB Setup

1. **Local MongoDB Installation**:
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Start MongoDB service
   - Create database: `leetcode-backend`

2. **MongoDB Atlas** (Cloud):
   - Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster and get connection string

### Project Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file from template:
   ```bash
   cp env.template .env
   ```
4. Configure environment variables in `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/leetcode-backend
   ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
   ```
5. Seed the database with sample problems:
   ```bash
   npm run seed
   ```
6. Run the development server:
   ```bash
   npm run dev
   ```

## 📊 Database Schema

### Problem Model

```javascript
{
  title: String (required, unique, max 200 chars),
  description: String (required, min 10, max 5000 chars),
  difficulty: String (enum: 'easy', 'medium', 'hard'),
  category: String (required, max 100 chars),
  testCases: [{
    input: String (required),
    output: String (required),
    description: String
  }],
  constraints: [String],
  tags: [String],
  timeLimit: Number (default: 1000ms),
  memoryLimit: Number (default: 128MB),
  submissions: Number (default: 0),
  acceptedSubmissions: Number (default: 0),
  acceptanceRate: Number (calculated),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 📚 API Endpoints

### Base URL: `/api/v1`

#### Problems
- `GET /problems` - Get all problems with pagination
- `GET /problems/search` - Search problems
- `GET /problems/:id` - Get problem by ID
- `POST /problems` - Create new problem
- `PUT /problems/:id` - Update problem
- `DELETE /problems/:id` - Delete problem (soft delete)

#### Health & Info
- `GET /api/health` - Health check
- `GET /api` - API information
- `GET /` - Root endpoint

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/leetcode-backend
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### MongoDB Connection

The application automatically connects to MongoDB on startup. Connection options include:

- **Local MongoDB**: `mongodb://localhost:27017/leetcode-backend`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/leetcode-backend`

## 🧪 Validation

### Request Validation

The application uses a two-tier validation system:

1. **Base Request Validator**: Contains reusable validation functions
   - Required field validation
   - String length validation
   - Numeric range validation
   - Email validation
   - File type/size validation
   - UUID validation
   - Pagination validation

2. **Specific Validators**: API-specific validation logic
   - Problem request validation
   - Problem response validation

### Response Validation

All API responses are validated and formatted consistently:

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z",
  "statusCode": 200
}
```

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse
- **CORS Protection**: Configurable cross-origin settings
- **Input Validation**: Comprehensive request validation
- **Error Sanitization**: Sensitive data removal from responses
- **MongoDB Injection Protection**: Mongoose ODM prevents NoSQL injection

## 📊 Monitoring & Debugging

- **Request Logging**: Detailed request/response logging
- **Trace ID**: Unique identifier for each request
- **Performance Metrics**: Request duration tracking
- **Error Tracking**: Centralized error handling
- **Database Monitoring**: MongoDB connection status

## 🚦 Middleware Stack

1. **CORS Middleware**: Handles cross-origin requests
2. **Rate Limit Middleware**: Prevents API abuse
3. **Request Logger Middleware**: Logs request details
4. **Trace ID Interceptor**: Adds unique trace ID
5. **Request Context Interceptor**: Adds request metadata
6. **User Context Interceptor**: Adds user information

## 🔄 Request Flow Example

```
1. Request comes to /api/v1/problems
2. CORS middleware checks origin
3. Rate limit middleware checks frequency
4. Request logger logs the request
5. Trace ID interceptor adds unique ID
6. Request context interceptor adds metadata
7. User context interceptor adds user info
8. Controller receives the request
9. Request validator validates parameters
10. If validation passes, service is called
11. Service calls repository
12. Repository queries MongoDB via Mongoose
13. Response validator formats the response
14. Response is sent to client
```

## 🗄️ Database Operations

### Seeding Data

Populate the database with sample problems:

```bash
npm run seed
```

This will:
- Connect to MongoDB
- Clear existing problems
- Insert 5 sample problems (Two Sum, Add Two Numbers, etc.)
- Display insertion results

### Database Management

- **Collections**: Problems are stored in the `problems` collection
- **Indexes**: Automatic indexing on title, difficulty, category, and text search
- **Soft Delete**: Problems are marked as inactive rather than physically deleted
- **Validation**: Mongoose schema validation ensures data integrity

## 🧹 Code Quality

- **ES6+ Syntax**: Modern JavaScript features
- **Modular Architecture**: Clean separation of concerns
- **Consistent Error Handling**: Standardized error responses
- **Input Validation**: Comprehensive request validation
- **Response Formatting**: Consistent API response structure
- **Database Abstraction**: Clean repository pattern with Mongoose

## 🚀 Getting Started

1. **Start MongoDB** (local or Atlas)
2. **Configure environment**:
   ```bash
   cp env.template .env
   # Edit .env with your MongoDB connection string
   ```
3. **Seed the database**:
   ```bash
   npm run seed
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
5. **Test the API**:
   ```bash
   curl http://localhost:3000/api/health
   curl http://localhost:3000/api/v1/problems
   ```

## 📝 Contributing

1. Follow the established architecture patterns
2. Add proper validation for new endpoints
3. Maintain consistent error handling
4. Update documentation for new features
5. Ensure MongoDB models follow the established schema patterns

## 📄 License

ISC License
