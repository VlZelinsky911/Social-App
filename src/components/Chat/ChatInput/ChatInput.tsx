import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { FaPaperPlane, FaImage, FaSmile, FaCheckCircle, FaVideo } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./ChatInput.scss";

interface ChatInputProps {
  conversationId: string;
  senderId: string;
}

const ChatInput = ({ conversationId, senderId }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMediaSelected, setIsMediaSelected] = useState(false);

  const handleEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleMediaUpload = async () => {
    if (!media) return null;

    const fileExt = media.name.split(".").pop();
    const fileType = media.type.startsWith("image/") ? "images" : "videos"; 
    const safeFileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileType}/${safeFileName}`;

    const { data, error } = await supabase.storage
      .from("chat-images")
      .upload(filePath, media, {
        contentType: media.type,
        upsert: true,
      });

    if (error) {
      console.error("❌ Помилка завантаження:", error);
      return null;
    }

    return supabase.storage.from("chat-images").getPublicUrl(filePath).data.publicUrl;
  };

  const sendMessage = async () => {
    if (!message.trim() && !media) return;

    const { data: conversation, error: convoError } = await supabase
      .from("conversations")
      .select("user1_id, user2_id")
      .eq("id", conversationId)
      .single();

    if (convoError || !conversation) {
      console.error("❌ Помилка отримання чату:", convoError);
      return;
    }

    const receiverId = conversation.user1_id === senderId ? conversation.user2_id : conversation.user1_id;
    const mediaUrl = media ? await handleMediaUpload() : null;
    const mediaType = media ? media.type.split("/")[0] : null; 

    const { error } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: message,
        media_url: mediaUrl,
        media_type: mediaType, 
        created_at: new Date(),
      },
    ]);

    if (error) console.error("❌ Помилка надсилання:", error);

    setMessage("");
    setMedia(null);
    setShowEmojiPicker(false);
    setIsMediaSelected(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Дозволені тільки фото та відео!");
      return;
    }

    setMedia(file);
    setIsMediaSelected(true);
  };

  return (
    <div className="chat-input">
      <button onClick={() => setShowEmojiPicker((prev) => !prev)}>
        <FaSmile />
      </button>

      {showEmojiPicker && (
        <div className="emoji-picker">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <input
        type="text"
        placeholder="Введіть повідомлення..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="file-upload"
      />
      <label htmlFor="file-upload" className={`upload-label ${isMediaSelected ? "selected" : ""}`}>
        {isMediaSelected ? <FaCheckCircle className="check-icon" /> : <FaImage />}
      </label>

      <button onClick={sendMessage}>
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default ChatInput;
