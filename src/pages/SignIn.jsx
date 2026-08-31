import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "../features/auth/authSlice";

import "../styles/SignIn.css";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if (loginUser.fulfilled.match(result)) {
      navigate("/profile");
    }
  };

  return (
    <main className="sign-in-main">
      <section className="sign-in-content">
        <h1>Sign In</h1>

        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <label htmlFor="email">
              Username
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

          <div className="input-wrapper">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>

          <div className="input-remember">
            <input
              id="remember-me"
              type="checkbox"
            />

            <label htmlFor="remember-me">
              Remember me
            </label>
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            className="sign-in-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default SignIn;