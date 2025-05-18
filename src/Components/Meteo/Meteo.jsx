import { useEffect, useState } from 'react';
import './Meteo.css';
import {jwtDecode} from 'jwt-decode'

function isNight(currentTime, sunrise, sunset) {
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const currentTimeValue = currentHours + currentMinutes / 60;
    
    const sunriseHours = sunrise.getHours();
    const sunriseMinutes = sunrise.getMinutes();
    const sunriseTime = sunriseHours + sunriseMinutes / 60;
    
    const sunsetHours = sunset.getHours();
    const sunsetMinutes = sunset.getMinutes();
    const sunsetTime = sunsetHours + sunsetMinutes / 60;
    
    return currentTimeValue < sunriseTime || currentTimeValue >= sunsetTime;
}

function getBackgroundClass(currentTime, weatherCode, sunrise, sunset) {
    const night = isNight(currentTime, sunrise, sunset);

    if ([95, 96, 99].includes(weatherCode)) {
        return 'storm';
    }

    if (night) {
        if ([0, 1].includes(weatherCode)) return 'night-clear';
        if ([2, 3, 45, 48].includes(weatherCode)) return 'night-cloudy';
        return 'night-generic';
    } else {
        if ([0, 1].includes(weatherCode)) return 'day-sunny';
        if ([2, 3, 45, 48].includes(weatherCode)) return 'day-cloudy';
        return 'day-generic';
    }
}

function getWeatherIcon(currentTime, weatherCode, sunrise, sunset) {
    const night = isNight(currentTime, sunrise, sunset);
    
    if ([95, 96, 99].includes(weatherCode)) return '⛈️';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return '🌧️';
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return '❄️';
    if ([2, 3, 45, 48].includes(weatherCode)) {
        return night ? '☁️🌙' : '☁️☀️';
    }
    
    return night ? '🌙' : '☀️';
}

const weatherCodeMap = {
    0: "Sereno",
    1: "Prevalentemente sereno",
    2: "Parzialmente nuvoloso",
    3: "Coperto",
    45: "Nebbia",
    48: "Bruma",
    51: "Pioviggine leggera",
    53: "Pioviggine moderata",
    55: "Pioviggine intensa",
    56: "Pioviggine congelante leggera",
    57: "Pioviggine congelante intensa",
    61: "Pioggia leggera",
    63: "Pioggia moderata",
    65: "Pioggia intensa",
    66: "Pioggia congelante leggera",
    67: "Pioggia congelante intensa",
    71: "Neve leggera",
    73: "Neve moderata",
    75: "Neve intensa",
    77: "Cristalli di ghiaccio",
    80: "Rovesci leggeri",
    81: "Rovesci moderati",
    82: "Rovesci intensi",
    85: "Rovesci di neve leggeri",
    86: "Rovesci di neve intensi",
    95: "Temporale",
    96: "Temporale con grandine leggera",
    99: "Temporale con grandine intensa"
};
    let city = 'Milano';

function Meteo() {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        async function getLocation(location) {
            const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${location}&count=1&language=en&format=json`);
            const data = await res.json();
            const result = data.results[0];
            return {
                name: result.name || "",
                lat: result.latitude,
                lon: result.longitude
            };
        }
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decoded = jwtDecode(token);
            city = decoded.city || city;
            console.log(city)
        } catch (error) {
            console.error("Token non valido", error);
        }
    }

    getWeather(city);


        async function getWeather(location) {
            try {
                const { lat, lon } = await getLocation(location);
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=weather_code,temperature_2m,wind_speed_10m,apparent_temperature,cloud_cover&daily=sunrise,sunset&format=json&timeformat=unixtime`);
                const data = await res.json();
                
                const currentTime = new Date();
                const sunrise = new Date(data.daily.sunrise[0] * 1000);
                const sunset = new Date(data.daily.sunset[0] * 1000);
                const currentHour = currentTime.getHours();

                const meteoInfo = {
                    Sunset: sunset,
                    Sunrise: sunrise,
                    temperatura: data.hourly.apparent_temperature[currentHour],
                    km_vento: data.hourly.wind_speed_10m[currentHour],
                    weather_code: data.hourly.weather_code[currentHour],
                    ora: currentHour,
                    icon: getWeatherIcon(currentTime, data.hourly.weather_code[currentHour], sunrise, sunset)
                };

                setWeatherData(meteoInfo);

                const bgClass = getBackgroundClass(currentTime, meteoInfo.weather_code, sunrise, sunset);
                document.body.className = bgClass;
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        }

    }, []);

    return (
        <div className="meteo-box">
            {weatherData ? (
                <div className="weather-card">
                    <div className="weather-icon">{weatherData.icon}</div>
                    <h2>Meteo a {city}</h2>
                    <div className="weather-details">
                        <div className="weather-row">
                            <span className="weather-label">Alba:</span>
                            <span className="weather-value">{weatherData.Sunrise.toLocaleTimeString()}</span>
                        </div>
                        <div className="weather-row">
                            <span className="weather-label">Tramonto:</span>
                            <span className="weather-value">{weatherData.Sunset.toLocaleTimeString()}</span>
                        </div>
                        <div className="weather-row">
                            <span className="weather-label">Temperatura:</span>
                            <span className="weather-value">{weatherData.temperatura}°C</span>
                        </div>
                        <div className="weather-row">
                            <span className="weather-label">Vento:</span>
                            <span className="weather-value">{weatherData.km_vento} km/h</span>
                        </div>
                        <div className="weather-row">
                            <span className="weather-label">Condizione:</span>
                            <span className="weather-value">{weatherCodeMap[weatherData.weather_code]}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="loading">Caricamento meteo...</div>
            )}
        </div>
    );
}

export default Meteo;