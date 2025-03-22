import { useEffect, useState } from "react";
import { supabase } from "../../../services/supabaseClient";
import Avatar from "../../Avatar/Avatar";
import "./UserChats.scss";
import { useNavigate } from "react-router-dom";

interface UserChatsProps {
  setIsChatsOpen: (isOpen: boolean) => void;
}

const UserChats: React.FC<UserChatsProps> = ({ setIsChatsOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("❌ Помилка отримання користувача:", error);
      }
      setUser(data?.user);
    };
    getUser();
  }, []);
  const fetchChats = async (userId: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("conversations")
      .select(
        `
        id,
        last_message,
        last_message_at,
        user1_id,
        user2_id,
        user1:user_profiles!fk_user1(id, username, avatar_url),
        user2:user_profiles!fk_user2(id, username, avatar_url)
      `
      )
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("❌ Помилка отримання чатів:", error);
      setLoading(false);
      return;
    }

    const formattedChats = data.map((chat) => ({
      ...chat,
      otherUser: chat.user1_id === userId ? chat.user2 : chat.user1,
    }));
    console.log(formattedChats);
    setChats(formattedChats);
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) {
      fetchChats(user.id);
    }
  }, [user?.id]);

  return (
    <div className="user-chats">
      {loading ? (
        <p className="loading">Завантаження...</p>
      ) : chats.length === 0 ? (
        <p className="no-chats">У вас ще немає чатів</p>
      ) : (
        chats.map((chat) => (
          <div
            key={chat.id}
            className="chat-item"
            onClick={() =>{ 
							navigate(`/chat/${chat.id}`);
							setIsChatsOpen(false);
					}}
          >
            {chat.otherUser ? (
              <>
                <Avatar
                  name={chat.otherUser.username}
                  avatarUrl={chat.otherUser.avatar_url}
                />
                <div className="chat-info">
                  <h3>{chat.otherUser.username}</h3>
                  <p>{chat.last_message || "Немає повідомлень"}</p>
                </div>
              </>
            ) : (
              <p>Чат не знайдено</p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default UserChats;
