import React, { useState, useEffect, useContext } from "react";
import AccountContext from "./AccountContext";
import "../static/css/emails.css";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function Emails() {
  const { signedIn } = useContext(AccountContext);
  const [emailIds, setEmailIds] = useState([]);

  useEffect(() => {
    async function fetchUnreadEmails() {
      if (!signedIn) {
        return;
      }

      console.log("Fetching emails...");
      window.gapi.client.gmail.users.messages
        .list({
          userId: "me",
          labelIds: ["INBOX", "UNREAD"],
          maxResults: 10,
        })
        .then(function (response) {
          setEmailIds(response.result.messages.map((message) => message.id));
        });
    }

    fetchUnreadEmails();
    // const interval = setInterval(fetchUnreadEmails, fetchPeriod);
    // return () => clearInterval(interval);
  }, [signedIn]);

  function renderEmail(emailId) {
    window.gapi.client.gmail.users.messages
      .get({
        userId: "me",
        id: emailId,
      })
      .then((response) => {
        var snippet = response.result.snippet.replace(/&#39;/g, "'");
        var subject, sender;
        response.result.payload.headers.forEach((header) => {
          if (header.name === "Subject" || header.name === "subject") {
            subject = header.value;
          }
          if (header.name === "From" || header.name === "from") {
            [, sender] = /"?([^"\n]*)"? <.*>/.exec(header.value);
          }
        });

        console.log(sender);
        return (
          <p>
            {sender} – {subject}
          </p>
        );
      });
  }

  return (
    <div className="emails">
      <h1>Emails</h1>
      <ul>
        {emailIds.map((emailId, idx) => (
          <li key={idx}>{emailId}</li>
        ))}
      </ul>
    </div>
  );
}
