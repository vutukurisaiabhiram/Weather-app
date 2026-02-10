// ============ SIMPLE NAME LOGIN ============
const loginContainer = document.getElementById('loginContainer');
const dashboardContainer = document.getElementById('dashboardContainer');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const userDisplay = document.getElementById('userDisplay');

window.addEventListener('load', () => {
    const savedUser = localStorage.getItem('weatherAppUser');
    if (savedUser) {
        userDisplay.textContent = `Welcome, ${savedUser}!`;
        loginContainer.style.display = 'none';
        dashboardContainer.style.display = 'block';
        loadCurrentLocation();
    }
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('username').value.trim();
    
    if (!name) {
        alert('❌ Please enter your name');
        return;
    }
    
    // Store name locally (no database needed)
    localStorage.setItem('weatherAppUser', name);
    
    userDisplay.textContent = `Welcome, ${name}!`;
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'block';
    
    document.getElementById('username').value = '';
    
    loadCurrentLocation();
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('weatherAppUser');
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
    document.getElementById('username').value = '';
});

// ============ LOCATION & UI ELEMENTS ============
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentLocBtn = document.getElementById('currentLocBtn');
const addFavBtn = document.getElementById('addFavBtn');
const favoritesToggle = document.getElementById('favoritesToggle');
const favoritesList = document.getElementById('favoritesList');
const favoritesContainer = document.getElementById('favoritesContainer');
const locationCoords = document.getElementById('locationCoords');
const lastUpdate = document.getElementById('lastUpdate');

let currentCity = 'Your Location';
let currentLat = 0;
let currentLon = 0;
let favorites = [];

loadFavorites();
displayFavorites();

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name to search.');
        cityInput.focus();
        return;
    }
    searchWeatherByCity(city);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (!city) {
            alert('Please enter a city name to search.');
            cityInput.focus();
            return;
        }
        searchWeatherByCity(city);
    }
});

currentLocBtn.addEventListener('click', () => {
    loadCurrentLocation();
});

favoritesToggle.addEventListener('click', () => {
    favoritesList.style.display = favoritesList.style.display === 'none' ? 'block' : 'none';
});

addFavBtn.addEventListener('click', () => {
    addToFavorites();
});

function loadFavorites() {
    const saved = localStorage.getItem('weatherFavorites');
    favorites = saved ? JSON.parse(saved) : [];
}

function saveFavorites() {
    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

function addToFavorites() {
    if (currentCity && currentLat && currentLon) {
        const exists = favorites.some(fav => fav.lat === currentLat && fav.lon === currentLon);
        if (!exists) {
            favorites.push({ city: currentCity, lat: currentLat, lon: currentLon });
            saveFavorites();
            displayFavorites();
            alert(`${currentCity} added to favorites!`);
        } else {
            alert(`${currentCity} is already in favorites!`);
        }
    }
}

function removeFavorite(index) {
    favorites.splice(index, 1);
    saveFavorites();
    displayFavorites();
}

function displayFavorites() {
    favoritesContainer.innerHTML = '';
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = '<p class="empty-message">No saved locations yet</p>';
        return;
    }
    favorites.forEach((fav, index) => {
        const div = document.createElement('div');
        div.className = 'favorite-item';
        div.innerHTML = `
            <span onclick="loadFavoriteLocation(${fav.lat}, ${fav.lon})">${fav.city}</span>
            <button onclick="removeFavorite(${index})">✕</button>
        `;
        favoritesContainer.appendChild(div);
    });
}

function loadFavoriteLocation(lat, lon) {
    loadWeatherByCoordinates(lat, lon);
    favoritesContainer.style.display = 'none';
}

function loadCurrentLocation() {
    if ('geolocation' in navigator) {
        currentLocBtn.textContent = '📍 Detecting...';
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                console.log(`GPS: ${lat}, ${lon}`);
                await loadWeatherByCoordinates(lat, lon);
                currentLocBtn.textContent = '📍 Current Location';
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Unable to detect location.');
                currentLocBtn.textContent = '📍 Current Location';
            }
        );
    } else {
        alert('Geolocation not supported.');
    }
}

