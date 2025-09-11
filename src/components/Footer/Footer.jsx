import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__column-one">
        <Link to="/support" className="footer__link">
          Frequently asked questions
        </Link>
        <p className="footer__copyright">Developed by Denner Cardoso</p>
      </div>
      <div className="footer__column-two">
        <p className="footer__copyright">2025</p>
      </div>
    </footer>
  );
}

export default Footer;
