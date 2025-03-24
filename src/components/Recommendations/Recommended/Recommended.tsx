import React, { useEffect, useState, useRef, useCallback } from "react";
import "./Recommended.scss";
import { supabase } from "../../../services/supabaseClient";
import SuggestedUsers from "../../SuggestedUsers/SuggestedUsers";
import { NewsCategories } from "../../../pages/Home/Feed/FeedComponents/NewsCategories/NewsCategories";
import PostCreator from "../../../pages/Home/Feed/FeedComponents/PostCreator/PostCreator";
import Spinner from "../../../pages/Home/Feed/FeedComponents/Spinner/Spinner";
import PostTitle from "../../../pages/Home/Feed/FeedComponents/PostTitle/PostTitle";
import ExpandableText from "../../../pages/Home/Feed/FeedComponents/ExpandableText/ExpandableText";
import { sliderSettings } from "../../../pages/Home/Feed/FeedComponents/PostSlider/sliderSettings";
import Slider from "react-slick";
import VideoPlayer from "../../../pages/Home/Feed/VideoPlayer/VideoPlayer";
import LikeButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/LikeButton/LikeButton";
import CommentButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/CommentButton/CommentButton";
import ShareButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/SendButton/ShareButton";
import SavePostButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/SavePostButton/SavePostButton";

interface Post {
  id: number;
  text: string;
  mediaurls?: string[];
  created_at: string;
  username: string;
  user_id: string;
  likes_count: number;
}

const Recommended: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const pageRef = useRef<number>(1);
  const canLoadMore = useRef<boolean>(true);
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);
	const [filter, setFilter] = useState<string>("all");
		const [activeCategory, setActiveCategory] = useState<string>("Стрічка");

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const fetchPosts = async () => {
    if (loading || !canLoadMore.current) return;
    setLoading(true);

    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) {
      setLoading(false);
      return;
    }

    const currentUserId = user.user.id;

    const { data: blockedUsers, error: blockedError } = await supabase
      .from("blocked_users")
      .select("blocked_user_id")
      .eq("user_id", currentUserId);

    if (blockedError) {
      console.error("❌ Помилка отримання списку заблокованих користувачів:", blockedError);
      setLoading(false);
      return;
    }

    const blockedIds = blockedUsers ? blockedUsers.map((b) => b.blocked_user_id) : [];

    const { data, error } = await supabase
      .from("posts")
      .select("id, text, mediaurls, created_at, user_id, user_profiles(username), comments_count")
      .order("comments_count", { ascending: false })
      .not("user_id", "in", `(${blockedIds.join(",")})`)
      .range((pageRef.current - 1) * 5, pageRef.current * 5 - 1);

    if (error) {
      console.error("❌ Помилка завантаження постів:", error);
    } else {
      if (data.length > 0) {
        const formattedData = data.map((post: any) => ({
          ...post,
          username: post.user_profiles.username,
        }));
        setPosts((prev) => [...prev, ...formattedData]);
        pageRef.current += 1;
      } else {
        canLoadMore.current = false;
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10 &&
        !loading
      ) {
        fetchPosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handlePostCreated = useCallback(() => {
    setIsPostSubmitting(true);
    setPosts([]);
    pageRef.current = 1;
    canLoadMore.current = true;
    fetchPosts().finally(() => {
      setIsPostSubmitting(false);
    });
  }, []);

  const handleDeletePost = async (postId: number) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);
      if (error) throw error;
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      alert("Пост успішно видалено!");
    } catch (error) {
      console.error("Помилка видалення поста:", error);
    }
  };

  return (
    <div className="home-container">
      <div className="suggested-users">
        <SuggestedUsers />
      </div>
      <div className="feed-container">
        <div className="feed-content">
          <div className="feed-news-feed">
            <NewsCategories  
						setFilter={setFilter}
						setActiveCategory={setActiveCategory}
						/>
            <div className="feed-posts-container">
              {isPostSubmitting && !loading && <Spinner />}
              {posts.map((post) => (
                <div key={post.id} className="feed-post-item">
                  <div className="home-news-details">
                    <PostTitle
                      author={post.username}
                      publishedAt={post.created_at}
                      handleDeletePost={handleDeletePost}
                      postId={post.id}
                      userId={user?.id}
                      postUserId={post.user_id}
                    />

                    <div className="home-article-border">
                      <ExpandableText text={post.text} maxLength={33} />
                    </div>
                    {post.mediaurls && post.mediaurls.length > 0 && (
                      <div key={post.id} className="home-news-media">
                        <Slider {...sliderSettings}>
                          {post.mediaurls.map((url, index) => (
                            <div key={index}>
                              {url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mkv") ? (
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
                        {user && <LikeButton contentId={post.id} type="post" userId={user.id} />}
                        {user && <CommentButton contentId={post.id} userId={user.id} />}
                        {user && <ShareButton postId={post.id} userId={user?.id} />}
                      </div>
                      {user && <SavePostButton postId={post.id} userId={user.id} />}
                    </div>
                  </div>
                </div>
              ))}
              {loading && <Spinner />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommended;
