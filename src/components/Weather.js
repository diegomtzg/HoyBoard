import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "../static/css/weather.css";

// Every 10 minutes
const fetchPeriod = 1000 * 60 * 10;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export default function Weather() {
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      // Figure out computer's current coordinates (takes a few seconds).
      const coords = (
        await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        )
      ).coords;
      console.log(
        `Fetching weather at (${coords.latitude},${coords.longitude})...`
      );

      var reqUrl =
        `http://api.weatherapi.com/v1/current.json?` +
        `key=${WEATHER_API_KEY}&` +
        `q=${coords.latitude},${coords.longitude}&` +
        `aqi=no`;
      const response = await fetch(reqUrl);
      const weather = await response.json();
      setWeather(weather);
      setLoading(false);
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, fetchPeriod);
    return () => clearInterval(interval);
  }, []);

  function renderWeather() {
    if (loading) {
      return <PulseLoader color={"#8f8f8f"} loading={loading} />;
    } else {
      return (
        <div className="weather">
          <div className="temperature">
            <span>{parseInt(weather.current.temp_c)}</span>
            <span className="degree">°C</span>
            <div className="icon-container">
              <img
                className="weather-icon"
                src={weather.current.condition.icon}
                alt={weather.current.condition.text}
              />
            </div>
          </div>
          <p className="condition-text">{weather.current.condition.text}</p>
          <p className="location">
            {/* Location names with accents need to be UTF-8 decoded */}
            {decodeURIComponent(escape(weather.location.name))},{" "}
            {decodeURIComponent(escape(weather.location.region))}
          </p>
        </div>
      );
    }
  }

  // TODO: You can use weather.current.is_day to switch between light/dark mode.
  return renderWeather();
}
