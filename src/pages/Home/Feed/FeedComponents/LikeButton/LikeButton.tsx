import React, { useState } from "react";
import { FaThumbsUp, FaHeart } from "react-icons/fa";
import "./LikeButton.scss";

const LikeButton: React.FC = () => {
  const [liked, setLiked] = useState<boolean>(() => localStorage.getItem("liked") === "true");
	const [likesCount, setLikesCount] = useState<number>(() => {
		const storedLikes = localStorage.getItem("likesCount");
		return storedLikes ? parseInt(storedLikes, 10) : 100;
	});

  const toggleLike = () => {
		const newLiked =!liked;
		const newLikesCount = newLiked ? likesCount + 1 : likesCount - 1;
		
		setLiked(newLiked);
		setLikesCount(newLikesCount);

		if(localStorage.getItem("likesCount") !== newLikesCount.toString()) {
				localStorage.setItem("likesCount", newLikesCount.toString());
			}
		if(localStorage.getItem("liked") !== newLiked.toString()) {
				localStorage.setItem("liked", newLiked.toString());
			}	
		}

  return (
    <button onClick={toggleLike} className={`like-button ${liked ? "liked" : ""}`}>
      <span className="icon">{liked ? <FaHeart /> : <FaThumbsUp />}</span>
			{likesCount}
    </button>
  );
};

export default LikeButton;
