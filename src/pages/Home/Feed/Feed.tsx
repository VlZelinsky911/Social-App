import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Feed.scss";
import { NewsArticle } from "./FeedInterface/interfaces";
import { FaComment, FaHeart, FaThumbsUp } from "react-icons/fa";
import { NewsCategories } from "./FeedComponents/NewsCategories/NewsCategories";
import PostTitle from "./FeedComponents/PostTitle/PostTitle";
import Spinner from "./FeedComponents/Spinner/Spinner";
import PostCreator from "./FeedComponents/PostCreator/PostCreator";
import LikeButton from "./FeedComponents/LikeButton/LikeButton";

const API_KEY = "58bc583456894a919ca976c5a6f6cb7a";

const Home: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("Стрічка");
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
        const articlesWithStats = data.articles.map((article: NewsArticle) => ({
          ...article,
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 50),
        }));
        setNews((prev) => [...prev, ...articlesWithStats]);
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

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 10 &&
        !loading
      ) {
        fetchNews();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNews, loading]);

  let filteredNews = news.slice();

  if (filter === "new") {
    filteredNews.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } else if (filter === "popular") {
    filteredNews = filteredNews.filter((article) => article.likes >= 50);
  } else if (filter === "recommended") {
    filteredNews = filteredNews.filter((article) => article.comments >= 20);
  }

  return (
    <div className="home">
      <div className="container">
        <div className="content">
          <div className="news-feed">
            <NewsCategories
              setFilter={setFilter}
              setActiveCategory={setActiveCategory}
              activeCategory={activeCategory}
            />
            {activeCategory === "Стрічка" && <PostCreator />}
            {filteredNews.map((article, index) => (
              <div key={index} className="news-item">
                {article.urlToImage && (
                  <img src={article.urlToImage} alt={article.title} />
                )}
                <div className="news-details">
                  <PostTitle
                    author={article.author}
                    publishedAt={article.publishedAt}
                  />
                  <div className="article__border">
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                  </div>
                  <div className="news-actions">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="detail-link"
                    >
                      Детальніше
                    </a>
                    <div className="likes-comments">
                      <LikeButton/>
                      <button>
                        <FaComment /> {article.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {loading && <Spinner />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
