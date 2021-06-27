import React from "react";
import "../../static/css/buttons.css";

export default function TrelloSignInButton() {
  return (
    <a
      href={
        `https://trello.com/1/authorize?` +
        `scope=read&response_type=token&expiration=never&name=HoyBoard&` +
        `key=${process.env.REACT_APP_TRELLO_API_KEY}`
      }
    >
      <button className="trello-signin">Sign in with Trello</button>
    </a>
  );
}
