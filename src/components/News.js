import React, { useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import "../static/css/news.css";

// Once per hour
const fetchPeriod = 1000 * 60 * 60;
const numResults = 8;
const NEWS_API_KEY = process.env.REACT_APP_NEWS_API_KEY;

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
        `category=general&` +
        `pageSize=${numResults}`;
      const response = await fetch(reqUrl);
      const news = await response.json();
      const cleanedNews = news.articles.map((article) => {
        let [, title, source] = /(.*) - (.+)/.exec(article.title);
        return { title: title, source: source };
      });
      console.log(cleanedNews);
      setNews(cleanedNews);
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
        <h1 className="news-title">Today's Headlines</h1>
        <ul className="news-list">
          <div className="news-headline">
            <li key={0}>
              <span className="news-source">{`${news[0].source} – `}</span>
              {news[0].title}
            </li>
          </div>
          {news.slice(1).map((article, idx) => (
            <div className="news-headline top-border">
              <li key={idx}>
                <span className="news-source">{`${article.source} – `}</span>
                {article.title}
              </li>
            </div>
          ))}
        </ul>
      </div>
    );
  }
}
