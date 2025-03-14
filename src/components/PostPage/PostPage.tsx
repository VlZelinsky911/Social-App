import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import Spinner from "../../pages/Home/Feed/FeedComponents/Spinner/Spinner";
import "./PostPage.scss";
import LikeButton from "../../pages/Home/Feed/FeedComponents/InteractionButtons/LikeButton/LikeButton";
import CommentButton from "../../pages/Home/Feed/FeedComponents/InteractionButtons/CommentButton/CommentButton";
import ShareButton from "../../pages/Home/Feed/FeedComponents/InteractionButtons/SendButton/ShareButton";
import Avatar from "../Avatar/Avatar";


const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!postId) return;

    const fetchPost = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select(`
          id, 
          text, 
          mediaurls, 
          created_at, 
          user_profiles(username, avatar_url, id) 
        `)
        .eq("id", postId) // тепер передаємо рядок, а не число
        .single();

      if (error) {
        console.error("Помилка отримання поста:", error);
      } else {
        setPost(data);
      }

      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  return (
    <div className="postpage__container">
      {loading ? (
        <div className="postpage__loading">
          <Spinner />
        </div>
      ) : post ? (
        <div className="postpage__post">
          <div className="postpage__header">
						<Avatar	name={post.user_profiles.username} avatarUrl={post.user_profiles.avatar_url}/>
            <Link to={`/profile/${post.user_profiles.username ?? "unknown"}`} className="postpage__username">
									{post.user_profiles.username ?? "Невідомий"}
						</Link>
						<span>{post.user_profiles.username}</span>
            <div className="postpage__date">
              {new Date(post.created_at).toLocaleString("uk-UA", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="postpage__content">
            <p className="postpage__text">{post.text}</p>
            {post.mediaurls && post.mediaurls.length > 0 && (
              <div className="postpage__media">
                <img src={post.mediaurls[0]} alt="Post content" className="postpage__image" />
              </div>
            )}
          </div>

          <div className="postpage__actions">
            <LikeButton contentId={post.id} userId={post.user_profiles.id} type={"post"} />
            <CommentButton contentId={post.id} userId={post.user_profiles.id} />
            <ShareButton />
          </div>
        </div>
      ) : (
        <p className="postpage__notfound">Пост не знайдено</p>
      )}
    </div>
  );
};

export default PostPage;
