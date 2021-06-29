import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpotify } from "@fortawesome/free-brands-svg-icons";
import { redirect_uri } from "../../App";
import "../../static/css/buttons.css";

export default function SpotifySigninButton() {
  return (
    <a
      href={
        "https://accounts.spotify.com/authorize?" +
        `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
        `redirect_uri=${redirect_uri}&` +
        `scope=user-read-currently-playing%20user-read-playback-state&` +
        `show_dialog=true&` +
        `response_type=token`
      }
    >
      <button className="spotify-login-button">
        <FontAwesomeIcon icon={faSpotify} /> Login with Spotify
      </button>
    </a>
  );
}