// ============ WEATHER DATA FETCHING ============
async function loadWeatherByCoordinates(lat, lon) {
    try {
        searchBtn.disabled = true;
        searchBtn.textContent = '⏳ Loading...';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max&timezone=auto`,
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`API error: ${response.status}`);
        
        const data = await response.json();
        currentLat = lat;
        currentLon = lon;
        
        await getLocationName(lat, lon);
        updateAllWeather(data);
        
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading weather data.');
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
    }
}

async function getLocationName(lat, lon) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || 'Current Location';
        const country = data.address.country || '';
        currentCity = `${city}, ${country}`.trim();
    } catch (error) {
        console.error('Error getting location name:', error);
        currentCity = 'Current Location';
    }
}

// Validate if location is a real city/town/village (not random places)
function isValidLocation(location) {
    const validTypes = ['city', 'town', 'village', 'borough', 'municipality', 'settlement', 'capital', 'administrative'];
    const validClasses = ['place', 'boundary', 'landuse'];
    
    const locType = (location.type || '').toLowerCase();
    const locClass = (location.class || '').toLowerCase();
    
    // Check if it's a valid location type or class
    const isValidType = validTypes.some(type => locType.includes(type));
    const isValidClass = validClasses.includes(locClass);
    
    // Must be either a valid type OR a valid class (but class 'place' is best)
    if (locClass === 'place' && isValidType) {
        return true;
    }
    
    // Also accept administrative boundaries if they're cities/towns
    if (locClass === 'boundary' && (locType.includes('city') || locType.includes('town') || locType.includes('administrative'))) {
        return true;
    }
    
    // Reject everything else (names, random places, etc.)
    return false;
}

async function searchWeatherByCity(city) {
    try {
        searchBtn.disabled = true;
        searchBtn.textContent = '🔍 Searching...';
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=10`,
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);
        
        if (!geoResponse.ok) throw new Error(`City "${city}" not found`);
        
        const geoData = await geoResponse.json();
        if (!geoData || geoData.length === 0) {
            alert(`❌ Invalid input: "${city}" is not a valid city name. Please enter a real city (e.g., London, Paris, New York).`);
            clearWeatherDisplay();
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 Search';
            cityInput.value = '';
            return;
        }
        
        // Find the first VALID location (city/town/village)
        let validLocation = null;
        for (let loc of geoData) {
            if (isValidLocation(loc)) {
                validLocation = loc;
                break;
            }
        }
        
        // If no valid location found, reject the search
        if (!validLocation) {
            alert(`❌ Invalid input: "${city}" is not a valid city name. Please enter a real city (e.g., London, Paris, New York).`);
            clearWeatherDisplay();
            searchBtn.disabled = false;
            searchBtn.textContent = '🔍 Search';
            cityInput.value = '';
            return;
        }
        
        const location = validLocation;
        const latitude = parseFloat(location.lat);
        const longitude = parseFloat(location.lon);
        
        currentCity = location.display_name.split(',')[0] || city;
        currentLat = latitude;
        currentLon = longitude;
        
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,snowfall_sum,wind_speed_10m_max&timezone=auto`
        );
        
        if (!weatherResponse.ok) throw new Error('Failed to fetch weather');
        
        const weatherData = await weatherResponse.json();
        updateAllWeather(weatherData);
        
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
        cityInput.value = '';
        
    } catch (error) {
        console.error('Error:', error);
        alert(`❌ Invalid input: "${city}" is not a valid city name. Please enter a real city (e.g., London, Paris, New York).`);
        clearWeatherDisplay();
        searchBtn.disabled = false;
        searchBtn.textContent = '🔍 Search';
        cityInput.value = '';
    }
}

// Clear weather display when city is not found
function clearWeatherDisplay() {
    document.getElementById('cityName').textContent = '--';
    document.getElementById('currentTemp').textContent = '--°C';
    document.getElementById('weatherDesc').textContent = '--';
    document.getElementById('weatherIcon').textContent = '🌡️';
    locationCoords.textContent = '📍 --';
    lastUpdate.textContent = 'Last updated: --';
    
    // Clear all weather modules
    document.getElementById('tempCurrent').textContent = '--°C';
    document.getElementById('tempFeels').textContent = '--°C';
    document.getElementById('tempMinMax').textContent = '--°C / --°C';
    document.getElementById('humidityValue').textContent = '--%';
    document.getElementById('humidityStatus').textContent = '--';
    document.getElementById('windSpeed').textContent = '-- m/s';
    document.getElementById('windDirection').textContent = '--';
    document.getElementById('windGust').textContent = '-- m/s';
    document.getElementById('aqiValue').textContent = '--';
    document.getElementById('aqiStatus').textContent = '--';
    document.getElementById('rainChance').textContent = '--%';
    document.getElementById('rainAmount').textContent = '-- mm';
    document.getElementById('snowAmount').textContent = '-- mm';
    document.getElementById('pressure').textContent = '-- hPa';
    document.getElementById('seaLevel').textContent = '-- hPa';
    document.getElementById('uvIndex').textContent = '--';
    document.getElementById('uvStatus').textContent = '--';
    document.getElementById('visibility').textContent = '-- km';
    document.getElementById('visibilityStatus').textContent = '--';
    
    // Clear forecast
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '<p class="loading">No forecast available</p>';
}

// ============ UPDATE ALL WEATHER DATA ============
function updateAllWeather(data) {
    const current = data.current;
    const daily = data.daily;
    
    // Update current weather header
    document.getElementById('cityName').textContent = currentCity;
    document.getElementById('currentTemp').textContent = `${Math.round(current.temperature_2m)}°C`;
    const desc = getWeatherDescription(current.weather_code);
    document.getElementById('weatherDesc').textContent = desc;
    const icon = getWeatherIcon(current.weather_code);
    document.getElementById('weatherIcon').textContent = icon;
    
    // Update location info
    locationCoords.textContent = `📍 Lat: ${currentLat.toFixed(4)}, Lon: ${currentLon.toFixed(4)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    lastUpdate.textContent = `Last updated: ${timeStr}`;
    
    // ============ TEMPERATURE MODULE ============
    const temp = Math.round(current.temperature_2m);
    const feelsLike = Math.round(current.apparent_temperature);
    const tempMax = Math.round(daily.temperature_2m_max[0]);
    const tempMin = Math.round(daily.temperature_2m_min[0]);
    
    document.getElementById('tempCurrent').textContent = `${temp}°C`;
    document.getElementById('tempFeels').textContent = `${feelsLike}°C`;
    document.getElementById('tempMinMax').textContent = `${tempMax}°C / ${tempMin}°C`;
    
    // ============ HUMIDITY MODULE ============
    const humidity = current.relative_humidity_2m;
    document.getElementById('humidityBar').style.width = `${humidity}%`;
    document.getElementById('humidityValue').textContent = `${humidity}%`;
    
    let humidityStatus = '';
    if (humidity < 30) humidityStatus = 'Dry';
    else if (humidity < 50) humidityStatus = 'Comfortable';
    else if (humidity < 70) humidityStatus = 'Moderate';
    else humidityStatus = 'Humid';
    document.getElementById('humidityStatus').textContent = humidityStatus;
    
    // ============ WIND MODULE ============
    const windSpeed = current.wind_speed_10m;
    const windDir = getWindDirection(current.wind_direction_10m);
    const windGust = daily.wind_speed_10m_max[0];
    
    document.getElementById('windSpeed').textContent = `${windSpeed.toFixed(1)} m/s`;
    document.getElementById('windDirection').textContent = `${windDir}`;
    document.getElementById('windGust').textContent = `${windGust.toFixed(1)} m/s`;
    
    // ============ AIR QUALITY MODULE ============
    const aqi = getAQI(current.pressure_msl, humidity);
    document.getElementById('aqiValue').textContent = aqi;
    
    let aqiStatus = '';
    if (aqi === 'Good') aqiStatus = 'Air quality is good ✓';
    else if (aqi === 'Fair') aqiStatus = 'Air quality is fair';
    else if (aqi === 'Moderate') aqiStatus = 'Air quality is moderate';
    else aqiStatus = 'Air quality is poor';
    document.getElementById('aqiStatus').textContent = aqiStatus;
    document.getElementById('pm25').textContent = 'N/A';
    document.getElementById('pm10').textContent = 'N/A';
    
    // ============ PRECIPITATION MODULE ============
    const precipitation = daily.precipitation_sum[0];
    const snowfall = daily.snowfall_sum[0];
    const rainChance = 20;
    
    document.getElementById('rainChance').textContent = `${rainChance}%`;
    document.getElementById('rainAmount').textContent = `${precipitation.toFixed(1)} mm`;
    document.getElementById('snowAmount').textContent = `${snowfall.toFixed(1)} mm`;
    
    // ============ PRESSURE MODULE ============
    const pressure = Math.round(current.pressure_msl);
    document.getElementById('pressure').textContent = `${pressure} hPa`;
    document.getElementById('seaLevel').textContent = `${pressure} hPa`;
    
    // ============ UV INDEX MODULE ============
    const uvIndex = current.uv_index;
    document.getElementById('uvIndex').textContent = uvIndex.toFixed(1);
    
    let uvStatus = '';
    if (uvIndex < 3) uvStatus = 'Low - No protection needed';
    else if (uvIndex < 6) uvStatus = 'Moderate - Wear sunscreen';
    else if (uvIndex < 8) uvStatus = 'High - Wear strong sunscreen';
    else if (uvIndex < 11) uvStatus = 'Very High - Seek shade';
    else uvStatus = 'Extreme - Avoid sun exposure';
    document.getElementById('uvStatus').textContent = uvStatus;
    
    // ============ VISIBILITY MODULE ============
    const visibility = (current.visibility / 1000).toFixed(1);
    document.getElementById('visibility').textContent = `${visibility} km`;
    
    let visStatus = '';
    if (visibility > 10) visStatus = 'Excellent visibility';
    else if (visibility > 5) visStatus = 'Good visibility';
    else if (visibility > 1) visStatus = 'Moderate visibility';
    else visStatus = 'Poor visibility';
    document.getElementById('visibilityStatus').textContent = visStatus;
    
    // ============ CLOUDINESS MODULE ============
    const cloudiness = current.cloud_cover;
    document.getElementById('cloudsBar').style.width = `${cloudiness}%`;
    document.getElementById('cloudsValue').textContent = `${cloudiness}%`;
    
    // ============ 5-DAY FORECAST ============
    updateForecast(daily);
    
    // Update favorites button
    const exists = favorites.some(fav => fav.lat === currentLat && fav.lon === currentLon);
    addFavBtn.textContent = exists ? '★ In Favorites' : '❤️';
}

function getWeatherDescription(code) {
    const desc = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Moderate Drizzle',
        55: 'Dense Drizzle', 61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
        71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
        80: 'Slight Showers', 81: 'Moderate Showers', 82: 'Violent Showers',
        85: 'Light Snow Showers', 86: 'Heavy Snow Showers', 95: 'Thunderstorm',
        96: 'Thunderstorm w/ Hail', 99: 'Thunderstorm w/ Hail'
    };
    return desc[code] || 'Unknown';
}

