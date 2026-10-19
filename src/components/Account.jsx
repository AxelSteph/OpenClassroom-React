import { useState } from "react";

function Account({
  id,
  name,
  mask,
  balance,
  balanceType,
}) {
  const [isTransactionsOpen, setIsTransactionsOpen] =
    useState(false);
  const transactionsId = `transactions-${id}`;

  return (
    <section className="account">
      <div className="account-summary">
        <div className="account-content-wrapper">
          <h3 className="account-title">
            {name} (x{mask})
          </h3>

          <p className="account-amount">
            ${balance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="account-amount-description">
            {balanceType}
          </p>
        </div>

        <div className="account-content-wrapper cta">
          <button
            className="transaction-button"
            type="button"
            aria-expanded={isTransactionsOpen}
            aria-controls={transactionsId}
            onClick={() =>
              setIsTransactionsOpen((isOpen) => !isOpen)
            }
          >
            {isTransactionsOpen
              ? "Hide transactions"
              : "View transactions"}
          </button>
        </div>
      </div>

      <div
        className="transactions-panel"
        id={transactionsId}
        hidden={!isTransactionsOpen}
      >
        <h4>Transactions</h4>
      </div>
    </section>
  );
}

export default Account;