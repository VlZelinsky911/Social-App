import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Додайте бібліотеку react-modal
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
  const [contacts, setContacts] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [shareCount, setShareCount] = useState<number>(0);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("id, username")
        .neq("id", userId); // Відфільтровуємо себе

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
      // Додаємо запис у таблицю повідомлень (імітація надсилання)
      const { error: messageError } = await supabase.from("messages").insert([
        {
          sender_id: userId,
          receiver_id: selectedUserId,
          post_id: postId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (messageError) {
        console.error("Помилка надсилання поста:", messageError);
        return;
      }

      // Оновлюємо лічильник репостів
      const { error: updateError } = await supabase.rpc(
        "increment_share_count",
        { post_id_input: postId }
      );

      if (updateError) {
        console.error("Помилка оновлення лічильника:", updateError);
      } else {
        setShareCount((prev) => prev + 1);
        alert("Пост успішно надіслано!");
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Помилка при надсиланні:", error);
    }
  };

  return (
    <div>
			<div className="interaction-buttons">
      <button>
        <FaPaperPlane />
      </button>
      <span className="count" onClick={() => setIsModalOpen(true)}>
				{shareCount}
			</span>
    </div>
    </div>
  );
};

export default ShareButton;
