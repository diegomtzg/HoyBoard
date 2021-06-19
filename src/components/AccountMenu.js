import React, { useContext } from "react";
import AccountContext from "./AccountContext";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@material-ui/core/Button";

export default function AccountMenu() {
  const { signedIn } = useContext(AccountContext);

  function getUserName() {
    if (signedIn) {
      return window.gapi.auth2
        .getAuthInstance()
        .currentUser.get()
        .getBasicProfile()
        .getGivenName();
    } else {
      return "Sign In";
    }
  }

  function handleSignIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  function handleSignOut() {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  function signOutButton() {
    if (signedIn) {
      return (
        <a onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      );
    }
  }

  return (
    <div>
      <Button
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={(event) => {
          handleSignIn();
        }}
      >
        {getUserName()}
        {signOutButton()}
      </Button>
    </div>
  );
}
