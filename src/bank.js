// BankAccountProcessor.js

function processBankAccount(accountData) {
    let appliedTransactions = [];
    let rejectedTransactions = [];
    let initialBalance = 0;

    try {
        // Validate and convert initial balance
        initialBalance = Number(accountData.initialBalance);
        if (isNaN(initialBalance)) throw new Error("Invalid initial balance");

        let balance = initialBalance;

        // Process each transaction
        if (!Array.isArray(accountData.transactions)) {
            throw new Error("Transactions must be an array");
        }

        for (const tx of accountData.transactions) {
            try {
                if (!tx.type || !tx.amount) {
                    throw new Error("Missing transaction type or amount");
                }

                let amount = Number(tx.amount);
                if (isNaN(amount) || amount <= 0) {
                    rejectedTransactions.push({
                        ...tx,
                        reason: "Invalid or non-positive amount",
                    });
                    continue;
                }

                if (tx.type.toLowerCase() === "deposit") {
                    balance += amount;
                    appliedTransactions.push({ ...tx, newBalance: balance });
                } else if (tx.type.toLowerCase() === "withdraw") {
                    if (amount > balance) {
                        rejectedTransactions.push({
                            ...tx,
                            reason: "Insufficient balance",
                        });
                        continue;
                    }
                    balance -= amount;
                    appliedTransactions.push({ ...tx, newBalance: balance });
                } else {
                    rejectedTransactions.push({ ...tx, reason: "Unknown transaction type" });
                }
            } catch (err) {
                rejectedTransactions.push({ ...tx, reason: "System Error: " + err.message });
            }
        }

        // Final account summary
        console.log("===== Account Summary =====");
        console.log("Account Number:", accountData.accountNumber);
        console.log("Account Holder:", accountData.accountHolder);
        console.log("Currency:", accountData.currency);
        console.log("Initial Balance:", initialBalance);
        console.log("Final Balance:", balance);
        console.log("Applied Transactions:", appliedTransactions);
        console.log("Rejected Transactions:", rejectedTransactions);

    } catch (error) {
        console.error("System Error:", error.message);
    } finally {
        console.log("Bank account processing completed ✅");
    }
}

// Example usage
const account = {
    accountNumber: "123456789",
    accountHolder: "John Doe",
    currency: "USD",
    initialBalance: "1000",
    transactions: [
        { type: "Deposit", amount: "500" },
        { type: "Withdraw", amount: "2000" }, // should be rejected
        { type: "Withdraw", amount: "300" },
        { type: "Deposit", amount: "-100" }, // should be rejected
        { type: "Transfer", amount: "100" }, // unknown type
        { type: "", amount: "50" }, // missing type
        { amount: "100" } // missing type
    ]
};

processBankAccount(account);
