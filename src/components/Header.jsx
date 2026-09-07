import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

import logo from "../assets/argentBankLogo.png";
import "../styles/Header.css";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="main-nav">
      <Link className="main-nav-logo" to="/">
        <img
          className="main-nav-logo-image"
          src={logo}
          alt="Argent Bank"
        />
      </Link>

      <div>
        {isLoggedIn ? (
          <>
            {user && (
              <Link className="main-nav-item" to="/profile">
                {user.userName}
              </Link>
            )}
            <button
              className="main-nav-item logout-button"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link className="main-nav-item" to="/sign-in">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;