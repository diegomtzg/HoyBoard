import React, { useState, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import TrelloSignInButton from "./Buttons/TrelloSigninButton";
import "../static/css/todo.css";
import { Trello } from "react-trello-client";

const fetchPeriod = 1000 * 10;

// https://trello.com/app-key
export default function ToDo() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trelloSignedIn, setTrelloSignedIn] = useState(false);

  useEffect(() => {
    async function fetchTrelloCards() {
      let token = window.localStorage.getItem("trello_token");
      if (token) {
        setTrelloSignedIn(true);
        if (window.Trello) {
          window.Trello.setToken(token);
        }
      }

      if (!trelloSignedIn) {
        return;
      }

      // Use first board whose name contains "To Do" (case sensitive)
      window.Trello.get(
        "members/me/boards",
        (boards) => {
          if (boards.length > 0) {
            let todoBoard = boards.find((board) =>
              board.name.includes("To Do")
            );
            if (!todoBoard) {
              setCards([]);
              setLoading(false);
              return;
            }

            // Get cards from the To Do board
            window.Trello.get(
              `boards/${todoBoard.id}/cards`,
              (cards) => {
                setCards(cards);
                setLoading(false);
              },
              (error) => console.log(error)
            );
          }
        },
        (error) => console.log(error)
      );
    }

    fetchTrelloCards();
    const interval = setInterval(fetchTrelloCards, fetchPeriod);
    return () => clearInterval(interval);
  }, [trelloSignedIn]);

  function renderCards() {
    if (cards.length > 0) {
      return (
        <ul className="todo-list">
          {cards.map((card, idx) => (
            <li className="todo-card" key={idx}>
              {<FontAwesomeIcon icon={faCheckSquare} color={"white"} />}
              <span className="card-name"> {card.name}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      return <p className="todo-empty">Nothing left to do!</p>;
    }
  }

  if (trelloSignedIn) {
    if (loading) {
      return (
        <div className="todo">
          <h1 className="todo-title">To Do List</h1>
          <div className="todo-loader">
            <CircleLoader size={100} color={"#F50057"} loading={loading} />
          </div>
        </div>
      );
    } else {
      return (
        <div className="todo">
          <h1 className="todo-title">
            To Do List
            <FontAwesomeIcon
              className="trello-signout-icon"
              icon={faSignOutAlt}
              onClick={() => {
                window.localStorage.removeItem("trello_token");
                Trello.deauthorize();
                setTrelloSignedIn(false);
              }}
            />
          </h1>
          {renderCards()}
        </div>
      );
    }
  } else {
    return (
      <div className="todo">
        <h1 className="todo-title">To Do List</h1>
        <TrelloSignInButton setSignedInFunction={setTrelloSignedIn} />
        <p className="todo-disclaimer">
          HoyBoard pulls the To Do list from a Trello Board in your account with
          "To Do" in the title (case sensitive).
        </p>
      </div>
    );
  }
}
