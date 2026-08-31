# MiniLend 🏦

### A Simple Crypto-Backed Lending dApp

MiniLend is a decentralized lending application that allows users to use **ETH as collateral to borrow a mock USD token (MockUSDT)**.

The project was built as a hands-on Web3 learning project using:

* **Solidity** — Smart contracts
* **Foundry** — Development, testing, and deployment
* **Anvil** — Local Ethereum blockchain
* **Viem** — Blockchain interaction
* **MetaMask** — Wallet connection
* **MockUSDT** — ERC-20 token used for lending experiments

> **Note:** MiniLend is an educational/demo project designed for learning and experimentation. It is not intended for production use or real funds.

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
| 📊 Local Testing     | Test everything on an Anvil blockchain       |

---

## 🏗️ How MiniLend Works

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
      │    ETH      │             │  MockUSDT   │
      │ Collateral  │             │    Token    │
      └─────────────┘             └─────────────┘
             │                           │
             └─────────────┬─────────────┘
                           ▼
                    ┌──────────────┐
                    │  Local Chain │
                    │    Anvil     │
                    └──────────────┘
```

### Typical user flow

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

Before running MiniLend, install the following:

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
* Local blockchain development

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
anvil --version
```

### ⚠️ Windows Users

If `forge` is pointing to the wrong installation, check which version is being used:

```bash
which forge
```

or on Windows:

```powershell
where.exe forge
```

Make sure the Foundry installation you expect is being used.

---

# ⛓️ 2. Start Anvil

Anvil provides a local Ethereum blockchain for development and testing.

Run:

```bash
anvil
```

You should see something similar to:

```text
Listening on 127.0.0.1:8545
```

Anvil will also provide several funded accounts.

Keep this terminal running.

> ⚠️ Do not close the Anvil terminal while testing MiniLend.

---

# 🔑 3. Configure Your Private Key

Anvil provides test private keys.

Copy one of the private keys shown in the Anvil terminal.

Create a `.env` file in the project root:

```env
PRIVATE_KEY=your_anvil_private_key
```

Example:

```env
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Important

* Do not add quotes.
* Do not add spaces around `=`.
* Never use a real wallet private key.
* Never commit `.env` to GitHub.

Your `.gitignore` should contain:

```gitignore
.env
```

---

# 📦 4. Install Project Dependencies

Clone the project:

```bash
git clone https://github.com/Osfoce/Mini-Lend_-Defi-project-.git
```

Enter the project:

```bash
cd Mini-Lend_-Defi-project-
```

Install the required dependencies according to the project's package configuration.

If using Foundry dependencies:

```bash
forge install
```

---

# 🔨 5. Build the Smart Contracts

Compile the contracts:

```bash
forge build
```

If compilation succeeds, you should see a successful build.

You can also run the test suite:

```bash
forge test
```

For more detailed output:

```bash
forge test -vv
```

---

# 🚀 6. Deploy the Contracts

MiniLend uses two main contracts:

### `MockUSDT.sol`

A mock ERC-20 token used for testing the lending system.

### `MiniLend.sol`

The main lending contract responsible for:

* ETH collateral
* Borrowing
* Repayment
* Withdrawals
* Loan-related logic

Deploy using the Foundry deployment script:

```bash
source .env

forge script script/Deploy.s.sol \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast \
  --private-key $PRIVATE_KEY
```

On Windows PowerShell, you may need to set the private key differently depending on your shell.

After deployment, save the addresses displayed by the script:

```text
Deployed MockUSDT at: 0x...
Deployed MiniLend at: 0x...
```

You will need these addresses in the frontend.

---

# 🦊 7. Connect Anvil to MetaMask

Open MetaMask and add a custom network.

Use:

| Setting         | Value                   |
| --------------- | ----------------------- |
| Network Name    | Anvil                   |
| RPC URL         | `http://127.0.0.1:8545` |
| Chain ID        | `31337`                 |
| Currency Symbol | ETH                     |

