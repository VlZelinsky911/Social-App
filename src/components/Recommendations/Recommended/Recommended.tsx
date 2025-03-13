import React, { useEffect, useState, useRef, useCallback } from "react";
import SuggestedUsers from "../../../components/SuggestedUsers/SuggestedUsers";
import { supabase } from "../../../services/supabaseClient";
import PostTitle from "../../../pages/Home/Feed/FeedComponents/PostTitle/PostTitle";
import Spinner from "../../../pages/Home/Feed/FeedComponents/Spinner/Spinner";
import LikeButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/LikeButton/LikeButton";
import CommentButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/CommentButton/CommentButton";
import ShareButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/SendButton/ShareButton";
import SavePostButton from "../../../pages/Home/Feed/FeedComponents/InteractionButtons/SavePostButton/SavePostButton";
import { NewsCategories } from "../../../pages/Home/Feed/FeedComponents/NewsCategories/NewsCategories";

interface Post {
  id: number;
  text: string;
  mediaurls?: string[];
  created_at: string;
  username: string;
}

const Recommended: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("all");
  const [activeCategory, setActiveCategory] = useState<string>("Стрічка");
  const [user, setUser] = useState<any>(null);
  const pageRef = useRef<number>(1);
  const canLoadMore = useRef<boolean>(true);
  const [isPostSubmitting, setIsPostSubmitting] = useState(false);

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
	
		const { data, error } = await supabase
			.from("posts")
			.select("id, text, mediaurls, created_at, user_id, user_profiles(username), comments_count")
			.order("comments_count", { ascending: false }) 
			.order("created_at", { ascending: false })
			.range((pageRef.current - 1) * 5, pageRef.current * 5 - 1);
	
		if (error) {
			console.error("Помилка завантаження постів:", error);
		} else {
			if (data.length > 0) {
				const formattedData = data.map((post: any) => ({
					...post,
					username: post.user_profiles?.username || "Анонім",
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
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 10 &&
        !loading
      ) {
        fetchPosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

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
              {isPostSubmitting && <Spinner />}
              {posts.map((post) => (
                <div key={post.id} className="feed-post-item">
                  <div className="home-news-details">
                    <PostTitle author={post.username} publishedAt={post.created_at} />
                    <div className="home-article-border">
                      <p>{post.text}</p>
                    </div>
                    {post.mediaurls && post.mediaurls.length > 0 && (
                      <img src={post.mediaurls[0]} alt="Медіа" />
                    )}
                    <div className="home-news-actions">
                      <div className="home-likes-comments">
                        {user && <LikeButton contentId={post.id} type="post" userId={user.id} />}
                        {user && <CommentButton contentId={post.id} userId={user.id} />}
                        <ShareButton />
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