import React, { useState, useEffect } from "react";
import "../static/css/nowplaying.css";

export default function NowPlaying() {
  const [token, setToken] = useState();

  useEffect(() => {
    async function fetchSpotifyData() {
      // Get the hash of the url
      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function (initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
      // window.location.hash = "";

      let _token = hash.access_token;

      if (_token) {
        // Redirected from spotify.
        setToken(_token);
      }

      console.log(token);

      // TODO: No response (status 204) if nothing playing
      console.log(
        await (
          await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            }
          )
        ).json()
      );
    }

    fetchSpotifyData();
  }, [token]);

  function renderSpotifyPlayer() {
    return <h1>Spotify Player</h1>;
  }

  return (
    <div className="nowplaying">
      <h1 className="nowplaying-title">Now Playing</h1>
      {!token && (
        <a
          href={
            "https://accounts.spotify.com/authorize?" +
            `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
            `redirect_uri=http://localhost:3000/&` +
            `scope=user-read-currently-playing%20user-read-playback-state&` +
            `response_type=token`
          }
        >
          Login to Spotify
        </a>
      )}
      {token && renderSpotifyPlayer()}
    </div>
  );
}
