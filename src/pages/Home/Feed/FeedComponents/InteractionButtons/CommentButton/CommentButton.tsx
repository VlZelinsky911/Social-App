import { useState, useEffect } from "react";
import { FaComment, FaTrash } from "react-icons/fa";
import { supabase } from "../../../../../../services/supabaseClient";
import "./CommentButton.scss";
import Avatar from "../../../../../../components/Avatar/Avatar";

interface Comment {
  id: number;
  content_id: number | string;
  user_id: string;
  text: string;
  created_at: string;
  username: string;
  avatar_url: string;
}

interface CommentSectionProps {
  contentId: number | string;
  userId: string;
}

const CommentSection = ({ contentId, userId }: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxLength = 200;

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(
          `
          id, content_id, user_id, text, created_at,
          user_profiles!inner ( username, avatar_url )
        `
        )
        .eq("content_id", contentId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedData = data.map((c: any) => ({
        id: c.id,
        content_id: c.content_id,
        user_id: c.user_id,
        text: c.text,
        created_at: c.created_at,
        username: c.user_profiles?.username || "Анонім",
        avatar_url: c.user_profiles?.avatar_url || null,
      }));

      setComments(formattedData);
    } catch (error) {
      console.error("Помилка отримання коментарів:", error);
      setError("Не вдалося завантажити коментарі. Спробуйте оновити сторінку.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [contentId]);

	const handleDelete = async (commentId: number) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId)
        .eq("user_id", userId);

      if (error) throw error;

      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Помилка видалення коментаря:", error);
      setError("Не вдалося видалити коментар. Спробуйте ще раз.");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      if (!comment.trim()) {
        setError("Коментар не може бути порожнім!");
        return;
      }

      if (!userId) {
        setError("Будь ласка, увійдіть в систему, щоб додати коментар.");
        return;
      }

      const { error } = await supabase
        .from("comments")
        .insert([
          { content_id: contentId, user_id: userId, text: comment.trim() },
        ]);

      if (error) throw error;

      setComment("");
      await fetchComments();
    } catch (error: any) {
      console.error("Помилка надсилання коментаря:", error);
      setError(
        error.message === "JWT expired"
          ? "Ваша сесія закінчилася. Будь ласка, увійдіть знову."
          : "Не вдалося додати коментар. Спробуйте ще раз."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <button
        className="comment-section__button"
        onClick={() => setIsModalOpen(true)}
      >
        <FaComment />
      </button>
      <span
        className="comment-section__count"
        onClick={() => setIsModalOpen(true)}
      >
        {comments.length}
      </span>

      {isModalOpen && (
        <div className="comment-modal">
          <div className="comment-modal__content">
            <h3 className="comment-list__title">Додати коментар:</h3>
            <button
              className="comment-modal__close"
              onClick={() => setIsModalOpen(false)}
            >
              ❌
            </button>

            <textarea
              className="comment-modal__input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Напишіть коментар..."
              maxLength={maxLength}
            />
            <div className="comment-modal__char-count">
              {comment.length}/{maxLength}
            </div>
            {error && <div className="comment-modal__error">{error}</div>}

            <div className="comment-modal__buttons">
              <button
                className="comment-modal__cancel"
                onClick={() => setComment("")}
                disabled={!comment.trim() || isSubmitting}
              >
                Скасувати
              </button>
              <button
                className="comment-modal__submit"
                onClick={handleSubmit}
                disabled={!comment.trim() || isSubmitting}
              >
                {isSubmitting ? "Надсилання..." : "Надіслати"}
              </button>
            </div>

						<div className="comment-modal__line"></div>
            <div className="comment-list">
              <h3 className="comment-list__title">Коментарі:</h3>
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="comment-list__item">
                    <div className="comment-list__header">
                      <Avatar name={c.username} avatarUrl={c.avatar_url} />
                      <strong>{c.username}</strong>
											{c.user_id === userId && (
													<button 
														onClick={() => handleDelete(c.id)} 
														className="comment-list__delete">
														<FaTrash/>
													</button>
												)}
                    </div>
                    <p className="comment-list__text">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="comment-list__empty">Ще немає коментарів</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
