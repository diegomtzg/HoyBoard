import React, { useState, useEffect, useContext } from "react";
import AccountContext from "./AccountContext";
import PulseLoader from "react-spinners/PulseLoader";
import "../static/css/emails.css";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;
const maxResults = 4;

export default function Emails() {
  const { signedIn } = useContext(AccountContext);
  const [emailIds, setEmailIds] = useState([]);
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchEmails() {
      if (!signedIn) {
        return;
      }

      console.log("Fetching unread emails...");
      window.gapi.client.gmail.users.messages
        .list({
          userId: "me",
          labelIds: ["INBOX", "UNREAD"],
          maxResults: maxResults,
        })
        .then((listResponse) => {
          const ids = listResponse.result.messages.map((message) => message.id);
          setEmailIds(ids);

          var numLoaded = 0;
          ids.forEach((id) => {
            // We have ids for each email so we need to get additional information.
            window.gapi.client.gmail.users.messages
              .get({
                userId: "me",
                id: id,
              })
              .then((detailResponse) => {
                var date = detailResponse.result.internalDate;
                var snippet = detailResponse.result.snippet.replace(
                  /&#39;/g,
                  "'"
                );
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

                var emailDict = emails;
                if (!(id in emailDict)) {
                  emailDict[id] = email;
                  setEmails(emailDict);
                }
                numLoaded++;

                if (numLoaded === ids.length) {
                  // Finished loading all emails.
                  setLoading(false);
                }
              });
          });
        });
    }

    fetchEmails();
    const interval = setInterval(fetchEmails, fetchPeriod);
    return () => clearInterval(interval);
  }, [signedIn, emails]);

  function renderEmail(emailId) {
    const email = emails[emailId];
    return (
      <div className="email-content">
        <span className="email-sender">{email.sender + " – "}</span>
        <span className="email-subject">{email.subject}</span> |{" "}
        <span className="email-snippet">{email.snippet}</span>
      </div>
    );
  }

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="emails">
        <h1 className="emails-title">New Emails</h1>
        <ul className="email-list">
          {emailIds.map((id, idx) => (
            <li className="email-item" key={idx}>
              {renderEmail(id)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