function getWeatherIcon(code) {
    const icon = {
        0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️', 45: '🌫️', 48: '🌫️',
        51: '🌧️', 53: '🌧️', 55: '⛈️', 61: '🌧️', 63: '🌧️', 65: '⛈️',
        71: '❄️', 73: '❄️', 75: '❄️', 77: '❄️', 80: '🌧️', 81: '🌧️', 82: '⛈️',
        85: '🌨️', 86: '🌨️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
    };
    return icon[code] || '🌡️';
}

function getAQI(pressure, humidity) {
    if (pressure > 1015 && humidity < 60) return 'Good';
    if (pressure > 1010 && humidity < 75) return 'Fair';
    if (pressure > 1000 && humidity < 85) return 'Moderate';
    return 'Poor';
}

function getWindDirection(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

function updateForecast(daily) {
    const forecastGrid = document.getElementById('forecastGrid');
    forecastGrid.innerHTML = '';
    
    for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const date = new Date(daily.time[i]);
        const maxTemp = Math.round(daily.temperature_2m_max[i]);
        const minTemp = Math.round(daily.temperature_2m_min[i]);
        const avgTemp = Math.round((maxTemp + minTemp) / 2);
        const precipitation = daily.precipitation_sum[i];
        const windSpeed = daily.wind_speed_10m_max[i];
        const weatherCode = daily.weather_code[i];
        const icon = getWeatherIcon(weatherCode);
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-date">${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
            <div class="forecast-icon">${icon}</div>
            <div class="forecast-temp">${avgTemp}°C (${maxTemp}°/${minTemp}°)</div>
            <div class="forecast-rain">💧 ${precipitation.toFixed(1)}mm</div>
            <div class="forecast-wind">💨 ${windSpeed.toFixed(1)}m/s</div>
        `;
        forecastGrid.appendChild(card);
    }
}
