import React, { useState } from "react";
import {
  FaEllipsisH,
  FaMapMarkerAlt,
  FaPhotoVideo,
  FaUserTag,
} from "react-icons/fa";
import { supabase} from "../../../../../services/supabaseClient";
import PreviewFiles from "./MediaPreview/MediaPreview";
import "./PostCreator.scss";
import { uploadFiles } from "../../../../../services/fileUploadService/fileUploadService";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxChars = 280;

  const handlePost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaUrls = await uploadFiles(selectedFiles);
      console.log("📤 Завантажені файли:", mediaUrls);

      const { error } = await supabase.from("posts").insert([
        {
          text: postText || null,
          mediaurls: mediaUrls.length > 0 ? mediaUrls : null,
        },
      ]);

      if (error) throw error;

      alert("✅ Пост створено!");
      setPostText("");
      setSelectedFiles([]);
    } catch (err: any) {
      console.error("❌ Помилка створення поста:", err);
      setError(err.message || "Помилка під час створення поста.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    setSelectedFiles((prevFiles) => [...prevFiles, ...fileArray]);
  };

  const canPost = postText.trim().length >= 3 && !isLoading;

  return (
    <div className="create-post">
      <div className="post-header">
        <img
          src="../../public/Mark.jpg"
          alt="User Avatar"
          className="avatar"
        />
        <textarea
          placeholder="Що у вас нового?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          maxLength={maxChars}
          disabled={isLoading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="char-counter">
        {postText.length} / {maxChars}
      </div>

      <div className="post-actions">
        <label className={`action-btn ${isLoading ? "disabled" : ""}`}>
          <FaPhotoVideo /> Додати медіа
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={handleFileChange}
          />
        </label>
        <button className="action-btn" disabled={isLoading}>
          <FaUserTag /> Відмітити друга
        </button>
        <button className="action-btn" disabled={isLoading}>
          <FaMapMarkerAlt /> Місцезнаходження
        </button>
        <button className="action-btn" disabled={isLoading}>
          <FaEllipsisH />
        </button>
      </div>

      {selectedFiles.length > 0 && <PreviewFiles files={selectedFiles} setFiles={setSelectedFiles} />}

      <button
        className={`post-btn ${isLoading ? "loading" : ""}`}
        onClick={handlePost}
        disabled={!canPost}
      >
        {isLoading ? "Публікація..." : "Опублікувати"}
      </button>
    </div>
  );
};

export default CreatePost;
