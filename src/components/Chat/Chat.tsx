import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import ChatInput from "./ChatInput/ChatInput";
import "./Chat.scss";

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
              {msg.media_url && <img src={msg.media_url} alt="media" className="message-img" />}
              <p>{msg.content}</p>
            </div>
          ))
        )}
      </div>
      {userId && <ChatInput conversationId={conversationId} senderId={userId} />}
    </div>
  );
};

export default Chat;