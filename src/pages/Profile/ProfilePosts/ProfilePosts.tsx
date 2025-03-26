import React from "react";
import "./ProfilePosts.scss";
import LikeButton from "../../Home/Feed/FeedComponents/InteractionButtons/LikeButton/LikeButton";
import ShareButton from "../../Home/Feed/FeedComponents/InteractionButtons/SendButton/ShareButton";
import CommentButton from "../../Home/Feed/FeedComponents/InteractionButtons/CommentButton/CommentButton";
import SavePostButton from "../../Home/Feed/FeedComponents/InteractionButtons/SavePostButton/SavePostButton";
import Slider from "react-slick";
import ExpandableText from "../../Home/Feed/FeedComponents/ExpandableText/ExpandableText";
import { sliderSettings } from "../../Home/Feed/FeedComponents/PostSlider/sliderSettings";
import VideoPlayer from "../../Home/Feed/VideoPlayer/VideoPlayer";

interface ProfilePostProps {
  post: {
    id: number;
    text: string;
    mediaurls?: string[];
    created_at: string;
    username?: string;
    user_id: string;
  };
  user?: any;
}

const ProfilePosts: React.FC<ProfilePostProps> = ({ post, user }) => {
  return (
    <div className="post__profile">
        <div key={post.id} className="feed-post-item">
          <div className="home-news-details">
            <div className="post-date">
              {new Date(post.created_at).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
            <div className="home-article-border">
              <ExpandableText text={post.text} maxLength={33} />
            </div>
            {post.mediaurls && post.mediaurls.length > 0 && (
              <div className="home-news-media">
                <Slider {...sliderSettings}>
                  {post.mediaurls.map((url, index) => (
                    <div key={index}>
                      {url.endsWith(".mp4") ||
                      url.endsWith(".webm") ||
                      url.endsWith(".mkv") ? (
                        <VideoPlayer key={index} videoUrl={url} />
                      ) : (
                        <img src={url} alt={`Медіа ${index + 1}`} />
                      )}
                    </div>
                  ))}
                </Slider>
              </div>
            )}
            <div className="home-news-actions">
              <div className="home-likes-comments">
                {user && (
                  <LikeButton
                    contentId={post.id}
                    type="post"
                    userId={user.id}
                  />
                )}
                {user && <CommentButton contentId={post.id} userId={user.id} />}
                {user && (
                  <ShareButton postId={String(post.id)} userId={user?.id} />
                )}
              </div>
              {user && <SavePostButton postId={post.id} userId={user.id} />}
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProfilePosts;