Save the network.

---

# 🔐 8. Import an Anvil Account

In MetaMask:

```text
MetaMask
   ↓
Account menu
   ↓
Add / Import Account
   ↓
Import private key
```

Paste the private key from your Anvil terminal.

You should now have an account funded with test ETH.

> ⚠️ Anvil accounts are for local development only. Never import a real wallet private key into a development environment.

---

# 🌐 9. Run the Frontend

MiniLend's original frontend is a static web application.

Do not open `index.html` directly if the application relies on JavaScript modules.

Instead, run a local server.

For example:

```bash
npx serve .
```

Or:

```bash
python3 -m http.server
```

Then open the local address provided by the server.

---

# 🔌 10. Connect Your Wallet

When the dApp loads:

1. Make sure Anvil is running.
2. Make sure MetaMask is connected to Anvil.
3. Click **Connect Wallet**.
4. Approve the MetaMask request.

You should see your connected wallet address.

Example:

```text
Connected: 0x643...345
```

### Important

The wallet should be connected **before initializing wallet-dependent contract clients**.

The application needs access to the connected account before performing wallet transactions.

---

# 📍 11. Load Contract Addresses

Enter the addresses generated during deployment:

```text
MiniLend Contract:
0x...

MockUSDT Contract:
0x...
```

Then select:

**Load Contracts**

If successful, the application should confirm that the contracts have been loaded.

---

# 🧪 12. Test MiniLend

## 🏦 Stake ETH

Enter an amount of ETH.

Example:

```text
1 ETH
```

Select:

**Stake**

Expected result:

* Your collateral balance increases.
* The MiniLend contract receives the ETH.
* Your wallet balance decreases by the staked amount plus gas.

---

## 💵 Borrow MockUSDT

After staking collateral, enter an amount within the allowed borrowing limit.

Select:

**Borrow**

Expected result:

* Your MockUSDT balance increases.
* Your borrowing position is updated.
* The transaction is recorded on the local blockchain.

---

## ✅ Approve MockUSDT

Before repaying, MiniLend needs permission to spend your MockUSDT.

Select:

**Approve**

Confirm the transaction in MetaMask.

---

## 💸 Repay Your Loan

Enter the amount you want to repay.

Select:

**Repay**

Confirm the transaction.

Your outstanding debt should decrease accordingly.

---

## 📤 Withdraw ETH

After your loan has been fully repaid, you can withdraw your collateral.

Select:

**Withdraw**

Expected result:

* Your staked ETH is returned.
* Your collateral balance decreases.
* The transaction is confirmed on Anvil.

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
├── index.html
├── script.js
└── abi/
```

Your exact frontend structure may change as the project evolves.

---

# 🔗 Contract Source

The MiniLend smart contracts can be found in the repository:

**MiniLend Contracts**

https://github.com/Osfoce/Mini-Lend_-Defi-project-/tree/main/src/contracts

---

# 🐛 Common Problems

| Problem                  | Possible Cause                      | Solution                            |
| ------------------------ | ----------------------------------- | ----------------------------------- |
| MetaMask doesn't open    | Frontend isn't running through HTTP | Use a local development server      |
| Contract won't load      | Wallet isn't connected              | Connect MetaMask first              |
| Balance shows `0`        | Wrong account or network            | Check MetaMask and Anvil            |
| Transaction fails        | Incorrect contract address          | Verify deployment output            |
| ABI error                | Incorrect ABI object                | Verify the ABI being passed to Viem |
| Insufficient funds       | Wrong Anvil account                 | Import a funded Anvil account       |
| Wrong chain              | MetaMask is on another network      | Switch to Anvil                     |
| Contract doesn't respond | Anvil isn't running                 | Start `anvil`                       |
| Deployment fails         | Private key/RPC configuration       | Check `.env` and RPC URL            |

---

# 🧪 Testing Checklist

Use this checklist when testing a fresh deployment:

* [ ] Start Anvil
* [ ] Create/configure `.env`
* [ ] Build contracts
* [ ] Run contract tests
* [ ] Deploy contracts
* [ ] Save MiniLend address
* [ ] Save MockUSDT address
* [ ] Add Anvil to MetaMask
* [ ] Import Anvil account
* [ ] Start frontend
* [ ] Connect wallet
* [ ] Load contracts
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
* Start Anvil
* Deploy contracts
* Debug smart contracts

### Wallet Integration

You learn how to:

* Connect MetaMask
* Work with wallet accounts
* Sign transactions
* Switch networks
* Handle transaction states

### Viem

You learn how a frontend can communicate with Ethereum-compatible networks.

---

# 🎯 Project Goals

MiniLend was created primarily for **learning and experimentation**.

The goal is to make it easier for someone new to Web3 to understand how the following pieces fit together:

```text
Solidity
   ↓
