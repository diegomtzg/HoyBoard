import React, { useState, useContext } from "react";
import AccountContext from "./AccountContext";

export default function Emails() {
  const { signedIn } = useContext(AccountContext);

  function fetchUnreadEmails() {
    if (!signedIn) {
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
              console.log(
                window._.unescape(sender),
                window._.unescape(subject),
                window._.unescape(snippet)
              );
            });
        });
      });
  }

  return (
    <div className="emails">
      <h1>Emails</h1>
      <button onClick={fetchUnreadEmails}>Fetch Emails</button>
    </div>
  );
}
