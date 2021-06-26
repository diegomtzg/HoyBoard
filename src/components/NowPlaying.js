import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faUser,
  faPlay,
  faMusic,
  faCompactDisc,
} from "@fortawesome/free-solid-svg-icons";
import "../static/css/nowplaying.css";

// Once per second
const fetchPeriod = 1000;

export default function NowPlaying() {
  const [token, setToken] = useState();
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState();

  useEffect(() => {
    async function fetchSpotifyData() {
      getSpotifyToken();

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (
        response.status === 401 &&
        response.message === "Access token expired"
      ) {
        console.log(response);
        // Refresh access token
        window.location.replace(
          "https://accounts.spotify.com/authorize?" +
            `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
            `redirect_uri=http://localhost:3000/&` +
            `scope=user-read-currently-playing%20user-read-playback-state&` +
            `response_type=token`
        );
      }

      if (response.status === 204) {
        // If playing nothing, status is 204.
        setPlaying(false);
      }
      if (response.status === 200) {
        const nowPlayingJson = await response.json();
        setSong(nowPlayingJson);
        setPlaying(true);
      }
    }

    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, fetchPeriod);
    return () => clearInterval(interval);
  }, [token]);

  // Very hacky way of refreshing token every hour...
  function getSpotifyToken() {
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
    window.location.hash = "";
    let redirectToken = hash.access_token;

    // If redirectToken here is not null, we redirected from spotify
    if (redirectToken !== null && redirectToken !== undefined) {
      // Redirected from spotify.
      setToken(redirectToken);

      // Store locally
      window.localStorage.setItem("spotify_token", redirectToken);

      // After 3600s, token is no longer valid.
      setTimeout(() => {
        window.localStorage.setItem("spotify_token", null);
      }, 3600 * 1000);
    }

    // So we didn't redirect from spotify, let's check if we have a valid token stored locally.
    // If not, we redirect.
    let _token = window.localStorage.getItem("spotify_token");
    if (_token === null || _token === "undefined") {
      // Redirect to spotify to refresh token. Expires after 3600s.
      window.location.replace(
        "https://accounts.spotify.com/authorize?" +
          `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
          `redirect_uri=http://localhost:3000/&` +
          `scope=user-read-currently-playing%20user-read-playback-state&` +
          `response_type=token`
      );
    } else {
      setToken(_token);
    }
  }

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function renderSpotifyPlayer() {
    if (!playing) {
      // Render nothing.
      return null;
    }

    return (
      <div className="now-playing">
        <div className="nowplaying-info">
          <div className="nowplaying-text">
            <p className="nowplaying-name text-margin">
              <FontAwesomeIcon className="nowplaying-icon" icon={faMusic} />{" "}
              {song.item.name}
            </p>
            <p className="nowplaying-artist text-margin">
              <FontAwesomeIcon className="nowplaying-icon" icon={faUser} />{" "}
              {song.item.artists.map((artist) => artist.name).join(", ")}
            </p>
            <p className="nowplaying-album text-margin">
              <FontAwesomeIcon
                className="nowplaying-icon"
                icon={faCompactDisc}
              />{" "}
              {song.item.album.name}
            </p>
            <p className="nowplaying-progress-text text-margin">
              <FontAwesomeIcon
                className="nowplaying-icon"
                icon={song.is_playing ? faPlay : faPause}
              />{" "}
              {`${millisToMinutesAndSeconds(
                song.progress_ms
              )} / ${millisToMinutesAndSeconds(song.item.duration_ms)}`}
            </p>
          </div>
          <img
            className="nowplaying-artwork"
            src={song.item.album.images[1].url}
            alt={song.item.album.name}
          />
        </div>
        <div className="nowplaying-progress">
          <LinearProgress
            className="progressbar-center"
            variant="determinate"
            color="primary"
            value={(song.progress_ms * 100) / song.item.duration_ms}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="now-playing-container">
      {token === undefined && (
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
      {token !== undefined && renderSpotifyPlayer()}
    </div>
  );
}