Foundry
   ↓
Anvil
   ↓
Deployed Contract
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

* [ ] React frontend migration
* [ ] Improved UX/UI
* [ ] Better transaction feedback
* [ ] Loan health indicators
* [ ] Collateral ratio visualization
* [ ] Transaction history
* [ ] Better error messages
* [ ] Responsive mobile interface
* [ ] Testnet deployment
* [ ] More comprehensive automated tests
* [ ] Improved contract security
* [ ] Production-grade oracle integration

> These improvements are intentionally separate from the current educational implementation.

---

# ⚠️ Disclaimer

MiniLend is an **educational project**.

It uses:

* A local Anvil blockchain
* Test ETH
* MockUSDT
* Experimental lending logic

It has **not been audited** and should not be used with real funds.

Do not deploy or use the contracts with real assets without appropriate security review, testing, and auditing.

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

If this project helps another developer understand how a Web3 application works from **smart contract → blockchain → wallet → frontend**, then it has achieved its purpose.

Keep building.
Keep learning.
Keep experimenting.

---

## ⭐ If You Find This Project Useful

Give the repository a ⭐ and feel free to explore the code.

Learning Web3 is a journey — build, break things, fix them, and keep going.

**Happy building!**

# MiniLend dApp 🏦

A Simple Crypto-Backed Lending System (Built with Solidity, Foundry, Viem & Anvil)

MiniLend is a decentralized lending application where users can:

✅ Stake ETH as collateral
✅ Borrow a mock USD token (MockUSDT) based on collateral value
✅ Repay borrowed tokens
✅ Withdraw their collateral

This project is designed with **learning and experimentation in mind**, especially for beginners entering the Web3 space.

---

## 🚀 Prerequisites

Before you begin, make sure you have the following installed:

### ✅ Foundry (Forge + Anvil)

Foundry is used for:

* Compiling smart contracts
* Running the local blockchain (Anvil)
* Deploying contracts using deployment scripts

Install Foundry:

```bash
curl -L https://foundry.paradigm.xyz | bash
```

Reload your terminal:

```bash
source ~/.bashrc
```

Install components:

```bash
foundryup
```

Verify:

```bash
forge --version
anvil --version
```
❗❗❗ If forge is showing error, it might be using zoe forge library and that is not what we want
run 
```bash
export PATH="$HOME/.foundry/bin:$PATH"
```
to change the path and confirm the forge with 
```bash
which forge
```
it should show 
```bash
/.foundry/bin/forge
```

---

## 🧱 Step 1: Start Anvil (Local Blockchain)

Anvil simulates a local Ethereum network with funded accounts.

Run:

```bash
anvil
```

You should see something like:

```
Listening on 127.0.0.1:8545
```

and a list of 10 private keys + addresses funded with 10,000 ETH.

✅ Keep this terminal running
❗ Do NOT close it

---

## 🔑 Step 2: Set Your Private Key

From the Anvil output, copy the first private key:

Example:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Create a `.env` file:

