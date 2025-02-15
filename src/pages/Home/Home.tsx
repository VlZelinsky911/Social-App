import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Home.scss";
import { NewsCategories } from "./HomeComponents/NewsCategories/NewsCategories";
import { NewsArticle } from "../../app/interfaces/interfaces";
import { FaThumbsUp } from "react-icons/fa";
import { FaComment } from "react-icons/fa6";
import WelcomeMessage from "./HomeComponents/WelcomeMessage/WelcomeMessage";

const API_KEY = "58bc583456894a919ca976c5a6f6cb7a";

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const pageRef = useRef<number>(1);
  const canLoadMore = useRef<boolean>(true);

  const fetchNews = useCallback(async () => {
    if (loading || !canLoadMore.current) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=gaming&language=en&pageSize=5&page=${pageRef.current}&apiKey=${API_KEY}`
      );
      const data = await response.json();
      if (data.articles?.length) {
        setNews((prev) => [...prev, ...data.articles]);
        pageRef.current += 1;
      } else {
        canLoadMore.current = false;
      }
    } catch (error) {
      console.error("Помилка завантаження постів:", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => { fetchNews(); }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10 && !loading) {
        fetchNews();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNews, loading]);

	return (
    <div className="home">
      <div className="container">
        <WelcomeMessage/>
        <NewsCategories />
        <div className="content">
          <div className="news-feed">
            <h2>Нові</h2>
            {news.map((article) => (
              <div key={article.url} className="news-item">
                {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
                <div className="news-details">
                  <span className="author-name">@{article.author ?? "Невідомий"}</span>
                  <div className="article__border">
									<h3>{article.title}</h3>
                  <p>{article.description}</p>
									</div>
                  <div className="news-actions">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="detail-link">Детальніше</a>
                    <div className="likes-comments">
                      <button><FaThumbsUp /> {article.likes ?? 0}</button>
                      <button><FaComment /> {article.comments ?? 0}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && <p>Завантаження...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};


export default Home;
