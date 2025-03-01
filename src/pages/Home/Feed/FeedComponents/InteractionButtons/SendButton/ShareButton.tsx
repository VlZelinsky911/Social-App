import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const ShareButton = () => {
  const [shares, setShares] = useState(11);

  return (
		<div className="interaction-buttons">
      <button>
        <FaPaperPlane />
      </button>
      <span className="count">
				{shares}
			</span>
    </div>
  );
};

export default ShareButton;
