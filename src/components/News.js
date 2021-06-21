import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "../static/css/news.css";

// Once every 30 mins
const fetchNewsPeriod = 1000 * 60 * 30;
const shownResults = 4;
const NEWS_API_KEY = process.env.REACT_APP_NYT_API_KEY;

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      console.log("Fetching news...");
      const reqUrl =
        `https://api.nytimes.com/svc/topstories/v2/technology.json?` +
        `api-key=${NEWS_API_KEY}`;
      const response = await fetch(reqUrl);
      const news = await response.json();
      console.log(news.results);
      setNews(news.results);
      setLoading(false);
    }

    fetchNews();
    const fetchNewsInterval = setInterval(fetchNews, fetchNewsPeriod);
    return () => {
      clearInterval(fetchNewsInterval);
    };
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

  // TODO: Rotate between all available headlines (not just the first few)
  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="news">
        <h1 className="news-title">Today's Headlines</h1>
        <ul className="news-list">
          {news.slice(0, shownResults).map((article, idx) => (
            <li key={idx}>
              <span className="news-headline">{article.title}</span>
              <p className="news-abstract">{article.abstract}</p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
