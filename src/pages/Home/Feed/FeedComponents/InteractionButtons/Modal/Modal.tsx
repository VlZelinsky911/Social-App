import React from "react";

const users = [
  { id: 1, name: "Іван" },
  { id: 2, name: "Олена" },
  { id: 3, name: "Михайло" },
  { id: 4, name: "Анна" },
];

const Modal = ({ type, closeModal }: { type: "likes" | "comments" | "shares"; closeModal: () => void }) => {
  return (
    <>
      <div className="modal-overlay" onClick={closeModal}></div>
      <div className="modal">
        <h3>
          {type === "likes" && "Лайки"}
          {type === "comments" && "Коментарі"}
          {type === "shares" && "Репости"}
        </h3>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
        <button onClick={closeModal}>Закрити</button>
      </div>
    </>
  );
};

export default Modal;
