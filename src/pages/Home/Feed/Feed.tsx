import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Feed.scss";
import { NewsArticle } from "./FeedInterface/interfaces";
import { NewsCategories } from "./FeedComponents/NewsCategories/NewsCategories";
import PostTitle from "./FeedComponents/PostTitle/PostTitle";
import Spinner from "./FeedComponents/Spinner/Spinner";
import PostCreator from "./FeedComponents/PostCreator/PostCreator";
import { supabase } from "../../../services/supabaseClient";
import InteractionButtons from "./FeedComponents/InteractionButtons/InteractionButtons";

const API_KEY = "58bc583456894a919ca976c5a6f6cb7a";

interface Post {
  id: number;
  text: string;
  mediaurls?: string[]; // Для зображень/відео
  created_at: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("Стрічка");
  const pageRef = useRef<number>(1);
  const canLoadMore = useRef<boolean>(true);

  // 📌 Функція для завантаження постів із Supabase
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }); // Останні зверху

    if (error) {
      console.error("Помилка завантаження постів:", error);
    } else {
      setPosts(data || []);
    }
  };

  // Викликаємо завантаження постів при монтуванні
  useEffect(() => {
    fetchPosts();
  }, []);

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
      console.error("Помилка завантаження новин:", error);
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

            {posts.map((post) => (
              <div key={post.id} className="news-item">
                <div className="news-details">
                  <PostTitle
                    author="Користувач"
                    publishedAt={post.created_at}
                  />
                  <div className="article__border">
                    <p>{post.text}</p>
                  </div>
                  {post.mediaurls && post.mediaurls.length > 0 && (
                    <img src={post.mediaurls[0]} alt="Медіа" />
                  )}
                  <div className="news-actions">
                    <div className="likes-comments">
                      <InteractionButtons />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {news.map((article, index) => (
              <div key={index} className="news-item">
                <div className="news-details">
                  <PostTitle
                    author={article.author}
                    publishedAt={article.publishedAt}
                  />
                  <div className="article__border">
                    <p>{article.description}</p>
                  </div>
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} />
                  )}
                  <div className="news-actions">
                    <div className="likes-comments">
                      <InteractionButtons />
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
