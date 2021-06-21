import React, { useState, useEffect, useContext } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import AccountContext from "./AccountContext";
import "../static/css/agenda.css";

// Every minute
const fetchPeriod = 1000 * 60;

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

    if (false) {
      return `Ending in ${30} minutes.`;
    } else {
      return `Starts at ${hours}:${minutes} ${ampm}`;
    }
  }

  function renderEvents() {
    if (events.empty) {
      return <h3 className="no-events">No more events today!</h3>;
    } else {
      return (
        <ul className="events-list">
          {events.allDay.map((event, idx) => (
            <li className="event-item" key={idx}>
              <div className="event-details">
                <span className="event-name">{`${event.summary}`}</span>
                <span className="event-time">{`All day`}</span>
              </div>
            </li>
          ))}
          {events.regular.length > 0 ? <div className="border" /> : <span />}
          {events.regular.map((event, idx) => (
            <li className="event-item" key={idx}>
              <div className="event-details">
                <span className="event-name">{`${event.summary}`}</span>
                <span className="event-time">{`${getEventTime(
                  event.start.dateTime
                )}`}</span>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  }

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="agenda">
        <h1 className="agenda-title">Upcoming Events</h1>
        {renderEvents()}
      </div>
    );
  }
}
