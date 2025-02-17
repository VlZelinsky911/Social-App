import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../HeaderСomponents/Header/Header";
import Footer from "../FooterComponents/Footer/Footer";
import Main from "../MainComponents/Main";

import Home from "../../pages/Home/Feed/Feed";
import Categories from "../../pages/Categories/Categories";
import Favorites from "../../pages/Favorites/Favorites";
import Profile from "../../pages/Profile/Profile";

import PrivacyPolicy from "../../policies/PrivacyPolicy";
import TermsOfService from "../../policies/TermsOfService";


function MainRouter() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />}>
          <Route index element={<Home />} />
          <Route path="categories" element={<Categories />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<Profile />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default MainRouter;

