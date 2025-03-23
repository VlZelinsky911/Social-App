import { FaUser, FaShieldAlt, FaBell, FaBan } from "react-icons/fa";
import "./SettingsProfile.scss";
import { useState } from "react";
import ProfileEdit from "./ProfileEdit/ProfileEdit";
import SecuritySettings from "./Security/Security";
import SettingsNotifications from "./Notifications/SettingsNotifications";
import Blocked from "./Blocked/Blocked";

function SettingsProfile() {
	const [isOpenProfile, setIsOpenProfile] = useState(false);
	const [isOpenSecurity, setIsOpenSecurity] = useState(false);
	const [isOpenNotification, setIsOpenNotification] = useState(false);
	const [isOpenBlocked, setIsOpenBlocked] = useState(false);


	const goToProfileEdit = () => {
		setIsOpenProfile(true);
		setIsOpenSecurity(false);
		setIsOpenNotification(false);
		setIsOpenBlocked(false);
	};
	const goToSecurity = () => {
		setIsOpenProfile(false);
		setIsOpenSecurity(true);
		setIsOpenNotification(false);
		setIsOpenBlocked(false);
	};
	const goToNotification = () => {
		setIsOpenProfile(false);
		setIsOpenSecurity(false);
		setIsOpenNotification(true);
		setIsOpenBlocked(false);
	};
	const goToBlocked = () => {
		setIsOpenProfile(false);
		setIsOpenSecurity(false);
		setIsOpenNotification(false);
		setIsOpenBlocked(true);
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
				<h2 onClick={goToBlocked}>
          <FaBan/> Заблоковані
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
			{isOpenBlocked && (
				<div className="settings__blocked">
					<Blocked/>
				</div>
			)}

		</div>
  );
}

export default SettingsProfile;
