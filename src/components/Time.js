import React, { useState, useEffect } from "react";
import "../static/css/time.css";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Time() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    function updateTime() {
      setDate(new Date());

      // Time controls background video playback.
      var video = document.getElementById("background-video");
      video.playbackRate = 0.5;
    }

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  let [, hours, minutes, seconds, ampm] =
    /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}) ([A-Z]{2})/.exec(
      date.toLocaleTimeString()
    );

  return (
    <div className="time">
      <div className="curr-time">
        <span className="time-hm">{`${hours}:${minutes}`}</span>
        <div className="time-extra">
          <span className="time-ampm">{` ${ampm}`}</span>
          <span className="time-sec">{`${seconds}`}</span>
        </div>
      </div>
      <p className="full-date">{`${days[date.getDay()]}, ${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`}</p>
    </div>
  );
}
