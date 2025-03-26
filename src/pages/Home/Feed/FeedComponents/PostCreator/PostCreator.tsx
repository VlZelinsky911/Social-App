import React, { useEffect, useState } from "react";
import {
  FaEllipsisH,
  FaMapMarkerAlt,
  FaPhotoVideo,
  FaUserTag,
} from "react-icons/fa";
import { supabase } from "../../../../../services/supabaseClient";
import PreviewFiles from "./MediaPreview/MediaPreview";
import "./PostCreator.scss";
import { uploadFiles } from "../../../../../services/fileUploadService/fileUploadService";
import Avatar from "../../../../../components/Avatar/Avatar";

type UserProfile = {
  username: string | null;
  avatar_url: string | null | undefined;
};

interface PostCreatorProps {
  userId: string | null;
  onPostCreated: () => void;
}

const CreatePost = ({ userId, onPostCreated }: PostCreatorProps) => {
  const [postText, setPostText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usersProfile, setUsersProfile] = useState<UserProfile | null>(null);
  const maxChars = 1080;

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user || !user.user) return;

      const { data, error } = await supabase
        .from("user_profiles")
        .select("username, avatar_url")
        .eq("id", user.user.id)
        .single();

      if (error) {
        console.error("❌ Помилка отримання профілю:", error);
      } else {
        setUsersProfile(data);
      }
    };
    fetchUserProfile();
  }, []);

  const handleTagFriend = () => {
    setPostText((prevText) => prevText + "@");
  };

  const handleTagLocation = () => {
    if (!navigator.geolocation) {
      setError("Ваш браузер не підтримує геолокацію.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const locationName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Невідоме місце";
          setPostText((prevText) => prevText + ` 📍 ${locationName}`);
        } catch (err) {
          console.error("❌ Помилка отримання локації:", err);
          setError("Не вдалося отримати вашу локацію.");
        }
      },
      (error) => {
        console.error("❌ Помилка отримання локації:", error);
        setError("Не вдалося отримати вашу локацію.");
      }
    );
  };
  const handlePost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const mediaUrls = await uploadFiles(selectedFiles, "posts");
      console.log("📤 Завантажені файли:", mediaUrls);

      const { error } = await supabase.from("posts").insert([
        {
          text: postText || null,
          mediaurls: mediaUrls.length > 0 ? mediaUrls : null,
          user_id: userId,
        },
      ]);

      if (error) throw error;

      alert("✅ Пост створено!");
      setPostText("");
      setSelectedFiles([]);
      onPostCreated();
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
        <Avatar
          name={usersProfile?.username || null}
          avatarUrl={usersProfile?.avatar_url}
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
        <label className={`action-btn ${isLoading ? "disabled" : ""}`} title="Додати медіа">
          <FaPhotoVideo /> 
					<span className="text__adapt">	
					Додати медіа
          </span>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            hidden
            onChange={handleFileChange}
            aria-label="Додати медіа"
          />
        </label>
        <button
          className="action-btn"
          disabled={isLoading}
          onClick={handleTagFriend}
          aria-label="Відмітити друга"
        >
        		<FaUserTag /> 
						<span className="text__adapt">	
						Відмітити друга
          	</span>
        </button>
        <button
          className="action-btn"
          disabled={isLoading}
          onClick={handleTagLocation}
          aria-label="Місцезнаходження"
        >
            <FaMapMarkerAlt /> 
						<span className="text__adapt">	
						Місцезнаходження
          	</span>
        </button>
        <button className="action-btn" disabled={isLoading}>
          <FaEllipsisH />
        </button>
      </div>

      {selectedFiles.length > 0 && (
        <PreviewFiles files={selectedFiles} setFiles={setSelectedFiles} />
      )}

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
