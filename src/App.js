import React, { useState, useEffect } from "react";
import daynight from "./static/videos/daynight.webm";

import Time from "./components/Time";
import News from "./components/News";
import Agenda from "./components/Agenda";
import ToDo from "./components/ToDo";
import Quotes from "./components/Quotes";
import Weather from "./components/Weather";
import Emails from "./components/Emails";
import NowPlaying from "./components/NowPlaying";
import AccountContext from "./components/AccountContext";
import ReactGA from "react-ga";

// Environment variable so that same code works on deployed version (localhost vs diegomartinez.me)
export var redirect_uri = process.env.REACT_APP_REDIRECT_URI;

function App() {
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  const [loadingGoogleSignIn, setLoadingGoogleSignIn] = useState(true);

  useEffect(() => {
    function initGoogleClient() {
      window.gapi.client
        .init({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
          clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          discoveryDocs: [
            "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
            "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
          ],
          scope:
            "https://www.googleapis.com/auth/calendar.readonly " +
            "https://www.googleapis.com/auth/gmail.readonly",
        })
        .then(function () {
          // Listen for sign-in state changes.
          window.gapi.auth2
            .getAuthInstance()
            .isSignedIn.listen((isSignedIn) => {
              setGoogleSignedIn(isSignedIn);
            });

          // Handle the initial sign-in state.
          setGoogleSignedIn(
            window.gapi.auth2.getAuthInstance().isSignedIn.get()
          );
          setLoadingGoogleSignIn(false);
        });
    }

    // Request auth2 library after component mounts.
    window.gapi.load("client:auth2", initGoogleClient);

    // Initialize site analytics
    ReactGA.initialize(process.env.REACT_APP_GA_KEY);
    ReactGA.pageview("hoyboard");
  }, []);

  return (
    <div className="app">
      <video id="background-video" autoPlay loop muted>
        <source src={daynight} type="video/webm" />
      </video>

      <AccountContext.Provider value={{ googleSignedIn, loadingGoogleSignIn }}>
        <div className="main">
          {/* Split main screen into three columns. */}
          <div className="main-col main-left">
            <Time />
            <News />
          </div>
          <div className="main-col main-center">
            <NowPlaying />
            <Agenda />
          </div>
          <div className="main-col main-right">
            <Weather />
            <ToDo />
            <Emails />
          </div>
        </div>
        <div className="bottom">
          <Quotes />
        </div>
      </AccountContext.Provider>
    </div>
  );
}

export default App;
