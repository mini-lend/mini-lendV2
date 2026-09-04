# MiniLend 🏦

### A Simple Crypto-Backed Lending dApp

MiniLend is a decentralized lending application that allows users to use **ETH as collateral to borrow a mock USD token (MockUSDT)**.

The project was built as a hands-on Web3 learning project using:

* **Solidity** — Smart contracts
* **Foundry** — Development, testing, and deployment
* **Viem** — Blockchain interaction
* **MetaMask** — Wallet connection
* **MockUSDT** — ERC-20 token used for lending experiments

> **Note:** MiniLend is an educational/demo project designed for learning and experimentation. It has not been audited and should not be used with real funds.

---

## ✨ Features

| Feature              | Description                                  |
| -------------------- | -------------------------------------------- |
| 🔐 Wallet Connection | Connect your MetaMask wallet                 |
| 🏦 Stake ETH         | Deposit ETH as collateral                    |
| 💵 Borrow            | Borrow MockUSDT against your collateral      |
| ✅ Approve            | Approve MiniLend to spend MockUSDT           |
| 💸 Repay             | Repay your outstanding loan                  |
| 📤 Withdraw          | Withdraw collateral after repaying your loan |
| 📊 Position Tracking | Monitor collateral, debt, and lending health |
| 📈 Activity          | View lending activity and transactions       |

---

# 🏗️ How MiniLend Works

The basic lending flow is:

```text
                    ┌──────────────┐
                    │   MetaMask   │
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   MiniLend   │
                    │     dApp     │
                    └──────┬───────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      ┌─────────────┐             ┌─────────────┐
      │     ETH     │             │  MockUSDT   │
      │  Collateral │             │    Token    │
      └─────────────┘             └─────────────┘
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    ┌──────────────┐
                    │ Blockchain   │
                    │   Network    │
                    └──────────────┘
```

### Typical User Flow

```text
Connect Wallet
      ↓
Stake ETH
      ↓
Borrow MockUSDT
      ↓
Use MockUSDT
      ↓
Approve MiniLend
      ↓
Repay Loan
      ↓
Withdraw ETH
```

---

# 📋 Prerequisites

Before running MiniLend, make sure you have:

