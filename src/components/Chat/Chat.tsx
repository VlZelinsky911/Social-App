import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import ChatInput from "./ChatInput/ChatInput";
import "./Chat.scss";
import { FaPlay, FaTimes } from "react-icons/fa";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  created_at: string;
}

const Chat: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Помилка отримання користувача:", error);
        return;
      }
      if (data?.user?.id) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Помилка завантаження повідомлень:", error);
      } else {
        setMessages(data);
      }
      setLoading(false);
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [conversationId]);

  if (!conversationId) return <p className="error">Невірний чат 😥</p>;
  if (loading) return <p>Завантаження...</p>;

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="no-messages">Немає повідомлень 😔</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender_id === userId ? "sent" : "received"}`}>
              {msg.media_url && (
                msg.media_url.match(/\.(mp4|webm|mkv)$/) ? (
                  <div className="video-container">
                    <video controls className="message-video">
                      <source src={msg.media_url} type="video/mp4" />
                      Ваш браузер не підтримує відео.
                    </video>
                    <div className="play-icon">
                      <FaPlay />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={msg.media_url} 
                    alt="media" 
                    className="message-img" 
                    onClick={() => msg.media_url && setSelectedImage(msg.media_url)}
                  />
                )
              )}
              <p>{msg.content}</p>
            </div>
          ))
        )}
      </div>

      {userId && <ChatInput conversationId={conversationId} senderId={userId} />}

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <div className="lightbox-content">
            <img src={selectedImage} alt="Full size" />
            <button className="close-btn" onClick={() => setSelectedImage(null)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
