import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "../HeaderСomponents/Header/Header";
import Footer from "../FooterComponents/Footer/Footer";
import Main from "../MainComponents/Main";

import Home from "../../pages/Home/Feed/Feed";
import Categories from "../../pages/Categories/Categories";
import Favorites from "../../pages/Favorites/Favorites";
import Profile from "../../pages/Profile/Profile";

import PrivacyPolicy from "../../policies/PrivacyPolicy";
import TermsOfService from "../../policies/TermsOfService";
import UserProfile from "../../pages/Home/UserProfile/UserProfile";
import UserRegistration from "../../pages/UserRegistration/UserRegistration";

import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import UserLogin from "../../pages/UserLogin/UserLogin";
import ForgotPassword from "../UserManagement/ForgotPasswordForm/ForgotPasswordForm";
import ResetPassword from "../UserManagement/ResetPasswordForm/ResetPassword";

function MainRouter() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        {!isAuthenticated ? (
          <>
						<Route path="/reset-password" element={<ResetPassword/>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route path="/" element={<Main />}>
            <Route index element={<Home />} />
            <Route path="categories" element={<Categories />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="profile" element={<Profile />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms-of-service" element={<TermsOfService />} />
            <Route path="/profile/:username" element={<UserProfile />} />
          </Route>
        )}
      </Routes>
      {isAuthenticated && <Footer />}
    </Router>
  );
}

export default MainRouter;
