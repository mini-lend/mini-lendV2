// hooks/useMLending.js
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
  useChainId,
  usePublicClient,
} from "wagmi";
import { config } from "../rainbowKitConfig";
import { useState, useEffect } from "react";
import { parseEventLogs } from "viem";
import toast from "react-hot-toast";
import {
  getLendingContract,
  prepareStakeEthTx,
  prepareBorrowTx,
  prepareRepayTx,
  prepareWithdrawCollateralTx,
  prepareLiquidationTx,
  prepareApproveTokenTx,
  prepareRevokeTokenTx,
  prepareSetFeedTx,
  prepareSetLtvTx,
  prepareSetLiquidationBonusTx,
  getUserPosition,
  getUserHealth,
  getTokenPrice,
  getUsdValue,
  getBorrowableAmount,
  isTokenApproved,
  getContractsTokenBalance,
  getApprovedTokensCount,
  getApprovedTokenList,
  isPositionLiquidatable,
  calculateLiquidation,
} from "../services/lendingService";
import { LENDING_ABI } from "../utils/contractAbi";

export const useMLending = () => {
  const { address: account } = useAccount();
  const chainId = useChainId({ config: config });
  const publicClient = usePublicClient({ chainId: chainId, config: config });

  // Transaction states
  const [isPending, setIsPending] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [txError, setTxError] = useState(null);

  // Wagmi write hook
  const { writeContractAsync } = useWriteContract();

  // Wait for transaction receipt (for UI feedback)
  const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (isWaiting) {
      setIsConfirming(true);
      setIsPending(false);
    } else if (isSuccess) {
      setIsConfirming(false);
      setTxHash(null);
    }
  }, [isWaiting, isSuccess]);

  // Core transaction executor with event parsing
  const executeTx = async (prepareFn, params, options = {}) => {
    const { successMessage = "Transaction successful", eventName } = options;

    if (!account) {
      toast.error("Please connect your wallet");
      throw new Error("No account connected");
    }
    if (!chainId) {
      toast.error("No network detected");
      throw new Error("No chain ID");
    }

    const txConfig = prepareFn({ ...params, account, chainId });
    if (!txConfig.address) {
      toast.error("Contract not deployed on this network");
      throw new Error("Contract address missing");
    }

    setIsPending(true);
    setTxError(null);
    try {
      // Send transaction
      const hash = await writeContractAsync(txConfig);
      setTxHash(hash);
      toast.loading("Transaction sent. Waiting for confirmation...", {
        id: hash,
      });

      // Wait for receipt using public client
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status !== "success") {
        throw new Error("Transaction reverted");
      }

      // Success toast
      toast.success(successMessage, { id: hash });

      // Parse event if requested
      let eventData = null;
      if (eventName && receipt.logs.length > 0) {
        const events = parseEventLogs({
          abi: LENDING_ABI,
          logs: receipt.logs,
          eventName: eventName,
        });

        const matched = events.find((e) => e.eventName === eventName);

        if (matched) {
          eventData = matched.args;
        }
      }

      return { hash, receipt, eventData };
    } catch (err) {
      console.error(err);
      setTxError(err);
      toast.error(err.message || "Transaction failed");
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  // ---------- Read Functions (Non-Hook) ----------

  const fetchUserPosition = async (userAddress) => {
    if (!userAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getUserPosition({
        userAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to fetch user position");
      return null;
    }
  };

  const fetchUserHealth = async (userAddress) => {
    if (!userAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getUserHealth({
        userAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user health");
      return null;
    }
  };

  const fetchTokenPrice = async (tokenAddress) => {
    if (!tokenAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getTokenPrice({
        tokenAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch token price");
      return null;
    }
  };

  const fetchUsdValue = async (tokenAddress, amount) => {
    if (!tokenAddress || !amount || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      console.log(tokenAddress, amount, chainId, publicClient);
      return await getUsdValue({
        tokenAddress,
        amount,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch USD value");
      return null;
    }
  };

  const fetchBorrowableAmount = async (userAddress, tokenAddress) => {
    if (!userAddress || !tokenAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getBorrowableAmount({
        userAddress,
        tokenAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch borrowable amount");
      return null;
    }
  };

  const fetchTokenApprovalStatus = async (tokenAddress) => {
    if (!tokenAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await isTokenApproved({
        tokenAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch token approval status");
      return null;
    }
  };

  const fetchContractBalance = async (tokenAddress) => {
    if (!tokenAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getContractsTokenBalance({
        tokenAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch contract balance");
      return null;
    }
  };

  const fetchApprovedTokensCount = async () => {
    if (!chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getApprovedTokensCount({
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch approved tokens count");
      return null;
    }
  };

  const fetchApprovedTokenList = async (index) => {
    if (index === undefined || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await getApprovedTokenList({
        index,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch approved token");
      return null;
    }
  };

  const checkPositionLiquidatable = async (userAddress) => {
    if (!userAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await isPositionLiquidatable({
        userAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to check liquidation status");
      return null;
    }
  };

  const fetchLiquidationDetails = async (userAddress, tokenAddress) => {
    if (!userAddress || !tokenAddress || !chainId || !publicClient) {
      toast.error("Missing required parameters");
      return null;
    }
    try {
      return await calculateLiquidation({
        userAddress,
        tokenAddress,
        chainId,
        publicClient,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch liquidation details");
      return null;
    }
  };

  // ---------- Read Hooks (useReadContract) ----------

  const useUserPosition = (userAddress) => {
    return useReadContract({
      address: chainId ? getLendingContract(chainId) : undefined,
      abi: LENDING_ABI,
      functionName: "getUser",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress && !!chainId,
        select: (data) => ({
          stakedAsset: data[0],
          stakedAmount: data[1],
          debtAsset: data[2],
          debtAmount: data[3],
        }),
      },
    });
  };

  const useUserHealth = (userAddress) => {
    return useReadContract({
      address: chainId ? getLendingContract(chainId) : undefined,
      abi: LENDING_ABI,
      functionName: "userPositionHealth",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress && !!chainId,
      },
    });
  };

  const useTokenPrice = (tokenAddress) => {
    return useReadContract({
      address: chainId ? getLendingContract(chainId) : undefined,
      abi: LENDING_ABI,
      functionName: "getLatestPrice",
      args: tokenAddress ? [tokenAddress] : undefined,
      query: {
        enabled: !!tokenAddress && !!chainId,
      },
    });
  };

  const useTokenApproval = (tokenAddress) => {
    return useReadContract({
      address: chainId ? getLendingContract(chainId) : undefined,
      abi: LENDING_ABI,
      functionName: "isTokenApproved",
      args: tokenAddress ? [tokenAddress] : undefined,
      query: {
        enabled: !!tokenAddress && !!chainId,
      },
    });
  };

  const useApprovedTokensCount = () => {
    return useReadContract({
      address: chainId ? getLendingContract(chainId) : undefined,
      abi: LENDING_ABI,
      functionName: "getApprovedTokensCount",
      args: [],
      query: {
        enabled: !!chainId,
      },
    });
  };

  // ---------- Write Actions ----------

  const stakeEth = async (amount) => {
    return executeTx(
      prepareStakeEthTx,
      { amount },
      {
        successMessage: `Successfully staked ${amount} ETH!`,
        eventName: "EthStaked",
      },
    );
  };

  const borrowAsset = async (tokenAddress, amount) => {
    return executeTx(
      prepareBorrowTx,
      { tokenAddress, amount },
      {
        successMessage: `Successfully borrowed ${amount}!`,
        eventName: "USDBorrowed",
      },
    );
  };

  const repayAsset = async (tokenAddress, amount) => {
    return executeTx(
      prepareRepayTx,
      { tokenAddress, amount },
      {
        successMessage: `Successfully repaid ${amount}!`,
        eventName: "USDRepaid",
      },
    );
  };

  const withdrawCollateral = async (amount) => {
    return executeTx(
      prepareWithdrawCollateralTx,
      { amount },
      {
        successMessage: `Successfully withdrew ${amount} ETH collateral!`,
        eventName: "ETHCollateralWithdrawn",
      },
    );
  };

  const liquidatePosition = async (borrower, repayAmount) => {
    return executeTx(
      prepareLiquidationTx,
      { borrower, repayAmount },
      {
        successMessage: `Successfully liquidated position!`,
        eventName: "Liquidation",
      },
    );
  };

  const approveToken = async (tokenAddress) => {
    return executeTx(
      prepareApproveTokenTx,
      { tokenAddress },
      {
        successMessage: `Token approved for lending!`,
        eventName: "NewTokenApproved",
      },
    );
  };

  const revokeToken = async (tokenAddress) => {
    return executeTx(
      prepareRevokeTokenTx,
      { tokenAddress },
      {
        successMessage: `Token approval revoked!`,
        eventName: "TokenRevoked",
      },
    );
  };

  const setPriceFeed = async (tokenAddress, feedAddress) => {
    return executeTx(
      prepareSetFeedTx,
      { tokenAddress, feedAddress },
      {
        successMessage: `Price feed updated!`,
        eventName: "PriceFeedUpdated",
      },
    );
  };

  const setLtv = async (ltv) => {
    return executeTx(
      prepareSetLtvTx,
      { ltv },
      {
        successMessage: `LTV updated!`,
        eventName: "ltvUpdated",
      },
    );
  };

  const setLiquidationBonus = async (bonus) => {
    return executeTx(
      prepareSetLiquidationBonusTx,
      { bonus },
      {
        successMessage: `Liquidation bonus updated!`,
        eventName: "BonusUpdated",
      },
    );
  };

  // Return all hooks and functions
  return {
    // States
    isPending,
    isConfirming,
    txHash,
    txError,

    // Read hooks
    useUserPosition,
    useUserHealth,
    useTokenPrice,
    useTokenApproval,
    useApprovedTokensCount,

    // Read functions (non-hook)
    fetchUserPosition,
    fetchUserHealth,
    fetchTokenPrice,
    fetchUsdValue,
    fetchBorrowableAmount,
    fetchTokenApprovalStatus,
    fetchContractBalance,
    fetchApprovedTokensCount,
    fetchApprovedTokenList,
    checkPositionLiquidatable,
    fetchLiquidationDetails,

    // Write actions
    stakeEth,
    borrowAsset,
    repayAsset,
    withdrawCollateral,
    liquidatePosition,
    approveToken,
    revokeToken,
    setPriceFeed,
    setLtv,
    setLiquidationBonus,
  };
};
