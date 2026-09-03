# MiniLend Frontend — Technical Specification

**Document:** `technical-specification.md`  
**Project:** MiniLend  
**Document type:** Frontend/application technical specification  
**Status:** Initial implementation specification  
**Primary goal:** Rebuild the existing MiniLend HTML/Tailwind/JavaScript frontend as a polished React + TypeScript Web3 application while preserving the actual capabilities and rules of the deployed lending protocol.

---

## 1. Purpose

This document defines the technical requirements, architecture, user flows, UI/UX requirements, blockchain integration, data model, folder structure, transaction handling, error handling, testing strategy, and implementation order for the MiniLend frontend rebuild.

The specification is intentionally derived from the current MiniLend smart-contract source and ABI. The frontend must **not invent protocol capabilities that the contract does not currently support**.

The core principle is:

> **The smart contract is the source of truth. The React application is the interface and presentation layer.**

---

# 2. Product Overview

MiniLend is a decentralized lending application in which a user:

1. Connects an Ethereum-compatible wallet.
2. Deposits ETH as collateral.
3. Uses the USD value of that ETH as borrowing capacity.
4. Borrows an approved ERC-20 asset.
5. Monitors the collateral/debt position.
6. Repays the outstanding debt.
7. Withdraws ETH collateral after the debt has been fully repaid.

The protocol also supports permissionless liquidation of unhealthy positions and owner-controlled protocol configuration.

### Important current protocol limitation

The current contract stores one `User` position:

```solidity
struct User {
    address stakedAsset;
    uint256 stakedAmount;
    address debtAsset;
    uint256 debtAmount;
}
```

Therefore the current frontend must model the protocol as a **single-position lending system**, not as a multi-collateral/multi-debt protocol.

The current contract provides ETH staking through `stakeEth()`. It does **not** expose a generic ERC-20 collateral deposit function. Approved ERC-20 tokens are therefore treated as borrowable/pool assets in the current frontend.

---

# 3. Engineering Principles

## 3.1 Contract-first design

Every protocol feature must first be mapped to the corresponding contract function, state variable, event, or contract rule.

The frontend must not assume functionality merely because it would be common in DeFi applications.

## 3.2 Blockchain as source of truth

Protocol-critical values must ultimately come from the contract/blockchain.

Examples:

- user collateral
- user debt
- approved tokens
- token prices used by the protocol
- borrowing capacity
- protocol configuration
- contract liquidity
- ownership

Frontend calculations may be used for previews and UX, but contract execution remains authoritative.

## 3.3 Fail early in the UI

Known invalid actions should be detected before submitting a transaction.

Examples:

- zero amount
- insufficient wallet balance
- insufficient collateral
- borrowing above available capacity
- attempting to withdraw while debt remains
- attempting to repay the wrong asset
- insufficient token allowance

## 3.4 Never hide blockchain transaction states

Every write operation must expose meaningful states:

```text
Idle
→ Preparing
→ Awaiting wallet confirmation
→ Submitted
→ Confirming
→ Success
```

and:

```text
Rejected
Failed
```

must be handled separately.

## 3.5 Separation of concerns

The application should separate:

```text
Presentation
    ↓
Feature/business logic
    ↓
Web3 hooks
    ↓
Wagmi/Viem
    ↓
Smart contracts
```

React components should not contain arbitrary low-level contract calls throughout the codebase.

## 3.6 Minimal infrastructure

Do not introduce a backend, database, Redux, or other infrastructure until a concrete requirement justifies it.

---

# 4. Technology Stack

## 4.1 Required

| Technology | Purpose |
|---|---|
| React | Frontend application |
| TypeScript | Static typing |
| Vite | Development/build tooling |
| Tailwind CSS | UI styling |
| Wagmi | React Ethereum integration |
| Viem | Ethereum client and utility layer |
| RainbowKit | Wallet connection UI |
| TanStack Query | Async/query state and caching |
| Lucide React | Icons |

## 4.2 Likely additions

These should be introduced only when needed:

| Tool | Purpose |
|---|---|
| React Router | Client-side routing |
| Sonner | Toast/transaction notifications |
| Recharts | Protocol/position charts |
| Zod | Runtime validation |
| Testing Library | Component testing |
| Vitest | Unit testing |
| Playwright | End-to-end testing |

## 4.3 Not required for V1

- Express/Node backend
- MongoDB
- PostgreSQL
- Redis
- Redux
- custom authentication
- custom WebSocket server
- separate price API for protocol calculations

---

# 5. High-Level Architecture

## 5.1 V1 architecture

