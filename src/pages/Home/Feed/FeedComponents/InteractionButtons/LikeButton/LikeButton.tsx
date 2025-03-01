import { useState, useEffect } from "react";
import { FaHeart, FaThumbsUp } from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "../../../../../../services/supabaseClient";
import "./LikeButton.scss";

interface LikeButtonProps {
  contentId: number | string;
  type: "post" | "news";
  userId: string;
}

const LikeButton = ({ contentId, type, userId }: LikeButtonProps) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
		
  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from("likes")
        .select("*")
        .eq("content_id", contentId)
        .eq("type", type);

      if (!error) {
        setLikesCount(data.length);
        setLiked(data.some(like => like.user_id === userId));
      }
    };
    fetchLikes();
  }, [contentId, type, userId]);

  const toggleLike = async () => {
    if (liked) {
      await supabase
        .from("likes")
        .delete()
        .match({ content_id: contentId, type, user_id: userId });
      setLiked(false);
      setLikesCount(prev => prev - 1);
    } else {
      await supabase
        .from("likes")
        .insert([{ content_id: contentId, type, user_id: userId }]);
      setLiked(true);
      setLikesCount(prev => prev + 1);
    }
  };

  return (
    <div className="interaction-buttons">
      <button onClick={toggleLike} className={liked ? "liked" : ""}>
        {liked ? <FaHeart className="icon" /> : <FaThumbsUp className="icon" />}  
      </button>
      <span className="count">{likesCount}</span>
    </div>
  );
};

export default LikeButton;
