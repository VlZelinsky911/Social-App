import React, { useState } from "react";
import "./PostTitle.scss";
import { Link } from "react-router-dom";
import { FaEllipsisH } from "react-icons/fa";
import { set } from "date-fns";

interface PostTitleProps {
  author: string | null;
  publishedAt: string;
  handleDeletePost: (postId: number) => void;
  postId: number;
  userId: string | null;
  postUserId: string;
}

const timeAgo = (dateString: string) => {
  const now = new Date();
  const publishedAt = new Date(dateString);
  const timeDiff = Math.floor((now.getTime() - publishedAt.getTime()) / 1000);

  if (timeDiff < 60) {
    return `${timeDiff} сек.`;
  } else if (timeDiff < 3600) {
    return `${Math.floor(timeDiff / 60)} хв.`;
  } else if (timeDiff < 86400) {
    return `${Math.floor(timeDiff / 3600)} год.`;
  } else if (timeDiff < 604800) {
    return `${Math.floor(timeDiff / 86400)} дн.`;
  } else {
    return `${Math.floor(timeDiff / 604800)} тиж.`;
  }
};

const PostTitle: React.FC<PostTitleProps> = ({ author, publishedAt, handleDeletePost, postId, userId, postUserId }) => {
  const [isModalOpen, setModalOpen] = useState(false);
	const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

  return (
    <div className="news-meta">
      <div className="author">
        <span className="author-name">
          <Link to={`/profile/${author ?? "unknown"}`} className="author-link">
            @{author ?? "Невідомий"}
          </Link>
        </span>
        <span className="date-separator">•</span>
        <span className="news-date">{timeAgo(publishedAt)}</span>
        <button className="post-options__btn" onClick={() => setModalOpen(true)}>
          <FaEllipsisH />
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-block" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setModalOpen(false)}>❌</button>
            <h3>ОПЦІЇ</h3>
            {userId === postUserId && (
              <button onClick={() => {
								setModalOpen(false);
								setConfirmModalOpen(true);
							}}>
                Видалити пост
              </button>
            )}
            <button>In process🫣</button>
            <button>In process🫣</button>
            <button>In process🫣</button>
          </div>
        </div>
      )}

			{isConfirmModalOpen && (
        <div className="modal-overlay" onClick={() => setConfirmModalOpen(false)}>
          <div className="modal-block" onClick={(e) => e.stopPropagation()}>
            <h3>Ви впевнені, що хочете видалити цей пост?</h3>
            <div className="modal-actions">
              <button className="confirm-button" onClick={() => {
                handleDeletePost(postId);
                setConfirmModalOpen(false);
              }}>Так</button>
              <button className="cancel-button" onClick={() => setConfirmModalOpen(false)}>Ні</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostTitle;