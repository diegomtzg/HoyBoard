import React, { useState, useEffect } from "react";

// Every 30 minutes
const fetchPeriod = 1000 * 60 * 30;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export default function Weather() {
  const [weather, setWeather] = useState({
    current: {
      temp_c: "0",
      condition: {
        text: "Description",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      },
    },
    location: {
      name: "Name",
      region: "Region",
    },
  });

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
      console.log(weather);
      setWeather(weather);
    }

    fetchWeather();
    const interval = setInterval(fetchWeather, fetchPeriod);
    return () => clearInterval(interval);
  }, []);

  // TODO: Figure out how to have loading screen until all components have finished mounting.
  // TODO: Add icon from weather.current.condition.icon (cdn.weatherapi.com/weather/64x64/day/116.png)
  // TODO: You can use weather.current.is_day to switch between light/dark mode.
  return (
    <div className="weather">
      <p>{parseInt(weather.current.temp_c)}°C</p>
      <p>{weather.current.condition.text}</p>
      <p>
        {decodeURIComponent(escape(weather.location.name))},{" "}
        {decodeURIComponent(escape(weather.location.region))}
      </p>
    </div>
  );
}
