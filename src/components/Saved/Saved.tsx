import { useState, useEffect } from "react";
import "./Saved.scss";
import { supabase } from "../../services/supabaseClient";
import Spinner from "../../pages/Home/Feed/FeedComponents/Spinner/Spinner";

interface Post {
  id: number;
  text: string;
  created_at: string;
  mediaurls: string[] | null;
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Помилка отримання користувача:", error);
        return;
      }
      setUserId(data.user?.id || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("saved_posts")
          .select("post_id")
          .eq("user_id", userId);

        if (error) throw error;

        const postIds = data.map((item) => item.post_id).filter(Boolean);
        if (postIds.length === 0) {
          setSavedPosts([]);
          return;
        }

        const { data: posts, error: postsError } = await supabase
          .from("posts")
          .select("id, text, created_at, mediaurls")
          .in("id", postIds);

        if (postsError) throw postsError;
        setSavedPosts(posts || []);
      } catch (error) {
        console.error("Помилка отримання збережених постів:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [userId]);

  const removeSavedPost = async (postId: number) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", userId)
        .eq("post_id", postId);

      if (error) throw error;
      setSavedPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
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
                  {post.mediaurls && post.mediaurls.length > 0 && (
                    <img src={post.mediaurls[0]} alt="Медіа" />
                  )}
                  <button onClick={() => removeSavedPost(post.id)} className="remove__btn">
                    ❌
                  </button>
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
