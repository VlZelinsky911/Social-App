import { useState, useEffect } from "react";
import { FaHeart, FaThumbsUp } from "react-icons/fa";
import { supabase } from "../../../../../../services/supabaseClient";
import "./LikeButton.scss";

interface LikeButtonProps {
  contentId: number | string;
  type: "post" | "news";
  userId: string;
}

interface Like {
  profiles?: { full_name?: string };
}


const LikeButton = ({ contentId, type, userId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [likedUsers, setLikedUsers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("user_id, profiles(full_name)")
        .eq("content_id", contentId)
        .eq("type", type);

      if (!error) {
        setLikesCount(data.length);
        setLiked(data.some((like) => like.user_id === userId));
      } else {
        console.error("Помилка отримання лайків:", error);
      }
    };

    fetchLikes();
  }, [contentId, type, userId]);

  const toggleLike = async () => {
    if (liked) {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("content_id", contentId)
        .eq("type", type)
        .eq("user_id", userId);

      if (!error) {
        setLiked(false);
        setLikesCount((prev) => Math.max(prev - 1, 0));
      } else {
        console.error("Помилка видалення лайка:", error);
      }
    } else {
      const { error } = await supabase
        .from("likes")
        .insert([{ content_id: contentId, type, user_id: userId }]);

      if (!error) {
        setLiked(true);
        setLikesCount((prev) => prev + 1);
      } else {
        console.error("Помилка додавання лайка:", error);
      }
    }
  };

  const fetchLikedUsers = async () => {
    const { data, error } = await supabase
      .from("likes")
      .select("profiles(full_name)")
      .eq("content_id", contentId)
      .eq("type", type);

    if (error) {
      console.error("Помилка отримання лайкнувших:", error);
      return;
    }

		
		setLikedUsers((data as Like[]).map((like) => like.profiles?.full_name || "Анонім"));
		setIsModalOpen(true);
  };

  return (
    <div className="interaction-buttons">
      <button onClick={toggleLike} className={liked ? "liked" : ""}>
        {liked ? <FaHeart className="icon" /> : <FaThumbsUp className="icon" />}
      </button>
      <span className="count" onClick={fetchLikedUsers}>
        {likesCount}
      </span>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Уподобання</h3>
            <ul>
							{likedUsers.length > 0 ? (
              likedUsers.map((username, index) => (
                <li key={index}>
									<img className="avatar-img" src="/Mark.jpg"/>
									<li>{username}</li>
								</li>
              ))
						): (
							<h4>Немає уподобань</h4>
						)}
            </ul>
            <button onClick={() => setIsModalOpen(false)}>❌</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LikeButton;