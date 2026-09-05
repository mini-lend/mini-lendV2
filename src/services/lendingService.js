import { parseEther, formatEther, formatUnits, getContract } from "viem";
import { LENDING_ABI, ERC20_ABI } from "../utils/contractAbi";
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
 * Calculate health factor for a user's position
 * @param {Object} params
 * @param {string} params.userAddress - User's wallet address
 * @param {number} params.chainId - Chain ID
 * @param {Object} params.publicClient - Viem public client
 * @param {Object} params.walletClient - Viem wallet client (optional, for writing)
 * @returns {Promise<Object>} Health factor data
 */
export const getHealthFactor = async ({
  userAddress,
  chainId,
  publicClient,
}) => {
  try {
    // First get user position
    const position = await getUserPosition({
      userAddress,
      chainId,
      publicClient,
    });

    // If no position exists
    const stakedAmount = BigInt(position.stakedAmount);
    const debtAmount = BigInt(position.debtAmount);

    if (!position || stakedAmount === 0n) {
      return {
        healthFactor: Infinity,
        isHealthy: true,
        isLiquidatable: false,
        collateralValue: "0",
        debtValue: "0",
        status: "NO_POSITION",
        message: "No active position found",
      };
    }

    // Get USD values with proper decimals
    const collateralValueRaw = await getUsdValue({
      tokenAddress: position.stakedAsset,
      amount: position.stakedAmount,
      chainId,
      publicClient,
    });

    console.log(
      "Collateral value raw:",
      collateralValueRaw,
      "for staked asset:",
      position.stakedAsset,
    );

    let debtValueRaw = 0n;

    if (debtAmount > 0n) {
      debtValueRaw = await getUsdValue({
        tokenAddress: position.debtAsset,
        amount: debtAmount,
        chainId,
        publicClient,
      });
      console.log(
        "Debt value raw:",
        debtValueRaw,
        "for debt asset:",
        position.debtAsset,
      );
    }

    // Constants from contract
    const LIQUIDATION_THRESHOLD = 7500; // 75%
    const PCT_DENOMINATOR = 10000; // 100%

    // getUsdValue already returns 18 decimal USD value
    // So we format it directly with 18 decimals
    const collateralNum = parseFloat(
      formatUnits(BigInt(collateralValueRaw), 18),
    );
    const debtNum = parseFloat(formatUnits(BigInt(debtValueRaw), 18));
    console.log(
      "Collateral USD value:",
      collateralNum,
      "Debt USD value:",
      debtNum,
    );

    let healthFactor;
    let isHealthy = false;
    let isLiquidatable = false;
    let status = "";
    let message = "";
    const threshold = LIQUIDATION_THRESHOLD / PCT_DENOMINATOR;
    healthFactor = (collateralNum * threshold) / debtNum;

    console.log(
      "Calculated health factor:",
      healthFactor,
      "with threshold:",
      threshold,
    );

    if (debtNum === 0) {
      healthFactor = Infinity;
      isHealthy = true;
      isLiquidatable = false;
      status = "HEALTHY_NO_DEBT";
      message = "No debt, position is fully collateralized";
    } else {
      // const threshold = LIQUIDATION_THRESHOLD / PCT_DENOMINATOR;
      // healthFactor = (collateralNum * threshold) / debtNum;

      if (healthFactor >= 1) {
        isHealthy = true;
        isLiquidatable = healthFactor < 1;

        if (healthFactor > 1.5) {
          status = "HEALTHY";
          message = "Position is well collateralized";
        } else if (healthFactor > 1.2) {
          status = "MODERATE";
          message =
            "Position is moderately healthy, consider adding collateral";
        } else if (healthFactor > 1.05) {
          status = "WARNING";
          message = "Position is close to liquidation, take action soon";
        } else {
          status = "CRITICAL";
          message = "Position is at risk of liquidation, take immediate action";
        }
      } else {
        isHealthy = false;
        isLiquidatable = healthFactor < 1;
        status = "LIQUIDATABLE";
        message = "Position is undercollateralized and can be liquidated";
      }
    }

    return {
      healthFactor,
      isHealthy,
      isLiquidatable,
      collateralValue: collateralNum.toFixed(2),
      debtValue: debtNum.toFixed(2),
      status,
      message,
      collateralRatio: debtNum > 0 ? collateralNum / debtNum : Infinity,
      liquidationThreshold: threshold,
      // Keep raw values if needed
      collateralValueRaw,
      debtValueRaw,
    };
  } catch (error) {
    console.error("Error calculating health factor:", error);
    return {
      healthFactor: 0,
      isHealthy: false,
      isLiquidatable: false,
      status: "ERROR",
      message: `Error: ${error.message}`,
    };
  }
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
