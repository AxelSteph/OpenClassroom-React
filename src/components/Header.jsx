import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  logout,
} from "../features/auth/authSlice";

import logo from "../assets/argentBankLogo.png";

import "../styles/Header.css";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isLoggedIn,
    user,
  } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="main-nav">

      <Link
        className="main-nav-logo"
        to="/"
      >
        <img
          src={logo}
          className="main-nav-logo-image"
          alt="Argent Bank"
        />
      </Link>

      <div className="header-user">

        {isLoggedIn ? (
          <>
            <Link
              to="/profile"
              className="main-nav-item"
            >
              ◉ {user?.firstName}
            </Link>

            <button
              className="main-nav-item logout-button"
              onClick={handleLogout}
            >
              ↪ Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/sign-in"
            className="main-nav-item"
          >
            ◉ Sign In
          </Link>
        )}

      </div>
    </header>
  );
}

export default Header;