import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import { formatUnits, getAddress } from "viem";

import { LENDING_ABI } from "../utils/contractAbi";
import { CONTRACT_ADDRESSES, TOKEN_ADDRESSES } from "../utils/chains.address";

const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const EVENT_CONFIG = {
  EthStaked: {
    type: "Stake",
    title: "ETH Staked",
    asset: "ETH",
    decimals: 18,
    positive: true,
  },

  USDBorrowed: {
    type: "Borrow",
    title: "USDC Borrowed",
    asset: "USDC",
    decimals: 6,
    positive: false,
  },

  USDRepaid: {
    type: "Repay",
    title: "Debt Repaid",
    asset: "USDC",
    decimals: 6,
    positive: true,
  },

  ETHCollateralWithdrawn: {
    type: "Withdraw",
    title: "ETH Withdrawn",
    asset: "ETH",
    decimals: 18,
    positive: false,
  },

  Liquidation: {
    type: "Liquidation",
    title: "Position Liquidated",
    asset: "USDC",
    decimals: 6,
    positive: false,
  },
};

const getContractAddress = (chainId) => {
  const address = CONTRACT_ADDRESSES[chainId]?.mLend;

  if (!address || address === "undeployed") {
    return undefined;
  }

  return address;
};

const formatAmount = (amount, decimals) => {
  const value = formatUnits(amount, decimals);

  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
};

const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown date";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(Number(timestamp) * 1000));
};