```text
┌─────────────────────────────────────────────┐
│                 React App                   │
│                                             │
│  Pages / Features / Components / UI        │
└──────────────────────┬──────────────────────┘
                       │
                Wagmi React hooks
                       │
                ┌──────▼──────┐
                │    Viem     │
                └──────┬──────┘
                       │
             Ethereum-compatible
                  blockchain
                       │
          ┌────────────┴────────────┐
          │                         │
     MiniLend Contract          ERC-20 Tokens
          │
       Chainlink
      Price Feeds
```

## 5.2 Future indexed architecture

A backend/database may be introduced later:

```text
Blockchain
    │
    │ contract events
    ▼
Indexer
    │
    ▼
PostgreSQL
    │
    ▼
Backend/API
    │
    ▼
React
```

This future layer is appropriate for:

- transaction history
- liquidation discovery
- protocol analytics
- historical charts
- user activity
- notifications
- aggregate statistics

It must not replace the blockchain as the protocol source of truth.

---

# 6. Protocol Model

## 6.1 User position

The contract stores:

```text
User
├── stakedAsset
├── stakedAmount
├── debtAsset
└── debtAmount
```

The current supported primary position is:

```text
ETH collateral
       ↓
Approved ERC-20 debt asset
```

## 6.2 Position lifecycle

```text
No Position
    │
    ▼
ETH Collateral Deposited
    │
    ▼
Collateralized Position
    │
    ▼
Debt Created
    │
    ├───────────────┐
    │               │
    ▼               ▼
Repay            Liquidatable
    │               │
    ▼               ▼
Debt = 0        Liquidation
    │
    ▼
Withdraw ETH
    │
    ▼
No Position
```

---

# 7. Protocol Parameters

The current contract defines:

| Parameter | Current value |
|---|---:|
| LTV | 50% |
| Liquidation threshold | 75% |
| Liquidation bonus | 5% |
| Close factor | 50% |
| Percentage denominator | 10,000 |
| WAD | `1e18` |
| ETH sentinel address | `0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE` |
| Maximum oracle staleness | 1 hour |

The frontend should **read configurable protocol values from the contract wherever exposed**, rather than hard-coding values that can be changed by the owner.

The liquidation threshold is currently a contract constant and therefore should be treated as a protocol constant unless the contract is upgraded.

---

# 8. Price Oracle Architecture

MiniLend uses Chainlink price feeds through the lending contract.

Relevant contract functionality includes:

```text
priceFeeds(token)
getLatestPrice(token)
getUsdValue(token, amount)
```

The frontend should therefore follow:

```text
Chainlink
    ↓
MiniLend
    ↓
getLatestPrice / getUsdValue
    ↓
React
```

The frontend must not use an unrelated third-party price API as the authority for borrowing or liquidation calculations.

## 8.1 Oracle error states

The UI must handle:

- missing/invalid price
- non-positive price
- stale price
- unfinalized feed data
- invalid feed decimals

Human-readable examples:

```text
"Price data is currently unavailable."
```

```text
"Market price data is stale. Please try again shortly."
```

---

# 9. Asset Model

The frontend must distinguish between:

## 9.1 Protocol data

Read from the blockchain:

- token address
- whether token is approved
- price feed
- current price
- contract token balance
- approved token count/list

## 9.2 UI metadata

Maintained by the application:

```ts
type AssetMetadata = {
  address: Address;
  symbol: string;
  name: string;
  decimals: number;
  logo?: string;
};
```

Token decimals must not be assumed to be 18.

ERC-20 metadata should be read using standard ERC-20 functions where appropriate:

```text
decimals()
symbol()
name()
balanceOf()
allowance()
```

---

# 10. Smart Contract Integration

## 10.1 Contract ABI

The MiniLend ABI must live in a dedicated contract module.

Suggested location:

```text
src/contracts/MiniLend/abi.ts
```

The ABI should preferably be generated/exported from the authoritative contract build artifact rather than manually maintained where possible.

## 10.2 Contract configuration

Suggested:

```text
src/contracts/MiniLend/config.ts
```

It should contain network-specific contract configuration such as:

```ts
export const MINI_LEND_ADDRESS = ...
```

Addresses must not be scattered through React components.

## 10.3 ERC-20 ABI

A reusable standard ERC-20 ABI should be maintained separately:

```text
src/contracts/ERC20/abi.ts
```

Required functions include:

```text
balanceOf
allowance
approve
decimals
symbol
name
```

---

# 11. Wallet Architecture

RainbowKit handles wallet connection.

Wagmi handles wallet/account state.

Required states:

```text
Disconnected
Connected
Wrong Network
Connecting
Switching Network
```

The header should expose:

- application branding
- network indicator
- connected wallet
- wallet address
- wallet balance where useful
- connect/disconnect controls

## 11.1 Wallet requirements

Before write operations:

1. Wallet must be connected.
2. User must be on the expected chain.
3. Required balance/allowance must be available.
4. Transaction parameters must be valid.

