import React, { useState, useEffect, useContext } from "react";
import GoogleSignInButton from "./Buttons/GoogleSignInButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import CircleLoader from "react-spinners/CircleLoader";
import AccountContext from "./AccountContext";
import "../static/css/agenda.css";

// Every minute
const fetchPeriod = 1000 * 10;

export default function Agenda() {
  const { googleSignedIn, loadingGoogleSignIn } = useContext(AccountContext);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchUpcomingEvents() {
      if (!googleSignedIn) {
        return;
      }

      var midnight = new Date();
      midnight.setHours(0, 0, 0, 0);
      midnight.setDate(midnight.getDate() + 1);

      window.gapi.client.calendar.events
        .list({
          calendarId: "diegomtzg@google.com", // work calendar
          timeMin: new Date().toISOString(),
          timeMax: midnight.toISOString(),
          showDeleted: false,
          singleEvents: true,
          maxResults: 10,
          orderBy: "startTime",
        })
        .then(function (response) {
          console.log(response.result.items);
          var sortedEvents = sortEvents(response.result.items);
          setEvents(sortedEvents);
          setLoading(false);
        });
    }

    fetchUpcomingEvents();
    const interval = setInterval(fetchUpcomingEvents, fetchPeriod);
    return () => clearInterval(interval);
  }, [googleSignedIn]);

  function sortEvents(items) {
    var numUndef = 1;
    var sortedEvents = { allDay: [], regular: [], empty: false };
    if (items.length > 0) {
      items.forEach((event) => {
        var when = event.start.dateTime;
        // Private work events don't show their name
        if (event.summary === undefined) {
          event.summary = "Meeting " + numUndef;
          numUndef += 1;
        }
        if (!when) {
          // All-day events use start.date instead of start.dateTime
          sortedEvents.allDay.push(event);
        } else {
          sortedEvents.regular.push(event);
        }
      });
    } else {
      // No more events left today.
      sortedEvents.empty = true;
    }

    return sortedEvents;
  }

  function getEventTime(event) {
    const eventStart = new Date(event.start.dateTime);
    const eventEnd = new Date(event.end.dateTime);
    let [, startHours, startMinutes, , startAmPm] =
      /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}) ([A-Z]{2})/.exec(
        eventStart.toLocaleTimeString()
      );
    let [, endHours, endMinutes, , endAmPm] =
      /([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}) ([A-Z]{2})/.exec(
        eventEnd.toLocaleTimeString()
      );

    const currTime = new Date();
    const diffMs = eventEnd - currTime;
    const minutesToEnd = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    if (currTime > eventStart && currTime < eventEnd) {
      return `Ends in ${minutesToEnd} minutes`;
    } else {
      return `${startHours}:${startMinutes} ${startAmPm} – ${endHours}:${endMinutes} ${endAmPm}`;
    }
  }

  function handleSignOut() {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  function renderEvents() {
    if (events.empty) {
      return <h3 className="no-events">No more events today.</h3>;
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
                <span className="event-time">{`${getEventTime(event)}`}</span>
              </div>
            </li>
          ))}
        </ul>
      );
    }
  }

  if (loadingGoogleSignIn) {
    return (
      <div className="agenda">
        <h1 className="agenda-title">Today's Events</h1>
        <div className="agenda-loader">
          <CircleLoader size={100} color={"#F50057"} loading={loading} />
        </div>
      </div>
    );
  }

  if (googleSignedIn) {
    if (loading) {
      return (
        <div className="agenda">
          <h1 className="agenda-title">Today's Events</h1>
          <div className="agenda-loader">
            <CircleLoader size={100} color={"#F50057"} loading={loading} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="agenda">
          <h1 className="agenda-title">
            Today's Events
            <FontAwesomeIcon
              className="google-signout-icon"
              icon={faSignOutAlt}
              onClick={handleSignOut}
            />
          </h1>
          {renderEvents()}
        </div>
      );
    }
  } else {
    return (
      <div className="agenda">
        <h1 className="agenda-title">Today's Events</h1>
        <GoogleSignInButton />
        <p className="agenda-disclaimer">
          HoyBoard pulls today's agenda from the primary Google calendar
          associated with the email you signed in with.
        </p>
      </div>
    );
  }
}
