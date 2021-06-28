import React, { useState, useEffect } from "react";
import SpotifySigninButton from "./Buttons/SpotifySignInButton";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircleLoader from "react-spinners/CircleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPause,
  faUser,
  faPlay,
  faMusic,
  faCompactDisc,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import "../static/css/nowplaying.css";
import { redirect_uri } from "../App";

// Once per second
const fetchPeriod = 1000;

// https://developer.spotify.com/dashboard/applications/
export default function NowPlaying() {
  const [token, setToken] = useState();
  const [song, setSong] = useState();
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSpotifyData() {
      getSpotifyToken();

      if (!token) {
        return;
      }

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 401) {
        let errorJson = await response.json();
        if (errorJson.error.message === "The access token expired") {
          // Refresh access token
          window.location.assign(
            "https://accounts.spotify.com/authorize?" +
              `client_id=${process.env.REACT_APP_SPOTIFY_CLIENT_ID}&` +
              `redirect_uri=${redirect_uri}&` +
              `scope=user-read-currently-playing%20user-read-playback-state&` +
              `response_type=token`
          );
        }
      }

      if (response.status === 204) {
        // If playing nothing, status is 204.
        setPlaying(false);
      }
      if (response.status === 200) {
        const nowPlayingJson = await response.json();
        setSong(nowPlayingJson);
        setPlaying(true);
        setLoading(false);
      }
    }

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
      if (redirectToken) {
        // Redirected from spotify.
        setToken(redirectToken);

        // Store locally
        window.localStorage.setItem("spotify_token", redirectToken);

        // After 3600s, token is no longer valid.
        setTimeout(() => {
          window.localStorage.removeItem("spotify_token");
        }, 3600 * 1000);
      }

      // If we still don't have a token, check to see if we have a valid one stored.
      if (!token) {
        let storedToken = window.localStorage.getItem("spotify_token");
        setToken(storedToken);
      }
    }

    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, fetchPeriod);
    return () => clearInterval(interval);
  }, [token]);

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function renderSpotifyPlayer() {
    if (loading) {
      return (
        <div className="nowplaying-loader">
          <CircleLoader size={100} color={"#F50057"} loading={loading} />
        </div>
      );
    }

    if (!playing) {
      return <h1 className="no-song">Nothing is playing.</h1>;
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

  function handleSignOut() {
    window.localStorage.removeItem("spotify_token");
    setToken(false);
  }

  return (
    <div className="now-playing-container">
      <h1 className="nowplaying-title">
        Now Playing
        {token && (
          <FontAwesomeIcon
            className="trello-signout-icon"
            icon={faSignOutAlt}
            onClick={handleSignOut}
          />
        )}
      </h1>
      {token ? renderSpotifyPlayer() : <SpotifySigninButton />}
    </div>
  );
}
