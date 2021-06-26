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
        `sources=bbc-news,cnn,nbc-news,recode,reuters,techcrunch,the-verge,the-wall-street-journal,the-washington-post&` +
        `pageSize=100`;
      const response = await fetch(reqUrl);
      const news = await response.json();
      setNews(news);
      setLoading(false);
    }

    fetchNews();
    const interval = setInterval(fetchNews, fetchPeriod);
    return () => clearInterval(interval);
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    // Choose 8 unique random numbers to always show different news articles
    var randomNumbers = [];
    while (randomNumbers.length < numResults) {
      var r = Math.floor(Math.random() * (news.articles.length - 1));
      if (randomNumbers.indexOf(r) === -1) randomNumbers.push(r);
    }

    return (
      <div className="news">
        <h1 className="news-title">Today's Headlines</h1>
        <ul className="news-list">
          {randomNumbers.map((randomNumber, idx) => (
            <li className="news-headline" key={idx}>
              <span className="news-source">{`${news.articles[randomNumber].source.name} – `}</span>
              <span className="news-title">
                {news.articles[randomNumber].title}
              </span>
              <p className="news-description">
                {news.articles[randomNumber].description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
