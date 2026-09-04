import { parseEther, formatEther, formatUnits } from "viem";
import { LENDING_ABI } from "../utils/contractAbi";
import { CONTRACT_ADDRESSES } from "../utils/chains.address";

/**
 * Get contract address dynamically
 */
export const getLendingContract = (chainId) => {
  return CONTRACT_ADDRESSES[chainId]?.mLend;
};

/**
 * Stake ETH as collateral
 */
export const prepareStakeEthTx = ({ amount, account, chainId }) => {
  const address = getLendingContract(chainId);
  const amountWei = parseEther(amount.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "stakeEth",
    args: [],
    account,
    value: amountWei, // ETH to stake
  };
};

/**
 * Borrow an asset
 */
export const prepareBorrowTx = ({ tokenAddress, amount, account, chainId }) => {
  const address = getLendingContract(chainId);
  const amountWei = parseEther(amount.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "borrowAsset",
    args: [tokenAddress, amountWei],
    account,
  };
};

/**
 * Repay a borrowed asset
 */
export const prepareRepayTx = ({ tokenAddress, amount, account, chainId }) => {
  const address = getLendingContract(chainId);
  const amountWei = parseEther(amount.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "repayAsset",
    args: [tokenAddress, amountWei],
    account,
  };
};

/**
 * Withdraw ETH collateral
 */
export const prepareWithdrawCollateralTx = ({ amount, account, chainId }) => {
  const address = getLendingContract(chainId);
  const amountWei = parseEther(amount.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "withdrawCollateralEth",
    args: [amountWei],
    account,
  };
};

/**
 * Liquidate a position
 */
export const prepareLiquidationTx = ({
  borrower,
  repayAmount,
  account,
  chainId,
}) => {
  const address = getLendingContract(chainId);
  const repayWei = parseEther(repayAmount.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "liquidate",
    args: [borrower, repayWei],
    account,
  };
};

/**
 * prepareAddSupportedTokenTx
 */
export const prepareApproveTokenTx = ({ tokenAddress, account, chainId }) => {
  const address = getLendingContract(chainId);

  return {
    address,
    abi: LENDING_ABI,
    functionName: "approveToken",
    args: [tokenAddress],
    account,
  };
};

/**
 * Revoke token approval
 */
export const prepareRevokeTokenTx = ({ tokenAddress, account, chainId }) => {
  const address = getLendingContract(chainId);

  return {
    address,
    abi: LENDING_ABI,
    functionName: "revokeTokenApproval",
    args: [tokenAddress],
    account,
  };
};

/**
 * Set price feed for a token (owner only)
 */
export const prepareSetFeedTx = ({
  tokenAddress,
  feedAddress,
  account,
  chainId,
}) => {
  const address = getLendingContract(chainId);

  return {
    address,
    abi: LENDING_ABI,
    functionName: "setFeed",
    args: [tokenAddress, feedAddress],
    account,
  };
};

/**
 * Set LTV ratio (owner only)
 */
export const prepareSetLtvTx = ({ ltv, account, chainId }) => {
  const address = getLendingContract(chainId);
  const ltvWei = parseEther(ltv.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "setltv",
    args: [ltvWei],
    account,
  };
};

/**
 * Set liquidation bonus (owner only)
 */
export const prepareSetLiquidationBonusTx = ({ bonus, account, chainId }) => {
  const address = getLendingContract(chainId);
  const bonusWei = parseEther(bonus.toString());

  return {
    address,
    abi: LENDING_ABI,
    functionName: "setLiquidationBonus",
    args: [bonusWei],
    account,
  };
};

/**
 * Read functions
 */

/**
 * Get user position
 */
export const getUserPosition = async ({
  userAddress,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);
  // console.log(
  //   "From lendingService.js, getUserPosition, userAddress and contract address:",
  //   userAddress,
  //   "contract address:",
  //   address,
  //   "on chain:",
  //   chainId,
  //   "with public client:",
  //   publicClient,
  // );

  const result = await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "getUser",
    args: [userAddress],
  });

  return {
    stakedAsset: result[0],
    stakedAmount: result[1], // apply format ether here
    debtAsset: result[2],
    debtAmount: result[3], // apply format ether here
  };
};

/**
 * Get user position health
 */
// check for actual function name an the exact deployed contract
export const getUserHealth = async ({ userAddress, chainId, publicClient }) => {
  const address = getLendingContract(chainId);

  const health = await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "userPositionHealth",
    args: [userAddress],
  });

  return health;
};

/**
 * Get token price
 */
export const getTokenPrice = async ({
  tokenAddress,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);

  const price = await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "getLatestPrice",
    args: [tokenAddress],
  });

  return formatEther(price);
};

/**
 * Get USD value of token amount
 */
export const getUsdValue = async ({
  tokenAddress,
  amount,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);
  const amountWei = parseEther(amount.toString()); // use parseUnits(amount.toString(), tokenDecimals)

  const usdValue = await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "getUsdValue",
    args: [tokenAddress, amountWei],
  });

  return formatUnits(usdValue, 18);
};

/**
 * Get borrowable amount for user
 */
export const getBorrowableAmount = async ({
  userAddress,
  tokenAddress,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);

  const amount = await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "_borrowableAmount",
    args: [userAddress, tokenAddress],
  });

  return formatEther(amount); //formatUnits(amount, tokenDecimals)
};

/**
 * Check if token is approved
 */
export const isTokenApproved = async ({
  tokenAddress,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);

  return await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "isTokenApproved",
    args: [tokenAddress],
  });
};

/**
 * Get contract token balance
 */
// check function name against the contract abi(getContractsTokenBalance or getContractBalance)
export const getContractsTokenBalance = async ({
  tokenAddress,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);

  const balance = await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "getContractsTokenBalance",
    args: [tokenAddress],
  });

  return formatEther(balance);
};

/**
 * Get approved tokens count
 */
export const getApprovedTokensCount = async ({ chainId, publicClient }) => {
  const address = getLendingContract(chainId);

  return await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "getApprovedTokensCount",
    args: [],
  });
};

/**
 * Get approved token list
 */
export const getApprovedTokenList = async ({
  index,
  chainId,
  publicClient,
}) => {
  const address = getLendingContract(chainId);

  return await publicClient.readContract({
    address,
    abi: LENDING_ABI,
    functionName: "approvedTokenList",
    args: [BigInt(index)],
  });
};

/**
 * Helper functions
 */

/**
 * Check if a position is liquidatable
 */
export const isPositionLiquidatable = async ({
  userAddress,
  chainId,
  publicClient,
}) => {
  const health = await getUserHealth({ userAddress, chainId, publicClient });
  // Position is liquidatable if health < 1e18 (100%)
  return health < BigInt(1e18);
};

/**
 * Calculate liquidation details
 */
export const calculateLiquidation = async ({
  userAddress,
  tokenAddress,
  chainId,
  publicClient,
}) => {
  const position = await getUserPosition({
    userAddress,
    chainId,
    publicClient,
  });
  const price = await getTokenPrice({ tokenAddress, chainId, publicClient });
  const health = await getUserHealth({ userAddress, chainId, publicClient });

  return {
    health,
    position,
    price,
    isLiquidatable: health < BigInt(1e18),
    // Additional calculations can be added here
  };
};
