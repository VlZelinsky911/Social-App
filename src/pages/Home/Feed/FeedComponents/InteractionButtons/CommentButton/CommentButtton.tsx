import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import "./CommentButton.scss";

const CommentButton: React.FC = () => {
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<string[]>([]);
  const maxLength: number = 200;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setComment(e.target.value);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (comment.trim() === "") {
      setError("Коментар не може бути порожнім");
    } else {
      setComments([...comments, comment]);
      setComment("");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="comment-section">
      <button className="comment-section__button" onClick={() => setIsModalOpen(true)}>
        <FaComment />
      </button>
      <span className="comment-section__count" onClick={() => setIsModalOpen(true)}>
        {comments.length}
      </span>

      {isModalOpen && (
        <div className="comment-modal">
          <div className="comment-modal__content">
					<h3 className="comment-list__title">Додати:</h3>
            <button className="comment-modal__close" onClick={() => setIsModalOpen(false)}>❌</button>
            
            <textarea
              className="comment-modal__input"
              value={comment}
              onChange={handleChange}
              placeholder="Напишіть коментар..."
              maxLength={maxLength}
            />
            <div className="comment-modal__char-count">{comment.length}/{maxLength}</div>
            {error && <div className="comment-modal__error">{error}</div>}

            <button className="comment-modal__submit" onClick={handleSubmit} disabled={!comment.trim()}>
              Надіслати
            </button>

            <div className="comment-list">
							<h3 className="comment-list__title">Коментарі:</h3>
              {comments.length > 0 ? (
                comments.map((c, index) => <div key={index} className="comment-list__item">{c}</div>)
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

export default CommentButton;
