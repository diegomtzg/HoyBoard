import React from "react";
import GoogleSignInImg from "../../static/images/google_signin.png";
import "../../static/css/buttons.css";

export default function GoogleSignInButton() {
  function handleSignIn() {
    window.gapi.auth2.getAuthInstance().signIn({ prompt: "select_account" });
  }

  return (
    <img
      className="google-signin"
      src={GoogleSignInImg}
      alt="Sign in with Google"
      onClick={handleSignIn}
    />
  );
}
