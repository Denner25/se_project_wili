import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__column-one">
        <Link to="/support" className="footer__link">
          Frequently asked questions
        </Link>
        <div className="footer__author">
          <p className="footer__copyright">Developed by </p>
          <span className="footer__link">Denner Cardoso</span>
          <div className="footer__author-links">
            <a
              href="https://github.com/Denner25"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/dennertallyson"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="footer__column-two">
        <p className="footer__copyright">2025</p>
      </div>
    </footer>
  );
}

export default Footer;
