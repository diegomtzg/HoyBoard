import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "../static/css/news.css";

// Once every 5 minutes.
const fetchPeriod = 1000 * 60 * 5;
const numResults = 4;
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      console.log("Fetching news...");
      var reqUrl =
        "https://newsapi.org/v2/top-headlines?" +
        `apiKey=${NEWS_API_KEY}&` +
        `sources=bbc-news,cnn,google-news,nbc-news,newsweek,politico,recode,reuters,techcrunch,the-verge,the-wall-street-journal,the-washington-post&` +
        `pageSize=60`;
      const response = await fetch(reqUrl);
      const news = await response.json();
      setNews(news.articles);
      setLoading(false);
    }

    fetchNews();
    const interval = setInterval(fetchNews, fetchPeriod);
    return () => clearInterval(interval);
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

  // Choose 8 unique random numbers to always show different news articles
  var randomNumbers = [];
  while (randomNumbers.length < numResults) {
    var r = Math.floor(Math.random() * 60);
    if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
  }

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="news">
        <h1 className="news-title">Today's Headlines</h1>
        <ul className="news-list">
          <div className="news-headline">
            <li key={0}>
              <span className="news-source">{`• ${
                news[randomNumbers[0]].source.name
              } – `}</span>
              <span className="news-title">{news[randomNumbers[0]].title}</span>
              <p className="news-description">
                {news[randomNumbers[0]].description}
              </p>
            </li>
          </div>
          {randomNumbers.slice(1).map((randomNumber, idx) => (
            <div className="news-headline top-border">
              <li key={idx}>
                <span className="news-source">{`• ${news[randomNumber].source.name} – `}</span>
                <span className="news-title">{news[randomNumber].title}</span>
                <p className="news-description">
                  {news[randomNumber].description}
                </p>
              </li>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}
