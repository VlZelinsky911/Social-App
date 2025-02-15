import React, { useState, useEffect, useCallback } from "react";
import "./WelcomeMessage.scss";

const WelcomeMessage: React.FC = () => {
  const [showMessage, setShowMessage] = useState(true);

	const hideMessage = useCallback(() => {
		setShowMessage(false);
	}, []);

  useEffect(() => {
    const timer = setTimeout(hideMessage, 10000);

    return () => clearTimeout(timer); 
  }, [hideMessage]);

  return (
    showMessage && (
      <div className="welcome-message">
        <h2>Ласкаво просимо в GameNet!</h2>
        <p>Останні новини, тренди та рекомендації для вас.</p>
      </div>
    )
  );
};

export default WelcomeMessage;
