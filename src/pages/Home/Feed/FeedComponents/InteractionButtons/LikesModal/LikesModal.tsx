import React from "react";

interface LikesModalProps {
  users: { id: string; full_name: string }[];
  isOpen: boolean;
  onClose: () => void;
}

const LikesModal: React.FC<LikesModalProps> = ({ users, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Лайкнули пост</h2>
        <button onClick={onClose} className="close-button">Закрити</button>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.full_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LikesModal;
