import { useState } from "react";
import { FaHeart, FaThumbsUp } from "react-icons/fa";

const LikeButton = ({ openModal }: { openModal: () => void }) => {
  const [liked, setLiked] = useState<boolean>(
    () => localStorage.getItem("liked") === "true"
  );
  const [likesCount, setLikesCount] = useState<number>(() => {
    const storedLikes = localStorage.getItem("likesCount");
    return storedLikes ? parseInt(storedLikes, 10) : 10;
  });

  const toggleLike = () => {
    const newLiked = !liked;
    const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;

    setLiked(newLiked);
    setLikesCount(newLikesCount);

    localStorage.setItem("likesCount", newLikesCount.toString());
    localStorage.setItem("liked", newLiked.toString());
  };

  return (
    <div className="interaction-buttons">
      <button
        onClick={toggleLike}
        className={liked ? "liked" : ""}
      >
			{liked ? <FaHeart className="icon" /> : <FaThumbsUp className="icon" />}	
      </button>
      <span className="count" onClick={openModal}>
        {likesCount}
      </span>
    </div>
  );
};

export default LikeButton;
