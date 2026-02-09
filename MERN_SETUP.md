# Weather App - MERN Setup Guide

## Project Structure

```
weather-app/
├── frontend/
│   ├── weather website.html
│   ├── script.js
│   └── styles.css
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env
│   ├── models/
│   │   └── User.js
│   ├── controllers/
│   │   └── authController.js
│   ├── routes/
│   │   └── auth.js
│   └── middleware/
│       └── auth.js
└── README.md
```

## Backend Setup Instructions

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (Local or Atlas) - [Download](https://www.mongodb.com/) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 2: Configure MongoDB Connection

Edit the `backend/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-app
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weather-app?retryWrites=true&w=majority
```

### Step 3: Start MongoDB Service

**Windows (Local):**
```bash
mongod
```

**Or use MongoDB Atlas (Cloud)** - Update the MONGODB_URI in .env

### Step 4: Run the Backend Server

```bash
npm run dev
# or
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server is running on port 5000
```

## Frontend Setup

### Running the Weather App

1. Open `weather website.html` in your browser (or use Live Server)
2. The frontend will automatically connect to `http://localhost:5000`

## API Endpoints

### Authentication Endpoints

#### Register a New User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>
```

## Features

### Authentication
- ✅ User Registration with email validation
- ✅ User Login with JWT tokens
- ✅ Password hashing with bcryptjs
- ✅ Secure token-based authentication
- ✅ Session persistence

### Weather Features
- ✅ Search weather by city
- ✅ Current location detection
- ✅ Save favorite locations
- ✅ 5-day forecast
- ✅ Detailed weather information (temperature, humidity, wind, UV index, etc.)

## Common Issues & Solutions

### "Connection error. Make sure the backend server is running on port 5000"
- Ensure MongoDB is running
- Ensure backend server is running: `npm run dev`
- Check if port 5000 is available

### MongoDB Connection Error
- If using local MongoDB: Ensure `mongod` service is running
- If using MongoDB Atlas: Update MONGODB_URI with correct credentials
- Test connection: `mongodb://localhost:27017/weather-app`

### CORS Error
- Ensure `cors` is properly configured in `server.js`
- Check that frontend is accessing `http://localhost:5000`

## Development & Testing

### Test the API with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"test123","passwordConfirm":"test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## Security Notes

1. Change `JWT_SECRET` in production to a strong, random value
2. Always use HTTPS in production
3. Never commit `.env` file with sensitive data
4. Use environment variables for all sensitive information
5. Implement rate limiting for API endpoints in production

## Future Enhancements

- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Save user weather preferences
- [ ] Two-factor authentication
- [ ] Admin dashboard

## License

This project is open source and available under the MIT License.
