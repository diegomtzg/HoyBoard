import Time from "./components/Time";
import News from "./components/News";
import Agenda from "./components/Agenda";
import ToDo from "./components/ToDo";
import Quotes from "./components/Quotes";
import Weather from "./components/Weather";
import Emails from "./components/Emails";
import GoogleAuthButton from "./components/GoogleAuthButton";

function App() {
  return (
    <div className="app">
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
    </div>
  );
}

export default App;