* [Foundry](https://book.getfoundry.sh/)
* MetaMask
* Node.js
* Git

You should also have a basic understanding of:

* Ethereum wallets
* Smart contracts
* ERC-20 tokens
* Solidity
* JavaScript
* Blockchain transactions
* Web3 development

---

# 🛠️ 1. Install Foundry

Foundry provides the tools used to compile, test, and deploy the smart contracts.

Install Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

Reload your terminal:

```bash
source ~/.bashrc
```

Then install the Foundry tools:

```bash
foundryup
```

Verify the installation:

```bash
forge --version
```

### Windows Users

If `forge` is pointing to the wrong installation, check which version is being used.

On Windows:

```powershell
where.exe forge
```

On Linux/macOS:

```bash
which forge
```

Make sure the Foundry installation you expect is being used.

---

# 🔑 2. Configure Your Environment

Create a `.env` file in the project root.

Depending on your deployment configuration, your environment variables may include your deployment private key and other required settings.

Example:

```env
PRIVATE_KEY=your_deployment_private_key
```

### ⚠️ Important

* Never use a private key containing real funds for development.
* Never commit `.env` to GitHub.
* Never share your private key.
* Use environment variables for sensitive configuration.

Your `.gitignore` should contain:

```gitignore
.env
```

---

# 📦 3. Clone the Project

Clone the repository:

```bash
git clone https://github.com/Osfoce/Mini-Lend_-Defi-project-.git
```

Enter the project:

```bash
cd Mini-Lend_-Defi-project-
```

Install the Foundry dependencies:

```bash
forge install
```

If the project contains frontend dependencies, install them according to the frontend package configuration.

---

# 🔨 4. Build the Smart Contracts

Compile the contracts:

```bash
forge build
```

If compilation succeeds, you should see a successful build.

Run the test suite:

```bash
forge test
```

For more detailed test output:

```bash
forge test -vv
```

---

# 🚀 5. Deploy the Contracts

MiniLend uses two primary contracts:

### `MockUSDT.sol`

A mock ERC-20 token used for testing and demonstrating the lending system.

### `MiniLend.sol`

The main lending contract responsible for:

* ETH collateral
* Borrowing
* Repayment
* Withdrawals
* Loan-related logic

Deploy using the project's Foundry deployment script.

Example:

```bash
source .env

forge script script/Deploy.s.sol \
  --rpc-url YOUR_RPC_URL \
  --broadcast \
  --private-key $PRIVATE_KEY
```

Replace:

```text
YOUR_RPC_URL
```

with the RPC endpoint for the network you are deploying to.

After deployment, save the contract addresses displayed by the deployment script:

```text
Deployed MockUSDT at: 0x...

Deployed MiniLend at: 0x...
```

You will need these addresses in the frontend.

---

# 🦊 6. Connect MetaMask

Open MetaMask and make sure it is connected to the **same blockchain network where the MiniLend contracts are deployed**.

Before using the application, verify:

* MetaMask is installed.
* Your wallet is connected.
* The correct network is selected.
* You are using the correct wallet account.
* The network supports the deployed MiniLend contracts.

> **Important:** Do not use a random network. The frontend and deployed contracts must use the same network.

---

# 🌐 7. Run the Frontend

If you are running the frontend locally, install the required dependencies first.

For a Node/Vite-based frontend:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

The terminal will provide a local URL, usually similar to:

```text
http://localhost:5173
```

Open that address in your browser.

---

# 🔌 8. Connect Your Wallet

When the MiniLend dApp loads:

1. Make sure MetaMask is installed.
2. Select the correct blockchain network.
3. Click **Connect Wallet**.
4. Approve the MetaMask connection request.
5. Confirm that your wallet address appears in the application.

Example:

```text
Connected: 0x643...345
```

### Important

The wallet should be connected before performing wallet-dependent transactions.

The application needs access to the connected account before it can:

* Sign transactions
* Stake ETH
* Borrow MockUSDT
* Approve tokens
* Repay loans
* Withdraw collateral

---

# 📍 9. Load Contract Addresses

The frontend needs the addresses of the deployed contracts.

You should configure:

```text
MiniLend Contract:

0x...

MockUSDT Contract:

0x...
```

Make sure these addresses correspond to the network currently selected in MetaMask.

If the wrong addresses are used, the application may fail to read balances or execute transactions.

---

# 🧪 10. Test MiniLend

Once your wallet is connected and the contracts are configured, you can test the lending workflow.

---

## 🏦 Stake ETH

Enter the amount of ETH you want to use as collateral.

Example:

```text
1 ETH
```

Select:

**Stake**

Confirm the transaction in MetaMask.

Expected result:

* Your collateral balance increases.
* The MiniLend contract receives the ETH.
* Your wallet balance decreases by the staked amount plus network fees.

---

## 💵 Borrow MockUSDT

After staking collateral, enter an amount within the allowed borrowing limit.

Select:

**Borrow**

Confirm the transaction.

Expected result:

* Your MockUSDT balance increases.
* Your borrowing position is updated.
* Your debt is reflected in the dashboard.

---

## ✅ Approve MockUSDT

Before repaying your loan, MiniLend needs permission to spend your MockUSDT.

Select:

**Approve**

Confirm the transaction in MetaMask.

The approval allows the MiniLend contract to transfer the approved amount of MockUSDT when you repay.

---

## 💸 Repay Your Loan

Enter the amount you want to repay.

Select:

**Repay**

Confirm the transaction.

Expected result:

* Your MockUSDT balance decreases.
* Your outstanding debt decreases.
* Your lending position is updated.

---

## 📤 Withdraw ETH

After your loan has been fully repaid, you can withdraw your collateral.

Select:

**Withdraw**

Confirm the transaction.

Expected result:

* Your collateral is returned.
* Your staked ETH balance decreases.
* Your wallet receives the withdrawn ETH.

---

# 🧩 Contract Architecture

MiniLend currently uses two primary contracts:

```text
contracts/

├── MiniLend.sol
└── MockUSDT.sol
```

Deployment:

```text
script/

└── Deploy.s.sol
```

Frontend:

```text
frontend/

├── ...
├── components/
├── pages/
└── ...
```

> The frontend structure may change as the project continues to evolve.

---

# 🔗 Contract Source

The MiniLend smart contracts can be found in the repository:

**MiniLend Contracts**

https://github.com/Osfoce/Mini-Lend_-Defi-project-/tree/main/src/contracts

---

# 🐛 Common Problems

| Problem                  | Possible Cause                           | Solution                                               |
| ------------------------ | ---------------------------------------- | ------------------------------------------------------ |
| MetaMask doesn't open    | Wallet connection issue                  | Check MetaMask installation and browser permissions    |
| Contract won't load      | Wallet or network is incorrect           | Connect wallet and select the correct network          |
| Balance shows `0`        | Wrong account or contract address        | Verify wallet and deployment addresses                 |
| Transaction fails        | Incorrect contract/network configuration | Check the contract address and selected network        |
| ABI error                | Incorrect ABI object                     | Verify the ABI being passed to Viem                    |
| Insufficient funds       | Wallet does not have enough native token | Fund the wallet appropriately for the selected network |
| Wrong chain              | MetaMask is connected to another network | Switch to the network where MiniLend is deployed       |
| Contract doesn't respond | RPC or contract configuration problem    | Check the RPC endpoint and contract address            |
| Deployment fails         | Private key/RPC configuration            | Check `.env`, RPC URL, and deployment settings         |

---

# 🧪 Testing Checklist

Use this checklist when testing a fresh deployment:

* [ ] Install Foundry
* [ ] Configure `.env`
* [ ] Build contracts
* [ ] Run contract tests
* [ ] Deploy contracts
* [ ] Save MiniLend contract address
* [ ] Save MockUSDT contract address
* [ ] Configure the frontend
* [ ] Start the frontend
* [ ] Connect MetaMask
* [ ] Select the correct network
* [ ] Load/configure contracts
* [ ] Stake ETH
* [ ] Borrow MockUSDT
* [ ] Approve MockUSDT
* [ ] Repay loan
* [ ] Withdraw ETH

---

# 📚 What This Project Teaches

MiniLend brings several Web3 concepts together in one project.

### Smart Contracts

You learn how to:

* Write Solidity contracts
* Work with ERC-20 tokens
* Manage collateral
* Implement borrowing logic
* Handle repayments
* Manage withdrawals

### Foundry

You learn how to:

* Compile contracts
* Run tests
* Deploy contracts
* Debug smart contracts
* Work with deployment scripts

### Wallet Integration

You learn how to:

* Connect MetaMask
* Work with wallet accounts
* Sign transactions
* Handle network selection
* Handle transaction states

### Viem

You learn how a frontend can communicate with Ethereum-compatible blockchain networks.

---

# 🎯 Project Goals

MiniLend was created primarily for **learning and experimentation**.

The goal is to make it easier for someone new to Web3 to understand how the following pieces fit together:

```text
Solidity
   ↓
Foundry
   ↓
Smart Contract
   ↓
Blockchain Network
   ↓
Viem
   ↓
MetaMask
   ↓
Frontend
   ↓
User Interaction
```

Instead of learning each technology separately, MiniLend connects them into one practical project.

---

# 🚧 Future Improvements

Possible improvements include:

* [ ] Improved UX/UI
* [ ] Better transaction feedback
* [ ] Loan health indicators
* [ ] Collateral ratio visualization
* [ ] Transaction history
* [ ] Better error messages
* [ ] Responsive mobile interface
* [ ] More comprehensive automated tests
* [ ] Improved contract security
* [ ] Production-grade oracle integration
* [ ] Multi-asset collateral
* [ ] Real-time market data
* [ ] Mainnet-ready architecture

> These improvements are separate from the current educational implementation.

---

# ⚠️ Disclaimer

MiniLend is an **educational project**.

It uses:

* Test/mock assets
* Experimental lending logic
* Smart contracts that have not been formally audited

The contracts have **not been audited** and should not be used with real funds.

Do not deploy or interact with the contracts using real assets without appropriate security review, testing, and auditing.

---

# ❤️ Why I Built MiniLend

I built MiniLend from the perspective of someone learning Web3.

When you're starting out, blockchain development can feel overwhelming because you have to understand many different pieces at once:

```text
Solidity
Foundry
Blockchain
Wallets
Viem
Frontend
Transactions
Tokens
```

MiniLend was my way of bringing those concepts together into one practical project.

> *I was once a newbie who couldn't do anything without detailed steps.*

If this project helps another developer understand how a Web3 application works from:

```text
Smart Contract
      ↓
Blockchain
      ↓
Wallet
      ↓
Frontend
      ↓
User Interaction
```

then it has achieved its purpose.

**Keep building.
Keep learning.
Keep experimenting.**

---

# ⭐ If You Find This Project Useful

Give the repository a ⭐ and feel free to explore the code.

Learning Web3 is a journey — build, break things, fix them, and keep going.

**Happy building! 🚀**
