import React, { useState, useEffect, useContext } from "react";
import GoogleSignInButton from "./Buttons/GoogleSignInButton";
import AccountContext from "./AccountContext";
import CircleLoader from "react-spinners/CircleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "../static/css/emails.css";

// Every minute
const fetchPeriod = 1000 * 60;
const maxResults = 4;

export default function Emails() {
  const { googleSignedIn } = useContext(AccountContext);
  const [threadIds, setThreadIds] = useState([]);
  const [emails, setEmails] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function fetchEmails() {
      if (!googleSignedIn) {
        return;
      }

      console.log("Fetching unread emails...");
      window.gapi.client.gmail.users.threads
        .list({
          userId: "me",
          labelIds: ["INBOX", "UNREAD"],
          maxResults: maxResults,
        })
        .then((listResponse) => {
          if (listResponse.result.resultSizeEstimate === 0) {
            setLoading(false);
          }
          const ids = listResponse.result.threads.map((thread) => thread.id);
          setThreadIds(ids);

          var numLoaded = 0;
          ids.forEach((id) => {
            // We have ids for each email so we need to get additional information.
            window.gapi.client.gmail.users.threads
              .get({
                userId: "me",
                id: id,
              })
              .then((detailResponse) => {
                var message = detailResponse.result.messages[0];
                var date = message.internalDate;
                var snippet = message.snippet.replace(/&#39;/g, "'");
                var subject, sender;
                message.payload.headers.forEach((header) => {
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
  }, [googleSignedIn, emails]);

  function handleSignOut() {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  function renderEmail(emailId) {
    const email = emails[emailId];
    if (email !== undefined) {
      return (
        <div className="email-content">
          <span className="email-sender">{email.sender + " – "}</span>
          <span className="email-subject">{email.subject}</span> |{" "}
          <span className="email-snippet">{email.snippet}</span>
        </div>
      );
    }
  }

  if (googleSignedIn) {
    if (loading) {
      return (
        <div className="emails loader">
          <CircleLoader size={100} color={"#F50057"} loading={loading} />
        </div>
      );
    } else {
      return (
        <div className="emails">
          <h1 className="emails-title">
            New Emails
            <FontAwesomeIcon
              className="google-signout-icon"
              icon={faSignOutAlt}
              onClick={handleSignOut}
            />
          </h1>
          <ul className="email-list">
            {threadIds.length === 0 && (
              <h3 className="no-emails">No new emails!</h3>
            )}
            {threadIds.length > 0 &&
              threadIds.map((id, idx) => (
                <li className="email-item" key={idx}>
                  {renderEmail(id)}
                </li>
              ))}
          </ul>
        </div>
      );
    }
  } else {
    return (
      <div className="emails">
        <h1 className="emails-title">New Emails</h1>
        <GoogleSignInButton />
      </div>
    );
  }
}
