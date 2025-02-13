import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../HeaderСomponents/Header/Header";
import Footer from "../FooterComponents/Footer/Footer";

import Home from "../PageСomponents/Home/Home";
import Categories from "../PageСomponents/Categories/Categories";
import Favorites from "../PageСomponents/Favorites/Favorites";
import Profile from "../PageСomponents/Profile/Profile";
import PrivacyPolicy from "../FooterComponents/Footer/Docs/PrivacyPolicy";
import TermsOfService from "../FooterComponents/Footer/Docs/TermsOfService";

function MainRouter() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
        </Routes>
				<Footer/>
      </Router>
    </>
  );
}
export default MainRouter;
