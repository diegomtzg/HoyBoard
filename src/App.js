import React, { useState, useEffect } from "react";
import daynight from "./static/videos/daynight.webm";

import Time from "./components/Time";
import News from "./components/News";
import Agenda from "./components/Agenda";
import ToDo from "./components/ToDo";
import Quotes from "./components/Quotes";
import Weather from "./components/Weather";
import Emails from "./components/Emails";
import AccountMenu from "./components/AccountMenu";
import AccountContext from "./components/AccountContext";

function App() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    function initGoogleClient() {
      window.gapi.client
        .init({
          apiKey: process.env.REACT_APP_GCAL_API_KEY,
          clientId: process.env.REACT_APP_GCAL_CLIENT_ID,
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
              setSignedIn(isSignedIn);
            });

          // Handle the initial sign-in state.
          setSignedIn(window.gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    // Request auth2 library after component mounts.
    window.gapi.load("client:auth2", initGoogleClient);
  }, []);

  return (
    <div className="app">
      <video id="background-video" autoPlay loop muted>
        <source src={daynight} type="video/webm" />
      </video>

      <AccountContext.Provider value={{ signedIn }}>
        <div className="navbar">
          <AccountMenu />
        </div>
        <div className="main">
          {/* Split main screen into three columns. */}
          <div className="box main-col main-left">
            <Time />
            <News />
          </div>
          <div className="box main-col main-center">
            <Agenda />
            <ToDo />
          </div>
          <div className="box main-col main-right">
            <Weather />
            <Emails />
          </div>
        </div>
        <div className="box bottom">
          <Quotes />
        </div>
      </AccountContext.Provider>
    </div>
  );
}

export default App;
