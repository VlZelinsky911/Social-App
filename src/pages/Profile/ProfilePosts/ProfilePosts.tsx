import React from "react";
import "./ProfilePosts.scss";
import LikeButton from "../../Home/Feed/FeedComponents/InteractionButtons/LikeButton/LikeButton";
import ShareButton from "../../Home/Feed/FeedComponents/InteractionButtons/SendButton/ShareButton";
import CommentButton from "../../Home/Feed/FeedComponents/InteractionButtons/CommentButton/CommentButton";
interface ProfilePostProps {
  post: {
    id: string;
    text: string;
    mediaurls?: string;
    created_at: string;
    userId: string;
  };
	user?: any;
}

const ProfilePosts: React.FC<ProfilePostProps> = ({ post, user = null }) => {
	

  return (
    <div className="profile-post">
      <div className="post-header">
        <div className="post-info">
          <div className="post-date">
            {new Date(post.created_at).toLocaleString("uk-UA", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      <div className="post-content">
        <div className="post-content__border">
          <p className="post-text">{post.text}</p>
        </div>
        {post.mediaurls && (
          <div className="post-media">
            <img
              src={post.mediaurls}
              alt="Post content"
              className="post-image"
            />
          </div>
        )}
        <div className="home-likes-comments">
          <LikeButton contentId={post.id} userId={user?.user?.id ?? ""} type={"post"} />
          <CommentButton contentId={post.id} userId={user?.user?.id ?? ""} />
          <ShareButton  postId={Number(post.id)} userId={user?.user?.id ?? ""}/>
        </div>
      </div>
    </div>
  );
};

export default ProfilePosts;
