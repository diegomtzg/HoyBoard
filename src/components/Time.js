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
  });

  var dateString = date.toLocaleTimeString();

  return (
    <div className="time">
      <p className="curr-time">
        {dateString.substring(0, dateString.length - 6) +
          dateString.substring(dateString.length - 3, dateString.length)}
      </p>
      <p className="weekday">{days[date.getDay()]}</p>
      <p className="full-date">{`${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`}</p>
    </div>
  );
}