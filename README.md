# Weather Forecasting Website

A professional, fully-functional weather forecasting application with real-time data, user authentication, location detection, and beautiful UI animations.

## Features

✨ **User Authentication**
- Secure login system with localStorage persistence
- User session management
- Logout functionality

📍 **Location Management**
- GPS-based geolocation detection
- City search functionality with autocomplete
- Save and manage favorite locations
- Reverse geocoding for GPS coordinates

🌤️ **Weather Information** (9 Modules)
- Current Temperature (current, feels-like, min/max)
- Humidity (percentage, status, progress visualization)
- Wind (speed, direction, gust speed)
- Air Quality Index (AQI status and description)
- Precipitation (chance, rainfall, snowfall)
- Pressure (atmospheric and sea-level)
- UV Index (value and safety recommendations)
- Visibility (distance and quality)
- Cloudiness (percentage, progress visualization)

📅 **5-Day Weather Forecast**
- Daily weather predictions
- Temperature ranges
- Precipitation probability
- Wind conditions

🎨 **Professional UI/UX**
- Responsive design (mobile, tablet, desktop)
- Smooth CSS animations
- Custom cursors
- Animated background with floating particles
- Real-time weather icon emoji display
- Attractive glowing weather icon

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **APIs**: 
  - Open-Meteo (Weather data)
  - Nominatim OpenStreetMap (Geocoding)
  - Browser Geolocation API
- **Storage**: localStorage (browser)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/weather-app.git
cd weather-app
```

2. Start a local server:
```bash
# Python 3
python -m http.server 8000

# Or Node.js http-server
npx http-server
```

3. Open in browser:
```
http://localhost:8000
```

## Usage

1. **Login**: Create a username and password to access the dashboard
2. **Location**: 
   - Click "Current Location" to use GPS
   - Search for any city to get weather data
   - Save favorite locations for quick access
3. **View Weather**: Browse all 9 weather modules for comprehensive information
4. **Check Forecast**: View the 5-day forecast at the bottom

## API Information

- **Open-Meteo**: Free weather API, no authentication required
  - Endpoint: `https://api.open-meteo.com/v1/forecast`
  - Provides current conditions and forecasts
  
- **Nominatim**: Free geocoding service from OpenStreetMap
  - Reverse geocoding: GPS to city name
  - Forward geocoding: City name to coordinates

## Files Structure

```
weather-app/
├── index.html      # Application structure (253 lines)
├── styles.css      # Professional styling with animations (889 lines)
├── script.js       # Complete application logic (500+ lines)
├── .gitignore      # Git ignore rules
└── README.md       # This file
```

## Features Highlights

### Accurate Weather Data
- Uses industry-standard Open-Meteo API
- Real-time current conditions
- WMO weather code mapping (0-99)
- Accurate air quality calculations

### Responsive & Accessible
- Works on all screen sizes
- Touch-friendly interface
- Accessible form controls
- User-friendly error messages

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
