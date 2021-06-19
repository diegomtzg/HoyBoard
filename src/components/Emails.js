import React, { useState, useEffect, useContext } from "react";
import AccountContext from "./AccountContext";
import "../static/css/emails.css";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function Emails() {
  const { signedIn } = useContext(AccountContext);
  const [emailIds, setEmailIds] = useState([]);
  const [emails, setEmails] = useState({});

  useEffect(() => {
    function fetchUnreadEmailIds() {
      if (!signedIn) {
        return;
      }

      console.log("Fetching unread emails...");
      window.gapi.client.gmail.users.messages
        .list({
          userId: "me",
          labelIds: ["INBOX", "UNREAD"],
          maxResults: 10,
        })
        .then((listResponse) => {
          const ids = listResponse.result.messages.map((message) => message.id);
          setEmailIds(ids);
        });

      emailIds.forEach((id) => {
        // We have ids for each email so we need to get additional information.
        window.gapi.client.gmail.users.messages
          .get({
            userId: "me",
            id: id,
          })
          .then((detailResponse) => {
            var date = detailResponse.result.internalDate;
            var snippet = detailResponse.result.snippet.replace(/&#39;/g, "'");
            var subject, sender;
            detailResponse.result.payload.headers.forEach((header) => {
              if (header.name === "Subject" || header.name === "subject") {
                subject = header.value;
              }
              if (header.name === "From" || header.name === "from") {
                try {
                  [, sender] = /"?([^"\n]*)"? <.*>/.exec(header.value);
                } catch (error) {
                  sender = header.value;
                }
              }
            });
            if (subject === undefined) {
              subject = "(no subject)";
            }
            const email = {
              sender: sender,
              subject: subject,
              snippet: snippet,
              date: date,
            };

            var currEmails = emails;
            currEmails[id] = email;
            setEmails(currEmails);
          });
      });
    }

    fetchUnreadEmailIds();
    // const interval = setInterval(fetchUnreadEmails, fetchPeriod);
    // return () => clearInterval(interval);
  }, [signedIn]);

  return (
    <div className="emails">
      <h1>Emails</h1>
      <ul>
        {emailIds.map((id, idx) => (
          <li key={idx}>{emails[id].sender}</li>
        ))}
      </ul>
    </div>
  );
}
