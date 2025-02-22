import React, { useState } from "react";
import { FaPhotoVideo, FaUserTag, FaMapMarkerAlt, FaEllipsisH } from "react-icons/fa";
import PreviewFiles from "./MediaPreview/MediaPreview";
import "./PostCreator.scss";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const maxChars = 280;

  const handlePost = () => {
    if (postText.trim().length >= 3) {
      alert("Пост створено!");
      setPostText("");
      setSelectedFiles([]);
    } else {
      alert("Будь ласка, введіть хоча б 3 символи тексту.");
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setSelectedFiles(prevFiles => [...prevFiles, ...Array.from(files)]);
  };

  const canPost = postText.trim().length >= 3;

  return (
    <div className="create-post">
      <div className="post-header">
        <img src="../../../public/Mark.jpg" alt="User Avatar" className="avatar" />
        <textarea
          placeholder="Що у вас нового?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          maxLength={maxChars}
        />
      </div>
      <div className="char-counter">{postText.length} / {maxChars}</div>
      <div className="post-actions">
        <label className="action-btn">
          <FaPhotoVideo /> Фото/відео
          <input 
            type="file" 
            accept="image/*,video/*" 
            multiple 
            hidden 
            onChange={handleFileChange}
          />
        </label>
        <button className="action-btn"><FaUserTag /> Відмітити друга</button>
        <button className="action-btn"><FaMapMarkerAlt /> Місцезнаходження</button>
        <button className="action-btn"><FaEllipsisH /></button>
      </div>

      {selectedFiles.length > 0 && <PreviewFiles files={selectedFiles} />}

      <button className="post-btn" onClick={handlePost} disabled={!canPost}>
        Опублікувати
      </button>
    </div>
  );
};

export default CreatePost;
