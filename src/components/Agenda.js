import React, { useState, useEffect } from "react";

const fetchPeriod = 1000 * 60 * 60;
const numResults = 5;

export default function Agenda() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchUpcomingEvents() {
      console.log("Fetching events...");
      if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
        console.log("Not signed in...");
        return;
      }

      window.gapi.client.calendar.events
        .list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        })
        .then(function (response) {
          var events = response.result.items;
          console.log("Upcoming events:");

          if (events.length > 0) {
            for (let i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              console.log(event.summary + " (" + when + ")");
            }
          } else {
            console.log("No upcoming events found.");
          }
        });
    }

    // fetchUpcomingEvents();
    // const interval = setInterval(fetchEvents, fetchPeriod);
    // return () => clearInterval(interval);
  }, []);

  function fetchUpcomingEvents() {
    console.log("Fetching events...");
    if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      console.log("Not signed in...");
      return;
    }

    var midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    midnight.setDate(midnight.getDate() + 1);

    window.gapi.client.calendar.events
      .list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: midnight.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      })
      .then(function (response) {
        var events = response.result.items;
        if (events.length > 0) {
          events.forEach((event) => {
            var when = event.start.dateTime;
            if (!when) {
              // All day events use start.date instead of start.dateTime
              console.log(`All day: ${event.summary} on ${event.start.date}`);
            } else {
              console.log(`Not all day: ${event.summary} at ${when}`);
            }
          });
        } else {
          console.log("No more events today.");
        }
      });
  }

  return (
    <div className="agenda">
      <h1>Agenda</h1>
    </div>
  );
}
