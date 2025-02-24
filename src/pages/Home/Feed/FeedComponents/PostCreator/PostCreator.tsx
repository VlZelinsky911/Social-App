import React, { useState } from "react";
import {
  FaPhotoVideo,
  FaUserTag,
  FaMapMarkerAlt,
  FaEllipsisH,
} from "react-icons/fa";
import { createClient } from "@supabase/supabase-js";
import PreviewFiles from "./MediaPreview/MediaPreview";
import "./PostCreator.scss";

const supabaseUrl = "https://tvcikevghrhzdnbqieto.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2Y2lrZXZnaHJoemRuYnFpZXRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzMzgyMDEsImV4cCI6MjA1NTkxNDIwMX0.NqNJ9aSVR4cDJHLm7qbJSJ9xthowtnqClaD8wIrBm3s";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const maxChars = 280;

  const handlePost = async () => {
    if (postText.trim().length < 3) {
      alert("Будь ласка, введіть хоча б 3 символи тексту.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let mediaUrls: string[] = [];

      // Завантаження файлів у Supabase Storage
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from("post_media") // Назва бакету у Supabase
            .upload(fileName, file);

          if (error) throw error;
          return `${supabaseUrl}/storage/v1/object/public/post_media/${fileName}`;
        });

        mediaUrls = await Promise.all(uploadPromises);
      }

      // Збереження поста в базі даних
      const { error } = await supabase.from("posts").insert([
        {
          text: postText,
          mediaurls: mediaUrls.length > 0 ? mediaUrls : null,
        },
      ]);

      if (error) throw error;

      alert("Пост успішно створено!");
      setPostText("");
      setSelectedFiles([]);
    } catch (err: any) {
      setError(err.message || "Помилка під час створення поста.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
  };

  const canPost = postText.trim().length >= 3 && !isLoading;

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
          disabled={isLoading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="char-counter">
        {postText.length} / {maxChars}
      </div>
      <div className="post-actions">
        <label className={`action-btn ${isLoading ? "disabled" : ""}`}>
          <FaPhotoVideo /> Фото/відео
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

      {selectedFiles.length > 0 && <PreviewFiles files={selectedFiles} />}

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
