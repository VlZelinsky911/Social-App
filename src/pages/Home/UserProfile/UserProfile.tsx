import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks/hooks";
import { useEffect } from "react";
import { setUser } from "../../../features/user/userSlice";
import Avatar from "../../../components/AvatarComponents/Avatar";

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username?: string }>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(
      setUser({
        username: username || null,
        avatar: "",
      })
    ),
      [username, dispatch];
  });

  return (
    <div>
      <Avatar name={user.username} avatarUrl={user.avatar} />
      <h1>Профіль користувача: @{user.username}</h1>
    </div>
  );
};

export default UserProfile;
