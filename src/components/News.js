import React, { useState, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import "../static/css/news.css";

// Once every 5 minutes.
const fetchPeriod = 1000 * 60 * 5;
const numResults = 4;

//https://developer.nytimes.com/
export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      console.log("Fetching news...");
      const reqUrl =
        `https://api.nytimes.com/svc/topstories/v2/home.json?` +
        `api-key=${process.env.REACT_APP_NYT_API_KEY}`;
      const response = await fetch(reqUrl);
      const news = await response.json();
      console.log(news.results);
      setNews(news.results);
      setLoading(false);
    }

    fetchNews();
    const interval = setInterval(fetchNews, fetchPeriod);
    return () => clearInterval(interval);
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

  if (loading) {
    return (
      <div className="news loader">
        <CircleLoader size={100} color={"#F50057"} loading={loading} />
      </div>
    );
  } else {
    // Choose 8 unique random numbers to always show different news articles
    var randomNumbers = [];
    while (randomNumbers.length < numResults) {
      var r = Math.floor(Math.random() * (news.length - 1));
      if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
    }

    return (
      <div className="news">
        <h1 className="news-title">Today's Headlines</h1>
        <ul className="news-list">
          {randomNumbers.map((randomNumber, idx) => (
            <li className="news-headline" key={idx}>
              <span className="news-source">{news[randomNumber].title}</span>
              <p className="news-description">{news[randomNumber].abstract}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
