import React, { useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import { FaPaperPlane, FaImage, FaSmile, FaCheckCircle } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import "./ChatInput.scss";
import { set } from "date-fns";

interface ChatInputProps {
  conversationId: string;
  senderId: string;
}

const ChatInput = ({ conversationId, senderId }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [isMediaSelected, setIsMediaSelected] = useState(false);


  const handleEmojiClick = (emoji: any) => {
    setMessage((prev) => prev + emoji.emoji);
  };

  const handleImageUpload = async () => {
    if (!image) return null;

    const fileName = `${Date.now()}-${image.name}`;
    const { data, error } = await supabase.storage
      .from("chat-images")
      .upload(fileName, image);

    if (error) {
      console.error("❌ Помилка завантаження:", error);
      return null;
    }

    return supabase.storage.from("chat-images").getPublicUrl(fileName).data.publicUrl;
  };

  const sendMessage = async () => {
    if (!message.trim() && !image) return;


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

    const imageUrl = image ? await handleImageUpload() : null;

    const { error } = await supabase.from("messages").insert([
      {
        conversation_id: conversationId,
        sender_id: senderId,
        receiver_id: receiverId,
        content: message,
        media_url: imageUrl,
        created_at: new Date(),
      },
    ]);

    if (error) console.error("❌ Помилка надсилання:", error);

    setMessage("");
    setImage(null);
    setShowEmojiPicker(false);
  };

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files?.[0] || null;
		setImage(files);
		setIsMediaSelected(true);
	}

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
        accept="image/*"
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