---

# 12. Network Configuration

The application must define supported chains explicitly.

Suggested location:

```text
src/config/chains.ts
```

The exact production/test network must be taken from the contract deployment configuration rather than guessed.

Environment configuration:

```env
VITE_LENDING_CONTRACT_ADDRESS=
VITE_CHAIN_ID=
VITE_WALLETCONNECT_PROJECT_ID=
```

If a custom RPC is required:

```env
VITE_RPC_URL=
```

`.env` must be ignored by Git.

`.env.example` must contain placeholders only.

---

# 13. Read-Only Data Requirements

The application must implement reusable hooks for protocol reads.

Suggested hooks:

```text
useUserPosition()
useUserBorrowableAmount()
useAssetPrice()
useAssetBalance()
useTokenAllowance()
useApprovedTokens()
usePoolBalance()
useProtocolConfig()
usePositionHealth()
useContractOwner()
```

Where contract methods expose the required information, they should be preferred over duplicating contract calculations.

Important reads include:

```text
getUser(user)
userPositionHealth(user)
_borrowableAmount(user, token)
getLatestPrice(token)
getUsdValue(token, amount)
getContractBalance(token)
ethBalance()
isTokenApproved(token)
getApprovedTokensCount()
owner()
```

---

# 14. Dashboard Specification

The dashboard is the primary authenticated application view.

## 14.1 Dashboard responsibilities

It should answer:

1. What collateral do I have?
2. How much is it worth?
3. How much debt do I have?
4. What asset is my debt?
5. How much can I still borrow?
6. How healthy is my position?
7. What actions can I take?

## 14.2 Dashboard sections

Suggested layout:

```text
Header
│
├── Portfolio/Position summary
│
├── Collateral card
│
├── Debt card
│
├── Borrowing power
│
├── Position health
│
├── Primary actions
│   ├── Deposit
│   ├── Borrow
│   ├── Repay
│   └── Withdraw
│
└── Activity / transaction area
```

## 14.3 Empty state

If:

```text
stakedAmount == 0
debtAmount == 0
```

show:

```text
"You don't have an active position yet."

[Deposit ETH]
```

---

# 15. Deposit ETH Flow

Contract function:

```solidity
stakeEth()
```

It is payable and requires a non-zero ETH amount.

## 15.1 Flow

```text
User clicks Deposit
        ↓
Deposit modal
        ↓
Enter ETH amount
        ↓
Validate amount
        ↓
Check wallet balance
        ↓
Confirm
        ↓
Wallet confirmation
        ↓
Transaction submitted
        ↓
Receipt confirmed
        ↓
Refresh position
```

## 15.2 UI

Show:

- ETH balance
- amount input
- USD estimate
- transaction fee warning where appropriate
- confirmation action

## 15.3 Validation

Reject:

```text
0 ETH
```

and amounts exceeding usable wallet balance.

Do not allow the UI to imply that arbitrary ERC-20 collateral can currently be deposited.

---

# 16. Borrow Flow

Contract function:

```solidity
borrowAsset(address token, uint256 amount)
```

## 16.1 Requirements

- active ETH collateral
- approved borrow token
- non-zero amount
- sufficient borrowing capacity
- sufficient pool liquidity
- valid price data

## 16.2 Borrowing calculation

Conceptually:

```text
Collateral USD Value × LTV
        =
Maximum Debt USD Value
```

Then:

```text
Maximum Available Debt
=
Maximum Debt
-
Current Debt
```

The contract performs the authoritative calculation through `_borrowableAmount()`.

## 16.3 Borrow UI

The UI must display:

```text
Available to borrow
Selected asset
Amount
Current collateral value
Current debt
New debt
LTV
Pool liquidity
```

## 16.4 Validation

Prevent:

```text
amount <= 0
amount > availableToBorrow
```

Also surface insufficient pool liquidity before submission when it can be read reliably.

---

# 17. Multiple Borrow Transactions

The contract increments `debtAmount` and assigns `debtAsset` on borrowing.

The current position model only supports one debt asset.

The frontend must therefore ensure the user cannot create an incompatible multi-debt position.

If the user already has debt in asset A, borrowing asset B should be treated as unsupported unless the contract explicitly permits it.

The UI should either:

- disable other debt assets, or
- show a clear explanation that the current position already has a debt asset.

This should be verified against the deployed contract behavior during implementation/testing.

---

# 18. Repayment Flow

Contract function:

```solidity
repayAsset(address token, uint256 repayAmount)
```

## 18.1 Flow

```text
User opens Repay
       ↓
Read current debt
       ↓
Select/lock debt asset
       ↓
Enter repayment amount
       ↓
Read ERC-20 allowance
       ↓
If allowance insufficient:
      Approve
       ↓
Confirm repayment
       ↓
Wallet
       ↓
Transaction
       ↓
Refresh position
```

