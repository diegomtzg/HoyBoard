import React, { useState, useEffect } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import "../static/css/nowplaying.css";

// Once per second
const fetchPeriod = 1000;

export default function NowPlaying() {
  const [token, setToken] = useState();
  const [playing, setPlaying] = useState(false);
  const [song, setSong] = useState();
  const [progressMs, setProgress] = useState();

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

      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      if (response.status === 204) {
        // If playing nothing, status is 204.
        setPlaying(false);
      }
      if (response.status === 200) {
        const nowPlayingJson = await response.json();
        console.log(nowPlayingJson);
        setSong(nowPlayingJson.item);
        setProgress(nowPlayingJson.progress_ms);
        setPlaying(true);
      }
    }

    fetchSpotifyData();
  }, [token]);

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
          <img
            className="nowplaying-artwork"
            src={song.album.images[1].url}
            alt={song.album.name}
          />
          <div className="nowplaying-text">
            <p className="nowplaying-name">{song.name}</p>
            <p className="nowplaying-artist">{song.artists[0].name}</p>
            <p className="nowplaying-album">{song.album.name}</p>
          </div>
        </div>
        <div className="nowplaying-progress">
          <span className="progressbar-left">
            {millisToMinutesAndSeconds(progressMs)}
          </span>
          <LinearProgress
            className="progressbar-center"
            variant="determinate"
            value={(progressMs * 100) / song.duration_ms}
          />
          <span className="progressbar-right">
            {millisToMinutesAndSeconds(song.duration_ms)}
          </span>
        </div>
      </div>
    );
  }

  console.log(token);
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
