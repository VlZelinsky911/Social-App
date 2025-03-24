import React, { useState } from "react";
import "./ExpandableText.scss";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100 }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => setExpanded(!expanded);
  const textToShow = expanded ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");

  return (
    <div className="expandable-text">
      {textToShow.split("\n").map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      {text.length > maxLength && (
        <button className="toggle-button" onClick={toggleExpand}>
          {expanded ? "Згорнути" : "Розгорнути"}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