## 18.2 Approval flow

ERC-20 repayment requires:

```text
allowance >= repayment amount
```

If not:

```text
Approve token
      ↓
Wait for approval receipt
      ↓
Repay
```

Approval and repayment must be presented as two understandable blockchain steps.

## 18.3 Full repayment

Provide a convenient:

```text
[Max]
```

action.

However, because the contract uses price-aware debt accounting, the frontend must not blindly assume that `debtAmount` can always be repaid with a simple fixed token-unit subtraction.

The contract remains authoritative.

## 18.4 Overpayment

The protocol explicitly rejects repayment above the outstanding USD debt.

Display:

```text
"You cannot repay more than the outstanding debt."
```

---

# 19. Withdraw Flow

Contract function:

```solidity
withdrawCollateralEth(uint256 amount)
```

## 19.1 Critical rule

The current contract requires:

```text
debtAmount == 0
```

before ETH collateral can be withdrawn.

Therefore:

```text
Debt > 0
    ↓
Withdraw disabled
    ↓
"Repay your debt before withdrawing collateral."
```

## 19.2 Flow

```text
Debt = 0
    ↓
Withdraw
    ↓
Enter amount
    ↓
Validate amount <= collateral
    ↓
Check contract ETH liquidity
    ↓
Confirm
    ↓
Wallet
    ↓
Transaction
    ↓
Refresh position
```

## 19.3 Full withdrawal

If all collateral is withdrawn, the contract clears the user's position.

The UI should transition back to the empty state.

---

# 20. Position Health

The application should expose a clear visual health representation.

The protocol has:

```text
LTV = 50%
Liquidation threshold = 75%
```

The frontend should explain the distinction:

```text
Current LTV
       │
       ├── below borrowing limit
       │
       └── liquidation threshold
```

The exact health value returned by the contract should be displayed according to its actual semantics. Do not relabel an arbitrary percentage as a conventional DeFi "health factor" unless the contract calculation supports that terminology.

Prefer labels such as:

```text
Current LTV
Liquidation threshold
Position status
```

until a precise health-factor definition is established.

---

# 21. Liquidation

Contract function:

```solidity
liquidate(address borrower, uint256 repayAmount)
```

A position is liquidatable when:

```text
borrowedUsdValue > collateralUsdValue × liquidationThreshold
```

The current liquidation threshold is 75%.

## 21.1 Close factor

The protocol caps repayment using the close factor.

Current value:

```text
50%
```

Therefore the frontend should calculate/display an estimated maximum liquidation repayment where possible.

## 21.2 Liquidation bonus

Current value:

```text
5%
```

The liquidator receives collateral based on the repayment value plus the liquidation bonus, subject to the contract's collateral/close-factor caps.

## 21.3 Liquidation approval

The liquidator must approve the debt token to the MiniLend contract before calling `liquidate()`.

Flow:

```text
Find unhealthy position
       ↓
Open liquidation modal
       ↓
Show borrower
Show collateral
Show debt
Show position status
Show maximum repayment
Show estimated collateral seized
       ↓
Approve debt token if needed
       ↓
Liquidate
```

---

# 22. Liquidation Discovery Problem

The contract stores users in:

```solidity
mapping(address => User)
```

Mappings are not enumerable.

The current contract does not provide a direct:

```text
getAllUsers()
getLiquidatablePositions()
```

function.

Therefore a fully automated:

```text
"Show every liquidatable borrower"
```

dashboard cannot be implemented reliably from contract reads alone.

## V1 options

1. Build a liquidation interface around a user-supplied borrower address.
2. Derive known addresses from relevant events where practical.
3. Keep the liquidation feature limited until an indexer is introduced.

## Future solution

```text
MiniLend events
      ↓
Indexer
      ↓
Database
      ↓
Liquidatable position discovery
```

This is a concrete future justification for backend/indexer infrastructure.

---

# 23. Markets Page

The markets page should represent **borrowable assets**, not collateral assets.

Suggested information:

```text
Asset
Price
Pool liquidity
Approved status
```

For each approved token:

```text
Token
Symbol
USD price
Pool balance
```

The approved-token list is derived from the contract's approved-token storage/list.

The page should not claim that every listed token can be deposited as collateral.

---

# 24. Admin Dashboard

Admin functionality must be isolated from normal user functionality.

Relevant owner-controlled operations include:

```text
approveToken()
revokeTokenApproval()
setFeed()
setltv()
setLiquidationBonus()
```

Ownership can be checked through:

```text
owner()
```

## 24.1 Admin access

