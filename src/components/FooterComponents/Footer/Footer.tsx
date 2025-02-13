import React from "react";
import "./Footer.scss";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="social-links">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>

        <div className="footer-links">
          <Link to="/privacy-policy">Політика конфіденційності</Link>
          <Link to="/terms-of-service">Умови використання</Link>
        </div>

        <div className="contact-info">
          <p>Зв'яжіться з нами: <a href="mailto:support@gamenet.com">support@gamenet.com</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