```
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

✅ No quotes
✅ No spaces

---

## 📦 Step 3: Deploy the Contracts

This project contains two contracts:

1. `MockUSDT.sol` – a mintable ERC20 token
2. `MiniLend.sol` – the lending logic

Deployment is done using a Foundry deploy script.

Run:

```bash
source .env
forge script script/Deploy.s.sol --rpc-url http://127.0.0.1:8545 --broadcast --private-key $PRIVATE_KEY
```

If successful, the output will show something like:

```
Deployed MockUSDT at: 0x....
Deployed MiniLend at: 0x....
```

✅ COPY both contract addresses
You will need them in the DApp

---

## 🦊 Step 4: Connect Anvil to MetaMask

Open MetaMask → top network dropdown → Add Network

Click:

**Add network manually**

Enter:

```
Network Name: Anvil
RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
```

Save. (Chrome browser preferable)

---

### ✅ Import a funded account

Click:

MetaMask → Account → Import Account

Paste the same private key from `.env`

Now MetaMask shows:

✅ Local network
✅ 10,000 ETH balance

---

## 🌐 Step 5: Run the DApp Frontend

If your frontend is static:

Open `index.html` in a browser

OR run a simple server:

```bash
npx serve .
```

or

```bash
python3 -m http.server
```

---

## 🪝 Step 6: Connect Wallet (IMPORTANT!)

Your dApp **must connect to MetaMask BEFORE loading contracts**

If you load contracts first:

❌ publicClient will not attach properly
❌ walletClient will have no account
❌ calls will fail

So:

1. Open the DApp
2. Click **Connect Wallet**
3. MetaMask will pop up
4. Accept connection

You should now see something like:

```
Connected: 0x643...345
```

---

## 🧳 Step 7: Load Contract Addresses

Paste:

✅ MiniLend contract address
✅ MockUSDT token address

Then click:

👉 Load Contracts

If successful:

```
Contracts loaded
```

---

## 🧪 Step 8: Test the dApp Features

Now you can interact:

### ✅ Stake ETH

Enter an amount (e.g. 1)

Click:

🟩 Stake

Expected:

* Your staked balance increases
* Contract ETH balance increases

---

### ✅ Borrow USD

Enter amount within LTV limit

Click:

🟨 Borrow

Expected:

* Your mock USDT balance increases
* Contract USDT decreases or mints

---

### ✅ Approve Spending

Before repaying, you must approve MiniLend to spend your USDT

Click:

🟦 Approve

---

### ✅ Repay Loan

Enter amount to repay

Click:

🟥 Repay

---

### ✅ Withdraw ETH

Only works when:

✅ You have fully repaid
✅ You have staked ETH

---

## 🧠 Common Mistakes & Fixes

| Problem              | Cause                                      | Fix                            |
| -------------------- | ------------------------------------------ | ------------------------------ |
| No MetaMask popup    | Not served with HTTP / module import error | Use local server               |
| Cannot load contract | Wallet not connected first                 | Connect wallet before load     |
| Balance shows 0      | Wrong address or wrong chain               | Check Anvil + MetaMask network |
| ABI invalid          | Importing wrong field                      | Use `abi: MiniLendAbi.abi`     |

---

## 📦 Project Structure

```
contracts/
  MiniLend.sol
  MockUSDT.sol

script/
  Deploy.s.sol

frontend/
  index.html
  script.js
  abi/
```

---

## ✅ What You Learned

By following this guide, you learned:

✅ How to run a local blockchain (Anvil)
✅ How deployment scripts work in Foundry
✅ How to connect MetaMask to a local chain
✅ How to connect a DApp to MetaMask using Viem
✅ How to interact with deployed contracts

This is the **exact journey every Web3 developer goes through**, and now you have a full working workflow.

---

## ❤️ Final Words

This project exists because:

> "I was once a newbie who couldn't do anything without detailed steps."

If this README helps even one developer avoid frustration, then it has achieved its purpose.

Keep building.
Keep learning.
Your progress is inspiring. 🚀🔥

---
