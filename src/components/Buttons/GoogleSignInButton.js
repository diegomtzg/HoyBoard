import React from "react";

import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@material-ui/core/Button";

export default function GoogleSignInButton() {
  // function getUserName() {
  //     return window.gapi.auth2
  //       .getAuthInstance()
  //       .currentUser.get()
  //       .getBasicProfile()
  //       .getGivenName();
  // }

  function handleSignIn() {
    window.gapi.auth2.getAuthInstance().signIn();
  }

  /*
  function handleSignOut() {
    window.gapi.auth2.getAuthInstance().signOut();
  }

  function signOutButton() {
    if (googleSignedIn) {
      return (
        <a onClick={handleSignOut}>
          <FontAwesomeIcon icon={faSignOutAlt} />
        </a>
      );
    }
  }
  */

  return (
    <Button
      aria-controls="simple-menu"
      aria-haspopup="true"
      onClick={(event) => {
        handleSignIn();
      }}
    >
      Sign in to Google
    </Button>
  );
}
