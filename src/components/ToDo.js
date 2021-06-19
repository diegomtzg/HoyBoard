import React, { useState, useEffect } from "react";

// Every 10 minutes
const fetchPeriod = 1000 * 60 * 10;

export default function ToDo() {
  const [lists, setLists] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function transformLists(lists) {
      let listMap = {};
      lists.forEach((list) => {
        listMap[list.id] = { name: list.name, cards: [] };
      });
      return listMap;
    }
    async function fetchTrelloCards() {
      console.log("Fetching Trello cards...");

      // Get all lists in board.
      var listsReqUrl =
        "https://api.trello.com/1/boards/" +
        `${process.env.REACT_APP_TRELLO_BOARD_ID}/lists?` +
        `key=${process.env.REACT_APP_TRELLO_API_KEY}&` +
        `token=${process.env.REACT_APP_TRELLO_TOKEN}`;
      const response = await fetch(listsReqUrl);
      const lists = await response.json();

      // Convert array of lists objects to map of list IDs to list info.
      const listMap = transformLists(lists);

      // Get all cards and add each to their list entry.
      var cardsReqUrl =
        "https://api.trello.com/1/boards/" +
        `${process.env.REACT_APP_TRELLO_BOARD_ID}/cards?` +
        `key=${process.env.REACT_APP_TRELLO_API_KEY}&` +
        `token=${process.env.REACT_APP_TRELLO_TOKEN}`;
      fetch(cardsReqUrl).then((response) => {
        response.json().then((cards) => {
          cards.forEach((card) => {
            listMap[card.idList].cards.push(card.name);
          });
        });
      });

      setLists(listMap);
      setLoading(false);
    }

    fetchTrelloCards();
    // const interval = setInterval(fetchTrelloCards, fetchPeriod);
    // return () => clearInterval(interval);
  }, []);

  function renderLists() {
    return (
      <div className="todo-lists">
        <p>{Object.entries(lists).length}</p>
        {Object.entries(lists).map(([, list]) => (
          <div className="todo-list">
            <h3>{list.name}</h3>
            {console.log(list.cards.length)}
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
