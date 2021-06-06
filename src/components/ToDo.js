import React, { useState, useEffect } from "react";

// Every 10 minutes
const fetchPeriod = 1000 * 60 * 10;

export default function ToDo() {
  const [lists, setLists] = useState({ id: "", name: "", cards: [] });

  useEffect(() => {
    function transformLists(lists) {
      let listMap = {};
      lists.forEach((list) => {
        listMap[list.id] = list.name;
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

      // Convert array of lists to map of list id to list name.
      const listNames = transformLists(lists);
      console.log("Lists", listNames);

      // Get all cards and add each to their list entry.
      var cardsReqUrl =
        "https://api.trello.com/1/boards/" +
        `${process.env.REACT_APP_TRELLO_BOARD_ID}/cards?` +
        `key=${process.env.REACT_APP_TRELLO_API_KEY}&` +
        `token=${process.env.REACT_APP_TRELLO_TOKEN}`;
      fetch(cardsReqUrl).then((response) => {
        response.json().then((cards) => {
          cards.forEach((card) => {
            console.log(listNames[card.idList], card.name);
          });
        });
      });
    }

    fetchTrelloCards();
    // const interval = setInterval(fetchTrelloCards, fetchPeriod);
    // return () => clearInterval(interval);
  }, []);

  return (
    <div className="ToDo">
      <h1>ToDo</h1>
    </div>
  );
}
