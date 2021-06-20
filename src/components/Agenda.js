import React, { useState, useEffect, useContext } from "react";
import AccountContext from "./AccountContext";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function Agenda() {
  const { signedIn } = useContext(AccountContext);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchUpcomingEvents() {
      if (!signedIn) {
        return;
      }

      console.log("Fetching events...");
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
          var sortedEvents = sortEvents(response.result.items);
          setEvents(sortedEvents);
          setLoading(false);
        });
    }

    fetchUpcomingEvents();
    const interval = setInterval(fetchUpcomingEvents, fetchPeriod);
    return () => clearInterval(interval);
  }, [signedIn]);

  function sortEvents(items) {
    var sortedEvents = { allDay: [], regular: [], empty: false };
    if (items.length > 0) {
      items.forEach((event) => {
        var when = event.start.dateTime;
        if (!when) {
          // All-day events use start.date instead of start.dateTime
          sortedEvents.allDay.push(event);
        } else {
          // TODO: If ongoing, display when it ends instead of when it starts (ends in ...)
          sortedEvents.regular.push(event);
        }
      });
    } else {
      // No more events left today.
      sortedEvents.empty = true;
    }

    return sortedEvents;
  }

  function getEventTime(eventDateString) {
    let [, hours, minutes, , ampm] =
      /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}) ([A-Z]{2})/.exec(
        new Date(eventDateString).toLocaleTimeString()
      );
    return `${hours}:${minutes} ${ampm}`;
  }

  function renderAgenda() {
    if (loading) {
      return <p>Loading Agenda...</p>;
    } else {
      return (
        <div className="Agenda">
          <h3>All Day</h3>
          {events.allDay.map((allDayEvent) => (
            <p>{`${allDayEvent.summary}`}</p>
          ))}
          <h3>Regular</h3>
          {events.regular.map((regularEvent) => (
            <p>{`${getEventTime(regularEvent.start.dateTime)}: ${
              regularEvent.summary
            }`}</p>
          ))}
        </div>
      );
    }
  }

  return renderAgenda();
}
