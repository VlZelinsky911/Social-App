import React from "react";
import "./Avatar.scss";

interface AvatarProps {
  name: string | null;
  avatarUrl?: string | null | undefined;
}

const getInitials = (name: string | null) => (name ? name.charAt(0).toUpperCase() : "?");

const getRandomColor = (name: string | null) => {
  const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#FF8C33"];
  return colors[name ? name.charCodeAt(0) % colors.length : 0];
};

const Avatar: React.FC<AvatarProps> = ({ name, avatarUrl }) => {
  return avatarUrl ? (
    <img src={avatarUrl} alt={name || "user"} className="avatar-img" />
  ) : (
    <div className="avatar-placeholder" style={{ backgroundColor: getRandomColor(name) }}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