```text
Connected wallet
      ↓
Read owner()
      ↓
Compare addresses
      ↓
Admin wallet?
   /       \
 Yes        No
 ↓           ↓
Show admin  Hide/restrict admin
```

## 24.2 Admin sections

### Protocol parameters

- LTV
- liquidation bonus
- close factor where contract exposes configuration

### Assets

- approved tokens
- revoke token
- add token

### Price feeds

- token
- feed address
- update feed

## 24.3 Admin safety

Destructive/configuration actions require:

- clear confirmation
- human-readable summary
- wallet confirmation
- transaction status
- success/failure feedback

---

# 25. Error Handling

The contract defines custom errors including:

```text
TransferFailed
TokenTransferFailed
BorrowLimitExceeded
OverPaymentNotSupported
NotEnoughCollateral
InvalidAsset
BorrowedAmountNotFullyRepaid
TokenAlreadyApproved
TokenNotApproved
InvalidPriceData
InsufficientPoolBalance
InvalidAddress
FeedDataNotFinalized
StalePriceData
NoCollateralProvided
InsufficientCollateral
InsufficientEthBalance
InvalidDecimals
BadBonus
InvalidCloseFactor
InvalidAmount
PositionHealthy
NoActivePosition
Badltv
```

The frontend should map known errors to user-friendly messages.

Example mapping:

| Contract error | UI message |
|---|---|
| `BorrowLimitExceeded` | You are trying to borrow more than your available borrowing capacity. |
| `InsufficientPoolBalance` | The pool does not currently have enough liquidity for this transaction. |
| `NoCollateralProvided` | Deposit ETH collateral before borrowing. |
| `NoActivePosition` | You do not have an active lending position. |
| `TokenNotApproved` | This asset is not currently supported for borrowing. |
| `OverPaymentNotSupported` | The repayment exceeds your outstanding debt. |
| `NotEnoughCollateral` | The withdrawal amount exceeds your available collateral. |
| `BorrowedAmountNotFullyRepaid` | Repay your outstanding debt before withdrawing collateral. |
| `PositionHealthy` | This position is not currently eligible for liquidation. |
| `StalePriceData` | Current oracle price data is stale. Try again later. |
| `FeedDataNotFinalized` | Current oracle data is not finalized. Try again later. |
| `InvalidAmount` | Enter an amount greater than zero. |

Unknown errors should fall back to a concise generic message while retaining technical details for debugging.

---

# 26. Transaction UX

Every write feature must use the same transaction pattern.

## 26.1 Standard state machine

```text
IDLE
  ↓
VALIDATING
  ↓
AWAITING_WALLET
  ↓
SUBMITTED
  ↓
CONFIRMING
  ↓
SUCCESS
```

Failure branches:

```text
AWAITING_WALLET
      ↓
USER_REJECTED
```

or:

```text
SUBMITTED
      ↓
TRANSACTION_FAILED
```

## 26.2 Confirmation UI

During confirmation:

```text
Processing transaction...

Your transaction has been submitted and is waiting
for blockchain confirmation.
```

A transaction hash should be made available through an explorer link where the network/explorer is known.

---

# 27. Data Refresh Strategy

After successful writes, refresh all dependent reads.

Example:

```text
Deposit success
    ↓
refresh:
    user position
    ETH balance
    collateral USD value
    borrowing capacity
    position health
```

Borrow success:

```text
refresh:
    user position
    debt balance
    pool liquidity
    borrowing capacity
```

Repay success:

```text
refresh:
    user position
    debt balance
    withdrawal eligibility
    position health
```

Withdraw success:

```text
refresh:
    user position
    ETH wallet balance
    collateral value
```

Wagmi/TanStack Query invalidation should be preferred over manually maintaining duplicate copies of blockchain state.

---

# 28. Frontend State Strategy

## Server/blockchain state

Use Wagmi/TanStack Query for:

- contract reads
- wallet state
- balances
- allowances
- transaction receipts

## Local UI state

React state is sufficient for:

- modal open/closed
- selected asset
- input values
- confirmation dialogs
- temporary form state

## Global state

Avoid introducing a global state library initially.

Only introduce one if a demonstrated application requirement makes local/query state insufficient.

---

# 29. Component Architecture

## 29.1 Shared UI

```text
Button
Input
Modal
Card
Badge
Tabs
Dropdown
Tooltip
Skeleton
Alert
Spinner
Progress
```

## 29.2 Wallet

```text
ConnectWallet
WalletButton
NetworkIndicator
AccountMenu
```

## 29.3 Protocol components

```text
PositionSummary
CollateralCard
DebtCard
BorrowingPowerCard
PositionHealth
AssetSelector
TransactionStatus
```

## 29.4 Feature components

```text
DepositModal
BorrowModal
RepayModal
WithdrawModal
LiquidationModal
```

---

