import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { useMLending } from './useMLending';

export const usePositionData = () => {
  const { address: account } = useAccount();
  const { fetchUserPosition, fetchUsdValue, useHealthFactor } = useMLending();
  const { healthData, loading: healthLoading } = useHealthFactor(account);
  
  const [positionData, setPositionData] = useState({
    stakedAsset: "",
    stakedAmount: "0",
    debtAsset: "",
    debtAmount: "0",
  });
  const [collateralValue, setCollateralValue] = useState(0);
  const [debtValue, setDebtValue] = useState(0);
  const [totalPositionValue, setTotalPositionValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllData = async () => {
      if (!account) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Step 1: Fetch position data
        const position = await fetchUserPosition(account);
        if (!position) {
          setLoading(false);
          return;
        }

        // Handle case where debtAsset might be empty
        const debtAmount = position.debtAsset ? position.debtAmount : "0";

        // Update position data
        setPositionData({
          stakedAsset: position.stakedAsset || "",
          stakedAmount: position.stakedAmount || "0",
          debtAsset: position.debtAsset || "",
          debtAmount: debtAmount,
        });

        // Step 2: Fetch USD values
        let collateralNum = 0;
        if (position.stakedAsset && position.stakedAmount !== "0") {
          const collateralVal = await fetchUsdValue(
            position.stakedAsset,
            position.stakedAmount
          );
          collateralNum = collateralVal !== null 
            ? parseFloat(formatUnits(BigInt(collateralVal), 18)) 
            : 0;
        }
        setCollateralValue(collateralNum);

        // Step 3: Fetch debt value
        let debtNum = 0;
        if (position.debtAsset && position.debtAmount !== "0") {
          const debtVal = await fetchUsdValue(
            position.debtAsset,
            position.debtAmount
          );
          debtNum = debtVal !== null 
            ? parseFloat(formatUnits(BigInt(debtVal), 18)) 
            : 0;
        }
        setDebtValue(debtNum);

        // Calculate total position value
        setTotalPositionValue(collateralNum - debtNum);

      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [account]);

  // Derived values
  const hasPosition = positionData.stakedAmount !== "0";
  const hasDebt = positionData.debtAmount !== "0" && positionData.debtAsset !== "";
  const isHealthy = healthData?.isHealthy ?? false;
  const healthFactor = healthData?.healthFactor ?? 0;
  const healthStatus = healthData?.status ?? "NO_POSITION";

  return {
    // Raw data
    positionData,
    collateralValue,
    debtValue,
    totalPositionValue,
    healthData,
    
    // Loading states
    loading: loading || healthLoading,
    healthLoading,
    
    // Error
    error,
    
    // Derived values
    hasPosition,
    hasDebt,
    isHealthy,
    healthFactor,
    healthStatus,
    
    // Helpers
    formatHealthFactor: () => {
      if (healthFactor === Infinity || healthFactor === null || healthFactor === undefined) {
        return "∞";
      }
      if (healthFactor === 0) return "0.00";
      return healthFactor.toFixed(2);
    },
    
    getStatusColor: (status = healthStatus) => {
      const colors = {
        HEALTHY: "text-green-500",
        MODERATE: "text-yellow-500",
        WARNING: "text-orange-500",
        CRITICAL: "text-red-500",
        LIQUIDATABLE: "text-red-700",
        NO_POSITION: "text-gray-500",
        HEALTHY_NO_DEBT: "text-green-500",
        ERROR: "text-gray-500",
        LOADING: "text-gray-400",
      };
      return colors[status] || "text-gray-500";
    },
    
    getStatusBg: (status = healthStatus) => {
      const backgrounds = {
        HEALTHY: "bg-green-500/10 border-green-500/20",
        MODERATE: "bg-yellow-500/10 border-yellow-500/20",
        WARNING: "bg-orange-500/10 border-orange-500/20",
        CRITICAL: "bg-red-500/10 border-red-500/20",
        LIQUIDATABLE: "bg-red-700/10 border-red-700/20",
        HEALTHY_NO_DEBT: "bg-green-500/10 border-green-500/20",
        NO_POSITION: "bg-gray-500/10 border-gray-500/20",
      };
      return backgrounds[status] || "bg-white/5 border-white/10";
    },
    
    getHealthBarPercentage: () => {
      if (!healthFactor || healthFactor === Infinity || healthStatus === "NO_POSITION") {
        return 0;
      }
      if (healthStatus === "ERROR") return 0;
      return Math.min((healthFactor / 2) * 100, 100);
    },
    
    getHealthBarColor: () => {
      if (healthFactor === Infinity) return "bg-green-500";
      if (healthStatus === "ERROR" || healthStatus === "NO_POSITION") return "bg-gray-500";
      if (healthStatus === "LIQUIDATABLE") return "bg-red-700";
      if (healthFactor > 1.5) return "bg-green-500";
      if (healthFactor > 1.2) return "bg-yellow-500";
      if (healthFactor > 1.05) return "bg-orange-500";
      if (healthFactor >= 1) return "bg-red-500";
      return "bg-red-700";
    },
    
    getBorrowUtilization: () => {
      if (collateralValue === 0) return 0;
      return Math.min((debtValue / collateralValue) * 100, 100);
    },
    
    getAvailableCollateral: () => {
      // For ETH: staked amount - used collateral (simplified)
      const stakedEth = parseFloat(positionData.stakedAmount || "0");
      const usedEth = parseFloat(positionData.debtAmount || "0");
      return Math.max(stakedEth - usedEth, 0);
    }
  };
};