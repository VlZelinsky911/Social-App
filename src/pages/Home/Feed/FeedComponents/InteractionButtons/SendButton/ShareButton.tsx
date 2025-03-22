import React, { useState, useEffect } from "react";
import "./ShareButton.scss";
import { supabase } from "../../../../../../services/supabaseClient";
import Avatar from "../../../../../../components/Avatar/Avatar";
import { FaPaperPlane } from "react-icons/fa";

interface ShareButtonProps {
  postId: number;
  userId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ postId, userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contacts, setContacts] = useState<{ id: string; username: string; avatar_url?: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState<number>(0);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username, avatar_url")
        .neq("id", userId);

      if (error) {
        console.error("Помилка завантаження контактів:", error);
      } else {
        setContacts(data);
      }
    };

    fetchContacts();
  }, [userId]);

  // Функція для надсилання поста
  const handleShare = async () => {
    if (!selectedUserId) {
      alert("Оберіть користувача для надсилання.");
      return;
    }

    try {
      const { error: messageError } = await supabase.from("messages").insert([
        {
          sender_id: userId,
          receiver_id: selectedUserId,
          post_id: postId,
          content: "🔗 Поділився(лась) постом!",
          created_at: new Date().toISOString(),
        },
      ]);

      if (messageError) {
        console.error("Помилка надсилання поста:", messageError);
        return;
      }

			const { error: updateError } = await supabase.rpc("increment_share_count", {
        post_id_input: postId
			});
			
	
      if (updateError) {
        console.error("Помилка оновлення лічильника:", updateError);
      } else {
        setShareCount((prev) => prev + 1);
        alert("✅ Пост успішно надіслано!");
      }

      setIsModalOpen(false);
      setSelectedUserId(null);
    } catch (error) {
      console.error("Помилка при надсиланні:", error);
    }
  };

  return (
    <div>
      <div className="interaction-buttons">
        <button onClick={() => setIsModalOpen(true)}>
          <FaPaperPlane />
        </button>
        <span className="count">{shareCount}</span>
      </div>

      {isModalOpen && (
        <div className="modal_share">
          <div className="modal-content_share">
            <h3>Надіслати пост</h3>
            <ul className="contacts-list">
              {contacts.map((contact) => (
                <li
                  key={contact.id}
                  className={selectedUserId === contact.id ? "selected" : ""}
                  onClick={() => setSelectedUserId(contact.id)}
                >
                  <Avatar name={contact.username} avatarUrl={contact.avatar_url} />
                  {contact.username}
                </li>
              ))}
            </ul>
            <button className="close-button" onClick={() => setIsModalOpen(false)}>❌</button>
            <button onClick={handleShare} className="send-button" disabled={!selectedUserId}>
              Надіслати
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
