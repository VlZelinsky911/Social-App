import React, { useState } from "react";

import "./InteractionButtons.scss";
import LikeButton from "./LikeButton/LikeButton";
import CommentButton from "./CommentButton/CommentButtton";
import ShareButton from "./SendButton/ShareButton";
import Modal from "./LikesModal/LikesModal";

const IntegrationButtons = () => {
  const [modalType, setModalType] = useState<"likes" | "comments" | "shares" | null>(null);

  return (
    <div className="interaction-buttons">
      <LikeButton/>
      <CommentButton/>
      <ShareButton/>

      {modalType && <Modal type={modalType} closeModal={() => setModalType(null)} />}
    </div>
  );
};

export default IntegrationButtons;