import React, { useState, useEffect } from "react";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function ToDo() {
  const [lists, setLists] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTrelloCards() {
      console.log("Fetching Trello cards...");

      // Get all lists in board.
      var listsReqUrl =
        "https://api.trello.com/1/boards/" +
        `${process.env.REACT_APP_TRELLO_BOARD_ID}/lists?` +
        `key=${process.env.REACT_APP_TRELLO_API_KEY}&` +
        `token=${process.env.REACT_APP_TRELLO_TOKEN}`;
      const listsResponse = await fetch(listsReqUrl);
      setLists(await listsResponse.json());

      // Get all cards and add each to their list entry.
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

  function transformLists() {
    const listMap = {};

    // Map list id to name and list of cards
    lists.forEach((list) => {
      listMap[list.id] = {
        name: list.name,
        cards: [],
      };
    });

    // Add cards to list object
    cards.forEach((card) => {
      listMap[card.idList].cards.push(card.name);
    });

    return listMap;
  }

  function renderLists() {
    const listMap = transformLists();

    return (
      <div className="todo-lists">
        {Object.entries(listMap).map(([id, list]) => (
          <div>
            <h3>{list.name}</h3>
            {list.cards.map((card) => (
              <p>{card}</p>
            ))}
          </div>
        ))}
      </div>
    );
  }

  function renderToDo() {
    if (loading) {
      return <p>Loading ToDo...</p>;
    } else {
      return <div className="ToDo">{renderLists()}</div>;
    }
  }

  return renderToDo();
}
