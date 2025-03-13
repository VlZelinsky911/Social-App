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
import Categories from "../../pages/Categories/Categories";
import Favorites from "../../pages/Favorites/Favorites";
import Profile from "../../pages/Profile/Profile";

import PrivacyPolicy from "../../policies/PrivacyPolicy";
import TermsOfService from "../../policies/TermsOfService";
import UserProfile from "../../pages/Home/UserProfile/UserProfile";
import UserRegistration from "../../pages/UserRegistration/UserRegistration";

import UserLogin from "../../pages/UserLogin/UserLogin";
import ForgotPassword from "../UserManagement/ForgotPasswordForm/ForgotPasswordForm";
import ResetPassword from "../UserManagement/ResetPasswordForm/ResetPassword";
import CompleteProfile from "../UserManagement/CompleteProfile/CompleteProfile";
import EditProfile from "../../pages/Profile/EditProfile/EditProfile";
import Header from "../Header/Header";
import SuggestedUsers from "../SuggestedUsers/SuggestedUsers";
import Saved from "../Saved/Saved";

import Popular from "../Recommendations/Popular/Popular";
import Recommended from "../Recommendations/Recommended/Recommended";

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
                  <Route path="categories" element={<Categories />} />
                  <Route path="saved" element={<Saved/>} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="/profile/edit" element={<EditProfile />} />
                  <Route path="privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="terms-of-service" element={<TermsOfService />} />
                  <Route path="/profile/:username" element={<UserProfile />} />
                  <Route path="/popular" element={<Popular/>} />
                  <Route path="/recommended" element={<Recommended/>} />
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
