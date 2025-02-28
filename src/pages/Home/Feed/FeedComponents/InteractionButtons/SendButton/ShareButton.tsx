import React, { useState } from "react";
import { FaPaperPlane, FaRetweet } from "react-icons/fa";

const ShareButton = ({ openModal }: { openModal: () => void }) => {
  const [shares, setShares] = useState(1);

  return (
    <>
      <button>
        <FaPaperPlane />
      </button>
      <span className="count" onClick={openModal}>{shares}</span>
    </>
  );
};

export default ShareButton;
