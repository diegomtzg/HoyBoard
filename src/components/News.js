import React, { useState, useEffect } from "react";

// Once per hour
const fetchPeriod = 1000 * 60 * 60;
const numResults = 2;

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

  useEffect(() => {
    async function fetchNews() {
      console.log("Fetching news...");
      const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;
      var reqUrl =
        "https://newsapi.org/v2/top-headlines?" +
        "country=us&" +
        `apiKey=${NEWS_API_KEY}&` +
        `category=${categories[0]}&` +
        `pageSize=${numResults}`;

      var req = new Request(reqUrl);
      const response = await fetch(req);
      const news = await response.json();
      setNews(news.articles);
    }

    fetchNews();
    const interval = setInterval(fetchNews, fetchPeriod);
    return () => clearInterval(interval);
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

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