# 30. Recommended Folder Structure

```text
mini-lend/
│
├── public/
│
├── docs/
│   └── technical-specification.md
│
├── src/
│   │
│   ├── app/
│   │   ├── App.tsx
│   │   ├── providers.tsx
│   │   └── routes.tsx
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── wallet/
│   │
│   ├── contracts/
│   │   ├── MiniLend/
│   │   │   ├── abi.ts
│   │   │   └── config.ts
│   │   │
│   │   └── ERC20/
│   │       └── abi.ts
│   │
│   ├── config/
│   │   ├── chains.ts
│   │   ├── wagmi.ts
│   │   └── env.ts
│   │
│   ├── features/
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── Dashboard.tsx
│   │   │
│   │   ├── collateral/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   │
│   │   ├── borrowing/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   │
│   │   ├── repayment/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   │
│   │   ├── liquidation/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── types.ts
│   │   │
│   │   └── admin/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── AdminDashboard.tsx
│   │
│   ├── hooks/
│   │   ├── useUserPosition.ts
│   │   ├── usePositionHealth.ts
│   │   ├── useBorrowableAmount.ts
│   │   ├── useAssetPrice.ts
│   │   ├── useTokenBalance.ts
│   │   └── useTokenAllowance.ts
│   │
│   ├── lib/
│   │   ├── errors.ts
│   │   ├── formatters.ts
│   │   ├── units.ts
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Markets.tsx
│   │   ├── Liquidations.tsx
│   │   └── Admin.tsx
│   │
│   ├── types/
│   │   ├── assets.ts
│   │   ├── protocol.ts
│   │   └── transactions.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

This structure is a starting point. Empty abstractions should not be created simply to make the tree look sophisticated.

---

# 31. Routing

Recommended initial routes:

```text
/
    Landing / protocol overview

/dashboard
    User lending position

/markets
    Borrowable assets and liquidity

/liquidations
    Liquidation interface

/admin
    Owner-only protocol management
```

The dashboard, markets, and liquidation pages should gracefully handle a disconnected wallet.

Admin should additionally verify ownership.

---

# 32. UI/UX Design Requirements

The redesign should feel like a modern DeFi application rather than a converted HTML page.

## 32.1 Design goals

- clear hierarchy
- minimal cognitive load
- obvious primary actions
- responsive layout
- mobile-friendly transaction flows
- strong visual feedback
- readable financial information
- consistent spacing
- consistent typography
- clear error states
- accessible controls

## 32.2 Primary action hierarchy

Dashboard primary actions:

```text
Deposit
Borrow
Repay
Withdraw
```

Liquidation actions should remain separate from normal borrowing flows.

## 32.3 Financial information

Always distinguish:

```text
Token amount
USD value
```

Example:

```text
1.25 ETH
≈ $3,210.40
```

Do not make users infer conversions.

## 32.4 Inputs

Amount inputs should support:

- decimal validation
- maximum button
- balance display
- USD equivalent
- invalid state
- insufficient balance state
- insufficient borrowing capacity state

---

# 33. Responsive Design

The application must work at minimum across:

```text
Mobile
Tablet
Desktop
```

On mobile:

- cards stack vertically
- modals fit the viewport
- transaction actions remain accessible
- wallet controls remain usable
- tables become cards or horizontally scroll where necessary

The dashboard should not require desktop width to understand the user's position.

---

# 34. Accessibility

The application must include:

- semantic HTML
- keyboard-accessible controls
- visible focus states
- appropriate labels
- accessible modal behavior
- readable contrast
- error messages associated with inputs
- non-color-only status indicators

Loading indicators should include text or accessible labels where appropriate.

---

# 35. Formatting and Numerical Safety

Blockchain values must remain as `bigint` or equivalent exact representations until formatting for display.

Do not use JavaScript floating-point arithmetic for protocol-critical values.

Use Viem utilities:

```text
parseUnits()
formatUnits()
```

where appropriate.

Important:

- token decimals vary
- ETH uses 18 decimals
- ERC-20 tokens may use different decimals
- USD values and token amounts must not be confused

The UI may use decimal numbers for display after safe conversion, but contract arguments must be constructed from exact integer values.

---

# 36. Security Requirements

The frontend is not a security boundary, but it must still follow secure Web3 practices.

## 36.1 Never expose private keys

No private key, seed phrase, or wallet secret belongs in:

```text
.env
source code
browser storage
database
```

## 36.2 Validate contract address

Use explicit network-specific addresses.

## 36.3 Validate chain

Do not silently send transactions on an unsupported network.

## 36.4 Do not trust frontend calculations

Borrowing capacity, liquidation eligibility, and balances must be enforced by the contract.

## 36.5 Avoid arbitrary transaction signing

Every wallet request should correspond to a clearly explained user action.

## 36.6 Handle stale oracle data

Do not encourage users to transact based on obviously stale protocol price data.

---

# 37. Backend and Database Decision

## V1

No backend.

No database.

Architecture:

```text
React
 ↓
