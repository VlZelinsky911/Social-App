import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { differenceInHours, format, isToday, isYesterday, parseISO } from "date-fns";
import Avatar from "../Avatar/Avatar";
import "./Notifications.scss";
import { useNavigate } from "react-router-dom";
import { FaComment, FaHeart } from "react-icons/fa";

interface Notification {
  id: string;
  content_id: string;
  actor_id: string;
  type: "like" | "comment";
  created_at: string;
  is_read: boolean;
  username: string;
  avatar_url: string;
  comment_text?: string;
	mediaurls?: string
}
interface Props {
	notif: Notification;
  formatTime: (date: string) => string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeOffset, setTimeOffset] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase.rpc("get_notifications_with_comments", { user_uuid: userId });

      if (!error && data.length > 0) {
        const dbTime = new Date(data[0].created_at);
        const localTime = new Date();
        const offset = differenceInHours(localTime, dbTime);
        setTimeOffset(offset);

        setNotifications(
          data.map((notif: any) => ({
            ...notif,
            comment_text: notif.comment_text?.length > 50 ? `${notif.comment_text.substring(0, 50)}...` : notif.comment_text || "",
          }))
        );
      }
    };

    fetchNotifications();

    const subscription = supabase
      .channel("notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications" }, (payload: any) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const formatTime = (utcDate: string) => {
    const adjustedDate = new Date(utcDate);
    adjustedDate.setHours(adjustedDate.getHours() + timeOffset);
    return format(adjustedDate, "HH:mm");
  };

  const groupNotificationsByDate = () => {
    const today: Notification[] = [];
    const yesterday: Notification[] = [];
    const earlier: Notification[] = [];

    notifications.forEach((notif) => {
      const notifDate = parseISO(notif.created_at);

      if (isToday(notifDate)) {
        today.push(notif);
      } else if (isYesterday(notifDate)) {
        yesterday.push(notif);
      } else {
        earlier.push(notif);
      }
    });

    return { today, yesterday, earlier };
  };

  const { today, yesterday, earlier } = groupNotificationsByDate();

  return (
    <div className="notifications">
      <h2>Сповіщення</h2>

      {today.length > 0 && (
        <>
          <h3>Сьогодні</h3>
          {today.map((notif) => (
            <NotificationItem key={notif.id} notif={notif} formatTime={formatTime} />
          ))}
        </>
      )}

      {yesterday.length > 0 && (
        <>
          <h3>Вчора</h3>
          {yesterday.map((notif) => (
            <NotificationItem key={notif.id} notif={notif} formatTime={formatTime} />
          ))}
        </>
      )}

      {earlier.length > 0 && (
        <>
          <h3>Раніше</h3>
          {earlier.map((notif) => (
            <NotificationItem key={notif.id} notif={notif} formatTime={formatTime} />
          ))}
        </>
      )}

      {notifications.length === 0 && <p>Немає нових сповіщень</p>}
    </div>
  );
};

const NotificationItem: React.FC<Props> = ({ notif, formatTime }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/post/${notif.content_id}`);
  };

  return (
    <div className="notification" onClick={handleClick} style={{ cursor: "pointer" }}>
      <Avatar name={notif.username} avatarUrl={notif.avatar_url} />
      <div>
        <p>{notif.username || "Анонім"} {notif.type === "like" ? "лайкнув ваш пост" : `прокоментував: "${notif.comment_text}"`}</p>
        <span className="time">{formatTime(notif.created_at)}</span>
      </div>
			<div className="notification-type">
				<span>{notif.type === "like" ? <FaHeart /> : <FaComment />}</span>
			</div>
    </div>
  );
};

export default Notifications;
