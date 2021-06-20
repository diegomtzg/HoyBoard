import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";

// Once per hour
const fetchPeriod = 1000 * 60 * 60;
const numResults = 5;
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

const categories = [
  "general",
  "entertainment",
  "business",
  "health",
  "science",
  "sports",
  "technology",
];

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      console.log("Fetching news...");
      var reqUrl =
        "https://newsapi.org/v2/top-headlines?" +
        "country=us&" +
        `apiKey=${NEWS_API_KEY}&` +
        `category=${categories[0]}&` +
        `pageSize=${numResults}`;
      const response = await fetch(reqUrl);
      const news = await response.json();
      setNews(news.articles);
      setLoading(false);
    }

    fetchNews();
    const interval = setInterval(fetchNews, fetchPeriod);
    return () => clearInterval(interval);
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

  if (loading) {
    return <PulseLoader color={"#8f8f8f"} loading={loading} />;
  } else {
    return (
      <div className="news">
        <p>Today's Headlines</p>
        <ul>
          {news.map((article, idx) => (
            <li key={idx}>{article.title}</li>
          ))}
        </ul>
      </div>
    );
  }
}
