import React, { useState, useEffect } from "react";

export default function GoogleAuthButton() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    function initGoogleClient() {
      window.gapi.client
        .init({
          apiKey: process.env.REACT_APP_GCAL_API_KEY,
          clientId: process.env.REACT_APP_GCAL_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope:
            "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly",
        })
        .then(function () {
          // Listen for sign-in state changes.
          window.gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen((isSignedIn) => {
              setSignedIn(isSignedIn);
            });

          // Handle the initial sign-in state.
          setSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    // Request auth2 library after component mounts.
    window.gapi.load("client:auth2", initGoogleClient);
  }, []);

  function handleAuthClick() {
    window.gapi.auth2.getAuthInstance().signIn();
    fetchUpcomingEvents();
    fetchUnreadEmails();
  }

  function fetchUnreadEmails() {
    if (!window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
      console.log("Not signed in...");
      return;
    }

    window.gapi.client.gmail.users.messages
      .list({
        userId: "me",
        labelIds: ["INBOX", "UNREAD"],
        maxResults: 10,
      })
      .then(function (listResponse) {
        var messages = listResponse.result.messages;
        messages.forEach((messageId) => {
          window.gapi.client.gmail.users.messages
            .get({
              userId: "me",
              id: messageId.id,
            })
            .then((getResponse) => {
              var message = getResponse.result;
              var snippet = message.snippet.replace(/&#39;/g, "'");
              var subject, sender;
              message.payload.headers.forEach((header) => {
                if (header.name === "Subject" || header.name === "subject") {
                  subject = header.value;
                }
                if (header.name === "From" || header.name === "from") {
                  [, sender] = /"?([^"\n]*)"? <.*>/.exec(header.value);
                }
              });
              console.log(sender, subject, snippet);
            });
        });
      });
  }

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

  function renderButton() {
    if (signedIn) {
      return <button onClick={handleAuthClick}>Authorize</button>;
    }
  }

  return <div className="google-auth">{renderButton()}</div>;
}