import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

// Every 5 minutes
const fetchPeriod = 1000 * 60 * 5;

export default function Quotes() {
  const [quote, setQuote] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      console.log("Fetching quote...");
      var reqUrl =
        "https://api.quotable.io/random?tags=inspirational|wisdom|famous-quotes&maxLength=80";
      const response = await fetch(reqUrl);
      const quote = await response.json();
      setQuote(quote);
      setLoading(false);
    }

    fetchQuote();
    const interval = setInterval(fetchQuote, fetchPeriod);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="quotes">
        <p>"{quote.content}"</p>
        <p>– {quote.author}</p>
      </div>
    );
  }
}
