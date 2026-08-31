import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

import "../styles/SignIn.css";

function SignIn() {
  return (
    <div className="app">
      <main className="sign-in-main">
        <section className="sign-in-content">
          <FontAwesomeIcon
            className="sign-in-icon"
            icon={faCircleUser}
            aria-hidden="true"
          />

          <h1>Sign In</h1>

          <form>
            <div className="input-wrapper">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" />
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" />
            </div>

            <div className="input-remember">
              <input type="checkbox" id="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>

            <button className="sign-in-button" type="submit">
              Sign In
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default SignIn;