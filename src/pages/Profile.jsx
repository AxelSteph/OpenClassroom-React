import { useEffect, useState } from "react";
import {
  useDispatch,
  useSelector,
} from "react-redux";
import { useNavigate } from "react-router-dom";

import Account from "../components/Account";

import {
  fetchUserProfile,
  updateUserName,
} from "../features/auth/authSlice";

import {
  fetchAccounts,
} from "../features/accounts/accountsSlice";

import "../styles/Profile.css";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector(
    (state) => state.auth
  );

  const {
    accounts,
    loading,
    error,
  } = useSelector(
    (state) => state.accounts
  );

  const [isEditing, setIsEditing] =
    useState(false);

  const [userName, setUserName] =
    useState("");

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchAccounts());
  }, [dispatch]);

  const handleSave = async (event) => {
    event.preventDefault();

    const result = await dispatch(
      updateUserName(userName)
    );

    if (
      updateUserName.fulfilled.match(result)
    ) {
      setIsEditing(false);
    }
  };

  const handleTransactions = (
    accountId
  ) => {
    navigate(
      `/accounts/${accountId}/transactions`
    );
  };

  return (
    <>
      <main className="profile-main">

        <div className="profile-header">
          <h1>
            Welcome back
            <br />

            {user?.firstName}{" "}
            {user?.lastName}!
          </h1>

          {!isEditing ? (
            <button
              className="edit-button"
              onClick={() => {
                setUserName(user?.userName || "");
                setIsEditing(true);
              }}
            >
              Edit Name
            </button>
          ) : (
            <form
              className="edit-form"
              onSubmit={handleSave}
            >
              <input
                type="text"
                value={userName}
                onChange={(event) =>
                  setUserName(
                    event.target.value
                  )
                }
              />

              <button type="submit">
                Save
              </button>

              <button
                type="button"
                onClick={() =>
                  setIsEditing(false)
                }
              >
                Cancel
              </button>
            </form>
          )}
        </div>

        {loading && (
          <p className="status">
            Loading accounts...
          </p>
        )}

        {error && (
          <p className="profile-error">
            {error}
          </p>
        )}

        <div className="accounts-container">

          {accounts.map((account) => (
            <Account
              key={account.id}
              name={account.name}
              mask={account.mask}
              balance={account.balance}
              balanceType={
                account.balanceType
              }
              onTransactions={() =>
                handleTransactions(
                  account.id
                )
              }
            />
          ))}

        </div>
      </main>
    </>
  );
}

export default Profile;