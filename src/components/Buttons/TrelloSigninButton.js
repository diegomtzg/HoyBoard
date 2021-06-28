import React from "react";
import TrelloClient from "react-trello-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrello } from "@fortawesome/free-brands-svg-icons";
import "../../static/css/buttons.css";

export default function TrelloSignInButton(props) {
  return (
    <TrelloClient
      apiKey={process.env.REACT_APP_TRELLO_API_KEY}
      clientVersion={1}
      apiEndpoint="https://api.trello.com"
      authEndpoint="https://trello.com"
      intentEndpoint="https://trello.com"
      authorizeName="HoyBoard"
      authorizeExpiration="never"
      authorizeOnSuccess={() => {
        props.setSignedInFunction(true);
        window.localStorage.setItem("trello_token", window.Trello.token());
      }}
      authorizeOnError={(error) => console.log("Login error!", error)}
      autoAuthorize={false}
      authorizeButton={true}
      buttonStyle="metamorph"
      buttonText={<FontAwesomeIcon icon={faTrello} />}
      buttonCustomStyles={{
        background: "#026AA7",
        "box-shadow": "0px 0px 0 #8FB4D3",
        marginLeft: "15px",
      }}
    />
  );
}
