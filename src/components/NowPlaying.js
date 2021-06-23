import React, { useState, useEffect, useContext } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import AccountContext from "./AccountContext";
import "../static/css/nowplaying.css";

export default function NowPlaying() {
  useEffect(() => {
    // Get parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    let spotifyCode = urlParams.get("code");

    if (spotifyCode) {
      // Redirected from spotify, exchange code for access token
      fetch(`https://accounts.spotify.com/api/token`, {
        mode: "no-cors",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
          grant_type: "authorization_code",
          code: spotifyCode,
          redirect_uri: "http://localhost:3000/",
          client_id: `${process.env.REACT_APP_SPOTIFY_CLIENT_ID}`,
          client_secret: `${process.env.REACT_APP_SPOTIFY_CLIENT_SECRET}`,
        },
      }).then((response) => {
        console.log(response);
      });
    }
  }, []);

  return (
    <div className="nowplaying">
      <h1 className="nowplaying-title">Now Playing</h1>
      {
        <a
          href={
            "https://accounts.spotify.com/authorize?" +
            `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
            `redirect_uri=http://localhost:3000/&` +
            `scope=user-read-currently-playing&response_type=code`
          }
        >
          Log in with Spotify
        </a>
      }
    </div>
  );
}
