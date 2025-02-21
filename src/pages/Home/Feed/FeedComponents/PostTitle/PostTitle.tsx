import React from "react";
import "./PostTitle.scss";
import { Link } from "react-router-dom";

interface PostTitleProps {
  author: string | null;
  publishedAt: string;
}

const PostTitle: React.FC<PostTitleProps> = ({ author, publishedAt }) => (
  <div className="news-meta">
    <span className="author-name">
			<Link to={`/profile/${author ?? "unknown"}`} className="author-link">
        @{author ?? "Невідомий"}
      </Link>
    </span>
    <span className="news-date">
      	{new Date(publishedAt).toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })}
    </span>
  </div>
);

export default PostTitle;
