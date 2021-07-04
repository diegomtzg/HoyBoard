import React, { useState, useEffect } from "react";
import quotes from "../static/quotes.json";
import "../static/css/quotes.css";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function Quotes() {
  const [quote, setQuote] = useState({});

  useEffect(() => {
    async function fetchQuote() {
      // Pick a random quote from local file
      var num = Math.floor(Math.random() * (quotes.length - 1));
      setQuote(quotes[num]);
    }

    fetchQuote();
    const interval = setInterval(fetchQuote, fetchPeriod);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="quotes">
      <span className="quote">"{quote.quote}"</span>
      <span className="author"> – {quote.author}</span>
    </div>
  );
}
