import { useEffect, useState } from "react";
import "./Blocked.scss";
import { supabase } from "../../../services/supabaseClient";
import Avatar from "../../Avatar/Avatar";

const Blocked = () => {
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlockedUsers = async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user) return;

    const { data, error } = await supabase
      .from("blocked_users")
      .select(
				"id, blocked_user_id, user_profiles!blocked_user_id(username, avatar_url)"
			)	
      .eq("user_id", user.user.id);

    if (error) {
      console.error("❌ Помилка завантаження заблокованих користувачів:", error);
    } else {
      setBlockedUsers(data);
    }
    setLoading(false);
  };

  const unblockUser = async (blockedUserId: string) => {
    const { error } = await supabase
      .from("blocked_users")
      .delete()
      .eq("blocked_user_id", blockedUserId);

    if (error) {
      console.error("❌ Помилка розблокування користувача:", error);
    } else {
      setBlockedUsers((prev) => prev.filter((user) => user.blocked_user_id !== blockedUserId));
			alert("Користувач успішно розблокований!");
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  if (loading) return <p>Завантаження...</p>;

  return (
    <>
      <h2 className="blocked-title">Заблоковані користувачі</h2>
      <div className="blocked-settings">
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <div key={user.id} className="blocked-user">
							<Avatar name={user.user_profiles.username} avatarUrl={user.user_profiles.avatar_url}/>
              <p>{user.user_profiles.username}</p>
              <button onClick={() => unblockUser(user.blocked_user_id)} className="unblock-btn">
                Розблокувати
              </button>
            </div>
          ))
        ) : (
          <p className="no-blocked">Немає заблокованих користувачів.</p>
        )}
      </div>
    </>
  );
};

export default Blocked;
