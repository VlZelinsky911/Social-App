import { useNavigate } from "react-router-dom";
import { FaUser, FaShieldAlt, FaBell } from "react-icons/fa";
import "./SettingsProfile.scss";
import { useState } from "react";
import { set } from "date-fns";
import EditProfile from "../../pages/Profile/EditProfile/EditProfile";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import SecuritySettings from "./Security/Security";
import Notifications from "../Notifications/Notifications";
import SettingsNotifications from "./Notifications/SettingsNotifications";

function SettingsProfile() {
	const [isOpenProfile, setIsOpenProfile] = useState(false);
	const [isOpenSecurity, setIsOpenSecurity] = useState(false);
	const [isOpenNotification, setIsOpenNotification] = useState(false);


	const goToProfileEdit = () => {
		setIsOpenProfile(true);
		setIsOpenSecurity(false);
		setIsOpenNotification(false);
	};
	const goToSecurity = () => {
		setIsOpenProfile(false);
		setIsOpenSecurity(true);
		setIsOpenNotification(false);
	};
	const goToNotification = () => {
		setIsOpenProfile(false);
		setIsOpenSecurity(false);
		setIsOpenNotification(true);
	};

  return (
    <div className="settings">
			<div className="settings__block">
				<h1>Налаштування</h1>
				<h2 onClick={goToProfileEdit}>
          <FaUser/> Профіль
        </h2>
				<h2 onClick={goToSecurity}>
          <FaShieldAlt/> Безпека
        </h2>
				<h2 onClick={goToNotification}>
          <FaBell/> Сповіщення
        </h2>
			</div>	
			{isOpenProfile && (
				<div className="settings__profile">
					<ProfileEdit/>
				</div>
			)}
			{isOpenSecurity && (
				<div className="settings__security">
					<SecuritySettings/>
				</div>
			)}
			{isOpenNotification && (
				<div className="settings__notification">
					<SettingsNotifications/>
				</div>
			)}

		</div>
  );
}

export default SettingsProfile;
