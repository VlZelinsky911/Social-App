import { useNavigate } from "react-router-dom";
import { FaUser, FaShieldAlt, FaBell } from "react-icons/fa";
import "./SettingsProfile.scss";

function SettingsProfile() {
	const navigate = useNavigate();

	const goToProfileEdit = () => {
		navigate("/profile/edit");
	};

  return (
    <div className="settings">
			<div className="settings__block">
				<h1>Налаштування</h1>
				<h2 onClick={goToProfileEdit}>
          <FaUser style={{ marginRight: "8px" }} /> Профіль
        </h2>
				<h2>
          <FaShieldAlt style={{ marginRight: "8px" }} /> Безпека
        </h2>
				<h2>
          <FaBell style={{ marginRight: "8px" }} /> Сповіщення
        </h2>
			</div>	
		</div>
  );
}

export default SettingsProfile;