export default function useActivity() {
  const { address: account } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient({ chainId });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    if (!account || !chainId || !publicClient) {
      setActivities([]);
      return;
    }

    const contractAddress = getContractAddress(chainId);

    if (!contractAddress) {
      setActivities([]);
      setError("MiniLend is not deployed on this network.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const user = getAddress(account);
      const address = getAddress(contractAddress);

      /*
       * Fetch the user's MiniLend events.
       *
       * These events all have `user` indexed:
       *
       * EthStaked(address indexed user, uint256 ethAmount)
       * USDBorrowed(address indexed user, uint256 usdAmount)
       * USDRepaid(address indexed user, uint256 usdAmount)
       * ETHCollateralWithdrawn(address indexed user, uint256 amount)
       */

      const [
        stakeLogs,
        borrowLogs,
        repayLogs,
        withdrawLogs,
        liquidationAsBorrower,
        liquidationAsLiquidator,
      ] = await Promise.all([
        publicClient.getLogs({
          address,
          abi: LENDING_ABI,
          eventName: "EthStaked",
          args: {
            user,
          },
          fromBlock: 0n,
          toBlock: "latest",
        }),

        publicClient.getLogs({
          address,
          abi: LENDING_ABI,
          eventName: "USDBorrowed",
          args: {
            user,
          },
          fromBlock: 0n,
          toBlock: "latest",
        }),

        publicClient.getLogs({
          address,
          abi: LENDING_ABI,
          eventName: "USDRepaid",
          args: {
            user,
          },
          fromBlock: 0n,
          toBlock: "latest",
        }),

        publicClient.getLogs({
          address,
          abi: LENDING_ABI,
          eventName: "ETHCollateralWithdrawn",
          args: {
            user,
          },
          fromBlock: 0n,
          toBlock: "latest",
        }),

        publicClient.getLogs({
          address,
          abi: LENDING_ABI,
          eventName: "Liquidation",
          args: {
            borrower: user,
          },
          fromBlock: 0n,
          toBlock: "latest",
        }),

        publicClient.getLogs({
          address,
          abi: LENDING_ABI,
          eventName: "Liquidation",
          args: {
            liquidator: user,
          },
          fromBlock: 0n,
          toBlock: "latest",
        }),
      ]);

      const allLogs = [
        ...stakeLogs,
        ...borrowLogs,
        ...repayLogs,
        ...withdrawLogs,
        ...liquidationAsBorrower,
        ...liquidationAsLiquidator,
      ];

      /*
       * Prevent duplicate liquidation events when the connected
       * user is both borrower and liquidator.
       */
      const uniqueLogs = Array.from(
        new Map(
          allLogs.map((log) => [`${log.transactionHash}-${log.logIndex}`, log]),
        ).values(),
      );

      /*
       * We need block timestamps because event logs contain
       * block numbers, not human-readable dates.
       */
      const blockNumbers = [
        ...new Set(uniqueLogs.map((log) => log.blockNumber?.toString())),
      ];

      const blocks = await Promise.all(
        blockNumbers.map(async (blockNumber) => {
          const block = await publicClient.getBlock({
            blockNumber: BigInt(blockNumber),
          });

          return [blockNumber, block.timestamp];
        }),
      );

      const timestampMap = new Map(blocks);

      const formattedActivities = uniqueLogs.map((log) => {
        const eventName = log.eventName;
        const config = EVENT_CONFIG[eventName];

        if (!config) {
          return null;
        }

        const args = log.args;

        let rawAmount;
        let asset = config.asset;
        let decimals = config.decimals;
        let title = config.title;
        let type = config.type;
        let positive = config.positive;

        switch (eventName) {
          case "EthStaked":
            rawAmount = args.ethAmount;
            break;

          case "USDBorrowed":
            rawAmount = args.usdAmount;
            break;

          case "USDRepaid":
            rawAmount = args.usdAmount;
            break;

          case "ETHCollateralWithdrawn":
            rawAmount = args.amount;
            break;

          case "Liquidation":
            rawAmount = args.repayAmount;

            /*
             * If the connected user initiated the liquidation,
             * show it as a liquidation performed by the user.
             */
            if (
              args.liquidator &&
              args.liquidator.toLowerCase() === user.toLowerCase()
            ) {
              title = "Position Liquidated";
              type = "Liquidation";
              positive = true;
            } else {
              title = "Position Liquidated";
              type = "Liquidation";
              positive = false;
            }

            break;

          default:
            return null;
        }

        const blockTimestamp = timestampMap.get(log.blockNumber?.toString());

        const amount = formatAmount(rawAmount, decimals);

        return {
          id: `${log.transactionHash}-${log.logIndex}`,

          type,
          title,

          asset,
          amount: `${positive ? "+" : "-"}${amount} ${asset}`,

          status: "Confirmed",

          date: formatDate(blockTimestamp),

          hash: log.transactionHash,

          blockNumber: log.blockNumber,
          logIndex: log.logIndex,

          eventName,

          icon: undefined,

          positive,

          rawAmount,

          /*
           * Useful for TransactionModal later.
           */
          transactionHash: log.transactionHash,

          /*
           * Liquidation-specific information.
           */
          liquidator: args.liquidator,
          borrower: args.borrower,
          repayAmount: args.repayAmount,
          seizedCollateral: args.seizedCollateral,
        };
      });

      const cleanActivities = formattedActivities
        .filter(Boolean)
        .sort((a, b) => {
          if (a.blockNumber !== b.blockNumber) {
            return a.blockNumber > b.blockNumber ? -1 : 1;
          }

          return Number(b.logIndex) - Number(a.logIndex);
        });

      setActivities(cleanActivities);
    } catch (err) {
      console.error("Failed to fetch MiniLend activity:", err);

      setError(
        err?.shortMessage ||
          err?.message ||
          "Failed to load transaction history.",
      );

      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [account, chainId, publicClient]);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  /*
   * Historical totals.
   */
  const summary = activities.reduce(
    (acc, activity) => {
      acc.totalTransactions += 1;

      if (activity.eventName === "EthStaked") {
        acc.totalSupplied += Number(formatUnits(activity.rawAmount, 18));
      }

      if (activity.eventName === "USDBorrowed") {
        acc.totalBorrowed += Number(formatUnits(activity.rawAmount, 6));
      }

      return acc;
    },
    {
      totalTransactions: 0,
      totalSupplied: 0,
      totalBorrowed: 0,
    },
  );

  return {
    activities,
    summary,
    loading,
    error,
    refetchActivities: fetchActivities,
  };
}
