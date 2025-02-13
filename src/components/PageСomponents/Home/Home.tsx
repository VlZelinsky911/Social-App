import React, { useEffect, useState } from "react";
import "./Home.scss";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

const API_KEY = "536e3b5fec13489596cefc255daf52be";

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(
      `https://newsapi.org/v2/everything?q=gaming&language=en&apiKey=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setNews(data.articles);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Помилка завантаження постів:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      <div className="container">
        <h1 className="home-title">Ласкаво просимо в GameNet!</h1>
        <p className="home-subtitle">
          Останні новини, тренди та рекомендації для вас.
        </p>

        <div className="content">
          {" "}
          <button className="news-feed">
            {" "}
            <h2>Нові</h2>{" "}
          </button>{" "}
          <button className="trending">
            {" "}
            <h2>Популярні</h2>{" "}
          </button>{" "}
          <button className="recommendations">
            {" "}
            <h2>Рекомендовані</h2>{" "}
          </button>{" "}
        </div>

        <div className="content">
          <div className="news-feed">
            <h2>Стрічка новин</h2>
            {loading ? (
              <p>Завантаження...</p>
            ) : (
              news.map((article, index) => (
                <div key={index} className="news-item">
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} />
                  )}
                  <h3>{article.title}</h3>
                  <p>{article.description}</p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Детальніше
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
