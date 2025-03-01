import React, { useState } from "react";
import { FaComment } from "react-icons/fa";

const CommentButton = () => {
  const [comments, setComments] = useState(14);

  return (
    <div className="interaction-buttons">
      <button>
        <FaComment />
      </button>
      <span className="count">
				{comments}
			</span>
		</div>
    
  );
};

export default CommentButton;
