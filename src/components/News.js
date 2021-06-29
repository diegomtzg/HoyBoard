import React, { useState, useEffect } from "react";
import CircleLoader from "react-spinners/CircleLoader";
import "../static/css/news.css";

// Once every 5 minutes.
const fetchPeriod = 1000 * 60 * 5;
const numResults = 4;

// Local environment uses (since this api costs like $300 a month outside of localhost):
// "https://newsapi.org/v2/top-headlines?" +
// `apiKey=${process.env.REACT_APP_NEWS_API_KEY}&` +
// `sources=bbc-news,cnn,nbc-news,recode,reuters,techcrunch,the-verge,the-wall-street-journal,the-washington-post&pageSize=100`;

// Deployed environment uses:
// `https://api.nytimes.com/svc/topstories/v2/home.json?` +
// `api-key=${process.env.REACT_APP_NEWS_API_KEY}`;

//https://developer.nytimes.com/
// https://newsapi.org/
export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const response = await fetch(process.env.REACT_APP_NEWS_API_URL);
      const news = await response.json();

      if (news.articles) {
        // Local environment, news pulled from newsapi instead of NYT
        setNews(news.articles);
      } else {
        setNews(news.results);
      }

      setLoading(false);
    }

    fetchNews();
    const interval = setInterval(fetchNews, fetchPeriod);
    return () => clearInterval(interval);
  }, []); // Run only when component mounts, not when state changes (state set here, runs forever)

  if (loading) {
    return (
      <div className="news">
        <h1 className="news-title">Today's Headlines</h1>
        <div className="news-loader">
          <CircleLoader size={100} color={"#F50057"} loading={loading} />
        </div>
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
              {news[randomNumber].source ? (
                <div>
                  <span className="news-source">{`${news[randomNumber].source.name} – `}</span>
                  <span className="news-title">{news[randomNumber].title}</span>
                </div>
              ) : (
                <div>
                  <span className="news-source">
                    {news[randomNumber].title}
                  </span>
                </div>
              )}
              <p className="news-description">
                {news[randomNumber].abstract
                  ? news[randomNumber].abstract
                  : news[randomNumber].description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
