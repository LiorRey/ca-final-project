# Backend API

Production-ready Node.js backend using Express with MongoDB and ESM syntax.

## Installation

### Install Dependencies

```powershell
npm install
```

This will install all production and development dependencies:

- **Production**: express, dotenv, cors, helmet, morgan, mongoose
- **Development**: nodemon, eslint, prettier

## Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/basicdb
```

### MongoDB Connection

**For running both with Docker Compose (backend and MongoDB in separate containers):**

```
MONGODB_URI=mongodb://admin:123123@mongodb:27017/basicdb?authSource=admin
```

**For running separately (backend locally, MongoDB in Docker):**

```
MONGODB_URI=mongodb://admin:123123@host.docker.internal:27017/basicdb?authSource=admin
```

## Prerequisites

- **Docker** - Required for running MongoDB container

## Running the Application

You have two options to run the application:

### Option 1: Run Both with Docker Compose (Recommended)

Run both MongoDB and backend together in detached mode:

```powershell
docker compose up -d
```

This will start:

- MongoDB container on port `27017`
- Backend server on port `3000`

### Option 2: Run Separately

**Run MongoDB in Docker:**

```powershell
docker compose up -d mongodb
```

**Run Backend Locally:**

```powershell
npm run dev
```

This allows you to:

- Run MongoDB in a container
- Run the backend server locally on your machine
- Make code changes without rebuilding containers

> **Note:** When running separately, update your `.env` file to use `host.docker.internal` instead of `127.0.0.1` to connect from your local machine to the Docker container:
>
> ```
> MONGODB_URI=mongodb://admin:123123@host.docker.internal:27017/basicdb?authSource=admin
> ```

## Project Structure

```
src/
  app.js              # Express app configuration with middlewares
  server.js           # Server entry point (connects to MongoDB)
  routes/             # API routes
    card.js           # Card routes
  controllers/        # Route controllers (business logic handlers)
    cardController.js # Card controller
  models/             # MongoDB models (Mongoose)
    Card.js           # Card model
  middlewares/        # Custom middlewares
    errorHandler.js   # Centralized error handler
  config/             # Configuration files
    database.js       # MongoDB connection
  services/           # Business logic services
  utils/              # Utility functions
  jobs/               # Background jobs/cron tasks
```

## API Endpoints

### Health Check

- `GET /health` - Health check endpoint

### Cards

- `POST /cards` - Create a new card
- `GET /cards` - Get all cards
- `GET /cards/:id` - Get card by ID
- `PUT /cards/:id` - Update card
- `DELETE /cards/:id` - Delete card
- `GET /cards/label/:labelId` - Get cards by label
- `GET /cards/assigned/:userId` - Get cards assigned to a user

## Card Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  labels: [String],
  assignedTo: [String],
  dueDate: Number,
  createdAt: Number
}
```

## Testing with Postman

You can use Postman to test the API endpoints.

### Create a Card

**Endpoint:** `POST http://localhost:3000/cards`

**Request Body:**

```json
{
  "title": "new card 10",
  "description": "it works good",
  "labels": ["backend", "docker", "testing", "doing"],
  "assignedTo": ["user1@example.com", "user2@example.com", "user123"],
  "dueDate": 1747353600000
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "65f1234567890abcdef12345",
    "title": "new card 10",
    "description": "it works good",
    "labels": ["backend", "docker", "testing", "doing"],
    "assignedTo": ["user1@example.com", "user2@example.com", "user123"],
    "dueDate": 1747353600000,
    "createdAt": 1747158567195
  }
}
```

### Get All Cards

**Endpoint:** `GET http://localhost:3000/cards`

This will return all cards in the database to verify everything is working correctly.

## Error Handling

All errors are handled by the centralized error handler middleware. Errors return:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Connection

- MongoDB connection is configured in `src/config/database.js`
- Automatically connects when server starts in `src/server.js`

## Accessing the Database via CLI

After launching the database with Docker Compose, you can access MongoDB through the command line interface:

```powershell
docker exec -it backend-mongodb-1 mongosh "mongodb://admin:123123@localhost:27017/basicdb?authSource=admin"
```

This command:

- Connects to the MongoDB container (`backend-mongodb-1`)
- Uses the same connection URI as configured in your environment
- Opens an interactive MongoDB shell where you can run queries and manage the database

## Technologies

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **ESM** - ES Module syntax
