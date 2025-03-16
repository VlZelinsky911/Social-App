import { useState, useEffect } from "react";
import { FaBookmark } from "react-icons/fa";
import { supabase } from "../../../../../../services/supabaseClient";
import "./SavePostButton.scss";

interface SavePostButtonProps {
  postId?: number;
  userId: string;
}

const SavePostButton: React.FC<SavePostButtonProps> = ({ postId, userId }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!userId || !postId) return;

    const checkSavedStatus = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("saved_posts")
          .select("id")
          .eq("user_id", userId)
          .eq("post_id", postId);

        if (error) throw error;
        setIsSaved(data.length > 0);
      } catch (error) {
        console.error("Помилка перевірки збереження:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSavedStatus();
  }, [postId, userId]);

  const toggleSavePost = async () => {
    if (!userId || !postId) return;

    setLoading(true);
    try {
      if (isSaved) {
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", userId)
          .eq("post_id", postId);

        if (error) throw error;
        setIsSaved(false);
      } else {
        const { error } = await supabase
          .from("saved_posts")
          .insert([{ user_id: userId, post_id: postId }]);

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
