import React, { useState } from "react";
import { FaPhotoVideo, FaUserTag, FaMapMarkerAlt, FaEllipsisH } from "react-icons/fa";
import "./PostCreator.scss"

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const maxChars = 280;

  const handlePost = () => {
    if (postText.trim()) {
      alert("Пост створено: " + postText);
      setPostText("");
    }
  };

  return (
    <div className="create-post">
      <div className="post-header">
        <img
          src="../../../public/Mark.jpg"
          alt="User Avatar"
          className="avatar"
        />
        <textarea
          placeholder="Що у вас нового?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          maxLength={maxChars}
        />
      </div>
      <div className="char-counter">{postText.length} / {maxChars}</div>
      <div className="post-actions">
        <button className="action-btn"><FaPhotoVideo /> Фото/відео</button>
        <button className="action-btn"><FaUserTag /> Відмітити друга</button>
        <button className="action-btn"><FaMapMarkerAlt /> Місцезнаходження</button>
        <button className="action-btn"><FaEllipsisH /></button>
      </div>
      <button className="post-btn" onClick={handlePost} disabled={postText.length === 0}>Опублікувати</button>
    </div>
  );
};

export default CreatePost;
