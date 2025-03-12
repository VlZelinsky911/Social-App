import { useState, useEffect } from "react";
import "./Saved.scss";
import { supabase } from "../../services/supabaseClient";
import Spinner from "../../pages/Home/Feed/FeedComponents/Spinner/Spinner";

interface SavedPost {
  id: string;
  post_id: string | null;
  news_id: string | null;
}

interface Post {
  id: string;
  text: string;
  created_at: string;
  mediaurls: string[];
}

interface News {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
}

function Saved() {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedNews, setSavedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("saved_posts")
          .select("post_id")
          .eq("user_id", user.id);

        if (error) throw error;

        if (data.length > 0) {
          const postIds = data.map((item) => item.post_id).filter(Boolean);
          const { data: posts, error: postsError } = await supabase
            .from("posts")
            .select("id, text, created_at, mediaurls")
            .in("id", postIds);

          if (postsError) throw postsError;
          setSavedPosts(posts || []);
        }
      } catch (error) {
        console.error("Помилка отримання збережених постів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [user]);

  const removeSavedPost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);

      if (error) throw error;
      setSavedPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== postId)
      );
    } catch (error) {
      console.error("Помилка видалення поста:", error);
    }
  };

  return (
    <div className="saved">
      <h1>Збережені пости та новини</h1>

      {loading ? (
        <Spinner />
      ) : (
        <>
          <h2>📌 Збережені пости:</h2>
          {savedPosts.length === 0 ? (
            <p>Немає збережених постів.</p>
          ) : (
            <ul>
              {savedPosts.map((post) => (
                <li key={post.id}>
                  <p>
                    <strong>Текст:</strong> {post.text}
                  </p>
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                  {post.mediaurls.length > 0 && (
                    <img src={post.mediaurls[0]} alt="Медіа"/>
                  )}
                  <button onClick={() => removeSavedPost(post.id)} className="remove__btn">❌</button>
                </li>
              ))}
            </ul>
          )}

          <h2>📰 Збережені новини:</h2>
          {savedNews.length === 0 ? (
            <p>Перевищення ліміту.🥲</p>
          ) : (
            <ul>
              {savedNews.map((news, index) => (
                <li key={index}>
                  <a href={news.url} target="_blank" rel="noopener noreferrer">
                    <h3>{news.title}</h3>
                  </a>
                  <p>{news.description}</p>
                  {news.urlToImage && (
                    <img src={news.urlToImage} alt="Новина" width="100" />
                  )}
                  <p>
                    <strong>Дата:</strong>{" "}
                    {new Date(news.publishedAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default Saved;
