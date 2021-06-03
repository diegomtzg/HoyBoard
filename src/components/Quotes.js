import React, { useState, useEffect } from "react";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function Quotes() {
  const [quote, setQuote] = useState({ author: "Author", content: "Quote" });

  useEffect(() => {
    async function fetchQuote() {
      console.log("Fetching quote...");
      var reqUrl =
        "https://api.quotable.io/random?tags=inspirational|wisdom|famous-quotes&maxLength=80";
      const response = await fetch(reqUrl);
      const quote = await response.json();
      setQuote(quote);
    }

    fetchQuote();
    const interval = setInterval(fetchQuote, fetchPeriod);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quotes">
      <p>"{quote.content}"</p>
      <p>– {quote.author}</p>
    </div>
  );
}
