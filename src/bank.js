function processBankAccount(input) {
  let summary = {
    accountNumber: null,
    accountHolder: null,
    currency: null,
    initialBalance: null,
    finalBalance: null,
    appliedTransactions: [],
    rejectedTransactions: []
  };

  try {
    // Clone input to avoid modification
    const data = JSON.parse(JSON.stringify(input));

    summary.accountNumber = data.accountNumber || "UNKNOWN";
    summary.accountHolder = data.accountHolder || "UNKNOWN";
    summary.currency = data.currency || "UNKNOWN";

    // Convert initial balance safely
    const openingBalance = Number(data.initialBalance);
    if (isNaN(openingBalance)) {
      throw new Error("Invalid initial balance");
    }

    summary.initialBalance = openingBalance;
    let balance = openingBalance;

    if (!Array.isArray(data.transactions)) {
      throw new Error("Transactions list missing");
    }

    data.transactions.forEach((txn, index) => {
      try {
        const type = txn?.type;
        const amount = Number(txn?.amount);

        if (!type) throw new Error("Transaction type missing");
        if (isNaN(amount)) throw new Error("Invalid amount");
        if (amount <= 0) throw new Error("Amount must be greater than zero");

        if (type === "Deposit") {
          balance += amount;
          summary.appliedTransactions.push({
            index,
            type,
            amount,
            balanceAfter: balance
          });
        } else if (type === "Withdraw") {
          if (amount > balance) {
            throw new Error("Insufficient balance");
          }
          balance -= amount;
          summary.appliedTransactions.push({
            index,
            type,
            amount,
            balanceAfter: balance
          });
        } else {
          throw new Error("Unknown transaction type");
        }

      } catch (txnError) {
        summary.rejectedTransactions.push({
          index,
          transaction: txn,
          reason: txnError.message
        });
      }
    });

    summary.finalBalance = balance;

  } catch (error) {
    summary.rejectedTransactions.push({
      transaction: null,
      reason: "System Error: " + error.message
    });
  } finally {
    console.log("✔ Audit Log: Transaction processing completed");
  }

  console.log("===== ACCOUNT SUMMARY =====");
  console.log("Account Number:", summary.accountNumber);
  console.log("Account Holder:", summary.accountHolder);
  console.log("Currency:", summary.currency);
  console.log("Initial Balance:", summary.initialBalance);
  console.log("Final Balance:", summary.finalBalance);
  console.log("Applied Transactions:", summary.appliedTransactions);
  console.log("Rejected Transactions:", summary.rejectedTransactions);

  return summary;
}
