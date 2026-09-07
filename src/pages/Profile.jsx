import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchUserProfile,
  updateUserName,
} from "../features/auth/authSlice";

import "../styles/Profile.css";

function Profile() {
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector(
    (state) => state.auth
  );

  const [isEditing, setIsEditing] = useState(false);
  const [newUserName, setNewUserName] = useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      updateUserName(newUserName)
    );

    if (updateUserName.fulfilled.match(result)) {
      setIsEditing(false);
    }
  };

  if (loading && !user) {
    return (
      <main className="profile-main">
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <section className="profile-main">
      {error && (
        <p className="profile-error">
          {error}
        </p>
      )}

      {user && (
        <div className="profile-header">
          <h1>
            Welcome back
            <br />
            {user.firstName} {user.lastName}!
          </h1>

          {!isEditing ? (
            <button
              className="edit-button"
              onClick={() => {
                setNewUserName(user.userName);
                setIsEditing(true);
              }}
            >
              Edit Name
            </button>
          ) : (
            <form
              className="edit-form"
              onSubmit={handleSubmit}
            >
              <div>
                <label htmlFor="username">
                  User name:
                </label>

                <input
                  id="username"
                  type="text"
                  value={newUserName}
                  onChange={(event) =>
                    setNewUserName(event.target.value)
                  }
                />
              </div>

              <div>
                <label htmlFor="firstname">
                  First name:
                </label>

                <input
                  id="firstname"
                  type="text"
                  value={user.firstName}
                  disabled
                />
              </div>

              <div>
                <label htmlFor="lastname">
                  Last name:
                </label>

                <input
                  id="lastname"
                  type="text"
                  value={user.lastName}
                  disabled
                />
              </div>

              <div className="edit-buttons">
                <button type="submit">
                  Save
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNewUserName(user.userName);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </section>
  );
}

export default Profile;