import React, { useEffect, useState, useRef, useCallback, use } from "react";
import "./Feed.scss";
import { NewsArticle } from "./FeedInterface/interfaces";
import { NewsCategories } from "./FeedComponents/NewsCategories/NewsCategories";
import PostTitle from "./FeedComponents/PostTitle/PostTitle";
import Spinner from "./FeedComponents/Spinner/Spinner";
import PostCreator from "./FeedComponents/PostCreator/PostCreator";
import { supabase } from "../../../services/supabaseClient";
import LikeButton from "./FeedComponents/InteractionButtons/LikeButton/LikeButton";
import CommentButton from "./FeedComponents/InteractionButtons/CommentButton/CommentButtton";
import ShareButton from "./FeedComponents/InteractionButtons/SendButton/ShareButton";
import SuggestedUsers from "../../../components/SuggestedUsers/SuggestedUsers";
import { FaBookmark } from "react-icons/fa";
import SavePostButton from "./FeedComponents/InteractionButtons/SavePostButton/SavePostButton";

interface Post {
  id: number;
  text: string;
  mediaurls?: string[];
  created_at: string;
  username: string;
}

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("Стрічка");
  const [user, setUser] = useState<any>(null);
  const pageRef = useRef<number>(1);
  const canLoadMore = useRef<boolean>(true);
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
				id,
				text,
				mediaurls,
				created_at,
				user_profiles(username)
			`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Помилка завантаження постів:", error);
    } else {
      const formattedData = data.map((post: any) => ({
        ...post,
        username: post.user_profiles.username,
      }));

      setPosts(formattedData || []);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const fetchNews = useCallback(async () => {
    if (loading || !canLoadMore.current) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=gaming&language=en&pageSize=5&page=${
          pageRef.current
        }&apiKey=${import.meta.env.VITE_API_KEY}`
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

  const handlePostCreated = useCallback(() => {
    setIsPostSubmitting(true);
    fetchPosts().finally(() => {
      setIsPostSubmitting(false);
    });
  }, []);

  return (
		<div className="home-container">
			<div className="suggested-users">
				<SuggestedUsers/>
			</div>
    <div className="feed-container">
      <div className="feed-content">
        <div className="feed-news-feed">
          <NewsCategories
            setFilter={setFilter}
            setActiveCategory={setActiveCategory}
            activeCategory={activeCategory}
          />
          {activeCategory === "Стрічка" && (
            <PostCreator userId={user?.id} onPostCreated={handlePostCreated} />
          )}

          <div className="feed-posts-container">
            {isPostSubmitting && <Spinner />}
            {posts.map((post) => (
              <div key={post.id} className="feed-post-item">
                <div className="home-news-details">
                  <PostTitle
                    author={post.username}
                    publishedAt={post.created_at}
                  />
                  <div className="home-article-border">
                    <p>{post.text}</p>
                  </div>
                  {post.mediaurls && post.mediaurls.length > 0 && (
                    <img src={post.mediaurls[0]} alt="Медіа" />
                  )}
                  <div className="home-news-actions">
                    <div className="home-likes-comments">
                      {user && (
                        <LikeButton
                          contentId={post.id}
                          type="post"
                          userId={user.id}
                        />
                      )}
                      {user && (
                        <CommentButton contentId={post.id} userId={user.id} />
                      )}
                      <ShareButton />
                    </div>
										{user &&<SavePostButton postId={String(post.id)} userId={user.id} />}
                  </div>
                </div>
              </div>
            ))}

            {news.map((article, index) => (
              <div key={index} className="feed-post-item">
                <div className="home-news-details">
                  <PostTitle
                    author={article.author}
                    publishedAt={article.publishedAt}
                  />
                  <div className="home-article-border">
                    <p>{article.description}</p>
                  </div>
                  {article.urlToImage && (
                    <img src={article.urlToImage} alt={article.title} />
                  )}
                  <div className="home-news-actions">
                    <div className="home-likes-comments">
                      {user && (
                        <LikeButton
                          contentId={article.title}
                          type="news"
                          userId={user.id}
                        />
                      )}
                      {user && (
                        <CommentButton
                          contentId={article.title}
                          userId={user.id}
                        />
                      )}
                      <ShareButton />
                    </div>
										{user && <SavePostButton newsId={article.title} userId={user.id} />}
                  </div>
                </div>
              </div>
            ))}

            {loading && <Spinner />}
          </div>
        </div>
      </div>
    </div>
	</div>
  );
};

export default Home;