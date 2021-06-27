import React, { useState, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrello } from "@fortawesome/free-brands-svg-icons";
import TrelloSignInButton from "./Buttons/TrelloSigninButton";
import "../static/css/todo.css";

// Every 30 seconds
const fetchPeriod = 1000 * 30;

export default function ToDo() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrelloCards() {
      console.log("Fetching Trello cards...");

      let authResponse = await fetch(
        `https://trello.com/1/authorize?` +
          `scope=read&response_type=token&expiration=never&name=HoyBoard&` +
          `key=${process.env.REACT_APP_TRELLO_API_KEY}`
      );
      // let authJson = await authResponse.json();
      // console.log(authJson);

      var cardsReqUrl =
        "https://api.trello.com/1/boards/" +
        `${process.env.REACT_APP_TRELLO_BOARD_ID}/cards?` +
        `key=${process.env.REACT_APP_TRELLO_API_KEY}&` +
        `token=${process.env.REACT_APP_TRELLO_TOKEN}`;
      const cardsResponse = await fetch(cardsReqUrl);
      setCards(await cardsResponse.json());
      setLoading(false);
    }

    fetchTrelloCards();
    const interval = setInterval(fetchTrelloCards, fetchPeriod);
    return () => clearInterval(interval);
  }, []);

  function renderCards() {
    if (cards.length > 0) {
      return (
        <ul className="todo-list">
          {cards.map((card, idx) => (
            <li className="todo-card" key={idx}>
              {<FontAwesomeIcon icon={faCheckSquare} color={"white"} />}
              {` ${card.name}`}
            </li>
          ))}
        </ul>
      );
    } else {
      return <p className="todo-empty">Empty!</p>;
    }
  }

  // return <TrelloSignInButton />;
  if (loading) {
    return (
      <div className="loader">
        <CircleLoader size={100} color={"#F50057"} loading={loading} />
      </div>
    );
  } else {
    return (
      <div className="todo">
        <h1 className="todo-title">To Do List</h1>
        {renderCards()}
      </div>
    );
  }
}
