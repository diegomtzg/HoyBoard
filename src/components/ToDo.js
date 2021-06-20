import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

// Every 30 seconds
const fetchPeriod = 1000 * 30;

export default function ToDo() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrelloCards() {
      console.log("Fetching Trello cards...");

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
    return (
      <ul className="cards-list">
        {cards.map((card, idx) => (
          <div className="todo-card">
            <li key={idx}>{card.name}</li>
          </div>
        ))}
      </ul>
    );
  }

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="ToDo">
        <h1 className="todo-title">To Do List</h1>
        {renderCards()}
      </div>
    );
  }
}