Wagmi
 ↓
Viem
 ↓
MiniLend
 ↓
Blockchain
```

## V2 triggers

Introduce indexing/backend infrastructure only when we need one or more of:

- historical transaction history
- all-user position discovery
- automatic liquidation discovery
- aggregate protocol analytics
- historical price/TVL charts
- notifications
- off-chain application preferences
- searchable activity

## Recommended future stack

A future implementation could use:

```text
Indexer
+
PostgreSQL
+
Node.js API
```

The exact indexing solution should be selected when the requirement arises.

---

# 38. Event Architecture

Important contract events include:

```text
ltvUpdated
BonusUpdated
TokenRevoked
NewTokenApproved
PriceFeedUpdated
EthStaked
USDRepaid
USDBorrowed
ETHCollateralWithdrawn
Liquidation
```

V1 can rely primarily on transaction receipts and direct contract reads.

V2 can index events to build historical state.

---

# 39. Testing Strategy

Testing must happen at multiple levels.

## 39.1 Unit tests

Test:

- amount formatting
- token unit conversion
- percentage calculations
- UI validation
- error mapping
- display formatting

## 39.2 Hook/integration tests

Test:

- reading user position
- reading approved assets
- reading balances
- allowance handling
- write hooks
- transaction receipt handling

## 39.3 Contract integration tests

Against the actual deployed/test contract:

- stake ETH
- borrow
- repay
- withdraw
- liquidation
- admin functions

## 39.4 End-to-end tests

Critical user journeys:

### Deposit

```text
Connect
→ Deposit ETH
→ Confirm
→ Position updates
```

### Borrow

```text
Deposit
→ Borrow
→ Confirm
→ Debt appears
```

### Repay

```text
Debt exists
→ Approve
→ Repay
→ Debt updates
```

### Withdraw

```text
Debt = 0
→ Withdraw
→ Collateral decreases
```

### Invalid withdrawal

```text
Debt > 0
→ Withdraw
→ UI blocks action
```

---

# 40. Development Phases

## Phase 0 — Protocol verification

Before UI implementation:

- confirm deployed network
- confirm MiniLend contract address
- confirm token addresses
- confirm price feed addresses
- inspect actual deployed configuration
- test read functions
- verify protocol calculations

Deliverable:

```text
Verified protocol configuration
```

## Phase 1 — Project foundation

Set up:

```text
Vite
React
TypeScript
Tailwind
Wagmi
Viem
RainbowKit
TanStack Query
```

Implement:

- providers
- chain configuration
- wallet connection
- contract configuration
- environment validation

## Phase 2 — Read-only dashboard

Implement:

- user position
- collateral
- debt
- prices
- borrowing capacity
- position status

No writes initially.

## Phase 3 — ETH deposit

Implement complete deposit flow and transaction UX.

## Phase 4 — Borrow

Implement:

- asset selection
- borrowing capacity
- amount validation
- pool liquidity
- transaction
- refresh

## Phase 5 — Repay

Implement:

- debt display
- allowance
- approval
- repayment
- full/partial repayment
- refresh

## Phase 6 — Withdraw

Implement:

- debt-zero requirement
- amount validation
- ETH withdrawal
- refresh

## Phase 7 — Markets

Implement:

- approved tokens
- token metadata
- prices
- pool liquidity

## Phase 8 — Liquidation

Initially support known borrower/address-based liquidation.

Later add indexed discovery.

## Phase 9 — Admin

Implement owner verification and administrative controls.

## Phase 10 — UX polish

Improve:

- responsive design
- skeleton loading
- animations
- empty states
- error states
- notifications
- accessibility
- visual hierarchy

## Phase 11 — Optional indexing/backend

Only if required by product goals.

---

# 41. Implementation Order by Dependency

The following order should be followed to reduce rework:

```text
1. Protocol configuration
        ↓
2. Wagmi/RainbowKit setup
        ↓
3. Contract ABI/configuration
        ↓
4. Read hooks
        ↓
5. Dashboard
        ↓
6. ETH deposit
        ↓
7. Borrow
        ↓
8. ERC20 allowance/approval
        ↓
9. Repay
        ↓
10. Withdraw
        ↓
11. Markets
        ↓
12. Liquidation
        ↓
13. Admin
        ↓
14. History/analytics
        ↓
