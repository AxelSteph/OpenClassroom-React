function Account({
  name,
  mask,
  balance,
  balanceType,
  onTransactions,
}) {
  return (
    <section className="account">
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
          onClick={onTransactions}
        >
          View transactions
        </button>
      </div>
    </section>
  );
}

export default Account;