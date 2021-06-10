import React, { useState, useEffect } from "react";

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
    setInterval(() => {
      setDate(new Date());
    }, 1000);
  }, []);

  let [, hours, minutes, seconds, ampm] =
    /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}) ([A-Z]{2})/.exec(
      date.toLocaleTimeString()
    );

  return (
    <div className="time">
      <p className="curr-time">{`${hours}:${minutes}:${seconds} ${ampm}`}</p>
      <p className="weekday">{days[date.getDay()]}</p>
      <p className="full-date">{`${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`}</p>
    </div>
  );
}