15. Optional backend/indexer
```

---

# 42. Definition of Done

The V1 frontend is complete when:

- [ ] React + TypeScript application runs cleanly.
- [ ] Wallet connection works through RainbowKit.
- [ ] Supported chain is detected/enforced.
- [ ] MiniLend contract is configured centrally.
- [ ] ERC-20 ABI/integration is reusable.
- [ ] User position can be read.
- [ ] ETH collateral can be deposited.
- [ ] Borrowable assets can be displayed.
- [ ] Borrowing capacity is displayed.
- [ ] Borrow transactions work.
- [ ] ERC-20 approval works.
- [ ] Repayment works.
- [ ] Withdrawal works after debt is cleared.
- [ ] Invalid actions are blocked in the UI.
- [ ] Contract errors are translated into useful messages.
- [ ] Transaction states are visible.
- [ ] Position data refreshes after successful transactions.
- [ ] Responsive UI works on mobile and desktop.
- [ ] Accessibility basics are implemented.
- [ ] No private keys/secrets are stored.
- [ ] No unnecessary backend/database exists.
- [ ] Tests cover critical calculations and user flows.
- [ ] Documentation explains setup and architecture.

---

# 43. Future Features

The following are intentionally outside the initial implementation unless requirements change:

### Portfolio/history

```text
Transaction history
Deposit history
Borrow history
Repayment history
Liquidation history
```

### Analytics

```text
TVL
Total borrowed
Pool utilization
Borrow volume
Liquidation volume
```

### Advanced liquidation

```text
Automatic unhealthy-position discovery
Liquidation opportunity ranking
Estimated liquidation profit
```

### Protocol improvements

If the smart contract is upgraded in the future, the frontend may support:

```text
Multiple collateral assets
Multiple debt assets
Interest rates
Accrued interest
Loan duration
More sophisticated health factors
```

These must not be implemented as frontend-only features. The protocol must support them first.

---

# 44. Known Protocol/Frontend Considerations

## 44.1 Single-position constraint

The UI must reflect the current one-collateral/one-debt-asset position model.

## 44.2 ETH collateral only

The current contract exposes `stakeEth()` for collateral. There is no generic ERC-20 collateral staking function in the supplied contract.

## 44.3 ERC-20 debt assets

Approved ERC-20 tokens form the current borrowable asset universe.

## 44.4 Oracle dependency

Borrowing, repayment accounting, and liquidation depend on current Chainlink-derived prices.

## 44.5 Liquidation discovery

A mapping of users cannot be enumerated directly, so a full liquidation market requires indexing infrastructure or another address-discovery mechanism.

## 44.6 Protocol configuration can change

The owner can change some protocol parameters and supported assets. The frontend should read mutable configuration rather than treating it as permanently hard-coded.

---

# 45. Recommended Application Mental Model

The final application should be designed around the user's position rather than around Solidity functions.

The user should think:

```text
My collateral
      ↓
My borrowing power
      ↓
My debt
      ↓
My position health
      ↓
My actions
```

not:

```text
stakeEth()
borrowAsset()
repayAsset()
withdrawCollateralEth()
```

The Solidity function names belong in the integration layer. The user experience should speak the language of lending.

---

# 46. Final Architecture Summary

```text
                           ┌──────────────────────┐
                           │      MiniLend UI     │
                           │ React + TypeScript   │
                           └──────────┬───────────┘
                                      │
                           ┌──────────▼───────────┐
                           │       Features       │
                           │ Dashboard / Borrow   │
                           │ Repay / Withdraw     │
                           │ Liquidation / Admin  │
                           └──────────┬───────────┘
                                      │
                           ┌──────────▼───────────┐
                           │    Web3 Hooks Layer   │
                           │   Wagmi + TanStack    │
                           └──────────┬───────────┘
                                      │
                           ┌──────────▼───────────┐
                           │        Viem           │
                           └──────────┬───────────┘
                                      │
                    ┌─────────────────▼─────────────────┐
                    │           Blockchain              │
                    │                                   │
                    │           MiniLend                │
                    │              │                    │
                    │      ┌───────┴────────┐           │
                    │      │                │           │
                    │ Chainlink          ERC-20         │
                    │ Price Feeds          Tokens       │
                    └───────────────────────────────────┘
```

Optional future:

```text
Blockchain
    ↓
Events
    ↓
Indexer
    ↓
PostgreSQL
    ↓
Backend API
    ↓
Analytics / History / Liquidation Discovery
```

---

# 47. Core Architectural Rule

The entire project should follow this rule:

> **Build the UI around what the protocol actually does, keep protocol truth on-chain, keep blockchain interaction isolated behind typed Web3 hooks, and introduce off-chain infrastructure only when a concrete product requirement demands it.**

This specification is the baseline for implementation. Any new idea introduced during development should be evaluated against the protocol capabilities, user value, security implications, architectural complexity, and whether it belongs on-chain, in the frontend, or in a future backend/indexing layer.
