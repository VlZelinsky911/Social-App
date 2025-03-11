import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { supabase } from "../../../../../../services/supabaseClient";
import "./SavePostButton.scss";

interface SavePostButtonProps {
  postId?: string;
  newsId?: string;
  userId?: string;
}

const SavePostButton: React.FC<SavePostButtonProps> = ({ postId, newsId, userId }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      console.error("Помилка: userId відсутній!");
      return;
    }
    if (!postId && !newsId) {
      console.error("Помилка: немає postId або newsId!");
      return;
    }

    const checkSavedStatus = async () => {
      setLoading(true);
      try {
        let query = supabase.from("saved_posts").select("id").eq("user_id", userId);

        if (postId) {
          query = query.eq("post_id", postId);
        } 
				else if (newsId) {
          query = query.eq("news_id", newsId);
        }

        const { data, error } = await query;
        if (error) throw error;
        setIsSaved(data.length > 0);
      } catch (error) {
        console.error("Помилка перевірки збереження:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [postId, newsId, userId]);

  const toggleSavePost = async () => {
    if (!userId) {
      console.error("Помилка: userId відсутній!");
      return;
    }
    if (!postId && !newsId) {
      console.error("Помилка: немає postId або newsId!");
      return;
    }

    setLoading(true);

    try {
      if (isSaved) {
        let query = supabase.from("saved_posts").delete().eq("user_id", userId);

        if (postId) {
          query = query.eq("post_id", postId);
        } 
				else if (newsId) {
          query = query.eq("news_id", newsId);
        }

        const { error } = await query;
        if (error) throw error;
        setIsSaved(false);
      } else {
        const { error } = await supabase.from("saved_posts").insert([
          {
            user_id: userId,
            post_id: postId || null,
            news_id: newsId || null,
          },
        ]);

        if (error) throw error;
        setIsSaved(true);
      }
    } catch (error) {
      console.error("Помилка збереження/видалення поста:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`post-save ${isSaved ? "active" : ""}`}
      onClick={toggleSavePost}
    >
      <FaBookmark className="bookmark-icon" />
    </div>
  );
};

export default SavePostButton;
