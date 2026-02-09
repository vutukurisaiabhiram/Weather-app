# Weather App - Complete MERN Setup

A modern weather forecast application built with the MERN stack (MongoDB, Express, React, Node.js) featuring user authentication, weather search, saved locations, and detailed weather information.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local installation or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- **npm** or **yarn** package manager

### Setup Instructions

#### 1. Backend Setup
```bash
cd backend
npm install
```

**Configure MongoDB:**
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-app
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Start Backend Server:**
```bash
npm run dev
# Server will run on http://localhost:5000
```

#### 2. Frontend Setup
Open `weather website.html` in your browser or use Live Server extension in VS Code.

**Note:** Make sure backend server is running before accessing the frontend!

## 🌐 API Endpoints

### Authentication Endpoints

#### Register User
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

#### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "password123"
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

## 📁 Project Structure

```
weather-app/
├── README.md
├── MERN_SETUP.md
├── styles.css
├── weather website.html
├── script.js
└── backend/
    ├── server.js
    ├── package.json
    ├── .env
    ├── start-backend.bat
    ├── models/
    │   └── User.js
    ├── controllers/
    │   └── authController.js
    ├── routes/
    │   └── auth.js
    └── middleware/
        └── auth.js
```

## 🔑 Technologies Used

### Frontend
- HTML5 & CSS3 (responsive design with animations)
- Vanilla JavaScript (ES6+)
- Geolocation API
- Fetch API

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (password hashing)
- CORS

### Third-party APIs
- **Open-Meteo** - Weather data (free, no API key needed)
- **Nominatim (OpenStreetMap)** - Geocoding (free, no API key needed)

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT authentication tokens
- ✅ Protected API routes
- ✅ CORS configuration
- ✅ Environment variables for sensitive data
- ✅ Input validation

## 🚨 Troubleshooting

### Backend Connection Error
```
❌ "Connection error. Make sure the backend server is running on port 5000"
```
✅ Ensure backend is running: `npm run dev`
✅ Check MongoDB is connected
✅ Verify port 5000 is available

### MongoDB Connection Failed
```
❌ "MongoDB connection error"
```
✅ If local: Start MongoDB with `mongod`
✅ If Atlas: Update MONGODB_URI with correct credentials
✅ Check .env file configuration

### Missing Dependencies
```bash
cd backend
npm install
```

## 📝 Environment Variables

Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/weather-app
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🎯 Quick Start (Windows)

**Double-click** `backend/start-backend.bat` to automatically:
- Install dependencies
- Create .env file
- Start backend server

## 📈 Future Enhancements

- [ ] React frontend
- [ ] Email verification
- [ ] Password reset
- [ ] User profiles
- [ ] Refresh tokens
- [ ] Rate limiting
- [ ] Admin dashboard
- [ ] Dark/Light theme

## 📧 Support

For detailed setup instructions, see [MERN_SETUP.md](MERN_SETUP.md)

---

**Happy Coding!** 🎉

### Performance
- Optimized API calls with timeout handling
- Efficient DOM manipulation
- Smooth animations (60fps)
- Minimal dependencies (vanilla JS)

## Browser Support

- Chrome/Chromium (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

## Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Historical weather data
- [ ] Multiple language support
- [ ] Dark mode toggle
- [ ] Weather maps integration
- [ ] PWA support for offline use

## License

MIT License - Feel free to use this project for personal or commercial purposes.

## Author

Your Name

## Contributing

Contributions are welcome! Feel free to submit pull requests or issues.

---

**Made with ❤️ for weather enthusiasts**
