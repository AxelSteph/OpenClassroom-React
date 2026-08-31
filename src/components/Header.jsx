import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

import "../styles/Header.css";
import logo from "../assets/argentBankLogo.png";

function Header() {
  return (
    <nav className="main-nav">
      <Link to="/" className="main-nav-logo">
        <img className="main-nav-logo-image" src={logo} alt="Argent Bank Logo" />
      </Link>
      <Link to="/sign-in" className="main-nav-item">
        <FontAwesomeIcon icon={faCircleUser} aria-hidden="true" />
        Sign In
      </Link>
    </nav>
  );
}

export default Header;