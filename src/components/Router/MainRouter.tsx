import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";

import Footer from "../Footer/Footer";
import Main from "../Main/Main";

import Home from "../../pages/Home/Feed/Feed";
import Profile from "../../pages/Profile/Profile";

import PrivacyPolicy from "../../policies/PrivacyPolicy/PrivacyPolicy";
import TermsOfService from "../../policies/TermsOfService/TermsOfService";
import AboutMe from "../../policies/AboutMe/AboutMe";

import UserProfile from "../../pages/Home/UserProfile/UserProfile";
import UserRegistration from "../../pages/UserRegistration/UserRegistration";

import UserLogin from "../../pages/UserLogin/UserLogin";
import ForgotPassword from "../UserManagement/ForgotPasswordForm/ForgotPasswordForm";
import ResetPassword from "../UserManagement/ResetPasswordForm/ResetPassword";
import CompleteProfile from "../UserManagement/CompleteProfile/CompleteProfile";
import EditProfile from "../../pages/Profile/EditProfile/EditProfile";
import Header from "../Header/Header";
import Saved from "../Saved/Saved";
import Popular from "../Recommendations/Popular/Popular";
import Recommended from "../Recommendations/Recommended/Recommended";
import Notifications from "../Notifications/Notifications";
import PostPage from "../PostPage/PostPage";
import Chat from "../Chat/Chat";
import SettingsProfile from "../SettingsProfile/SettingsProfile";
function AppRoutes() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const isProfileComplete = useSelector(
    (state: RootState) => state.auth.isProfileComplete
  );

  const location = useLocation();
  const isCompleteProfilePage = location.pathname === "/complete-profile";

  return (
    <>
      {!isCompleteProfilePage && isAuthenticated && <Header />}

      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/register" element={<UserRegistration />} />
            <Route path="/login" element={<UserLogin />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            {!isProfileComplete ? (
              <>
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="*" element={<Navigate to="/complete-profile" />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Main />}>
                  <Route index element={<Home />} />
									<Route path="notifications" element={<Notifications />} />
                  <Route path="saved" element={<Saved/>} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms-of-service" element={<TermsOfService />} />
                  <Route path="about-us" element={<AboutMe />} />
                  <Route path="/profile/:username" element={<UserProfile />} />
                  <Route path="/popular" element={<Popular/>} />
                  <Route path="/recommended" element={<Recommended/>} />
                  <Route path="/settings" element={<SettingsProfile/>} />
                  <Route path="/post/:postId" element={<PostPage/>} />
                  <Route path="/chat/:conversationId" element={<Chat/>} />
                </Route>

                <Route path="/complete-profile" element={<Navigate to="/" />} />
              </>
            )}
          </>
        )}
      </Routes>

      {!isCompleteProfilePage && isAuthenticated && <Footer />}
    </>
  );
}

function MainRouter() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default MainRouter;
