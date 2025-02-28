import React, { useState } from "react";
import { FaComment } from "react-icons/fa";

const CommentButton = ({ openModal }: { openModal: () => void }) => {
  const [comments, setComments] = useState(4);

  return (
    <>
      <button>
        <FaComment />
      </button>
      <span className="count" onClick={openModal}>{comments}</span>
    </>
  );
};

export default CommentButton;
