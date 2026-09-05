import { FiDollarSign, FiLock, FiTrendingUp, FiActivity } from "react-icons/fi";
import { formatEther, formatUnits } from "viem";
import { useMLending } from "../hooks/useMLending";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function PositionOverview() {
  const { fetchUserPosition, fetchUsdValue, useHealthFactor } = useMLending();
  const { address: account } = useAccount();
  const [positionData, setPositionData] = useState({
    stakedAsset: "",
    stakedAmount: "",
    debtAsset: "",
    debtAmount: "",
  });
  const [collateralValue, setCollateralValue] = useState(0); // Usd value of the staked asset
  const [debtValue, setDebtValue] = useState(0); // usd value of the debt asset
  const { healthData, loading } = useHealthFactor(account);
  const [totalPositionValue, setTotalPositionValue] = useState(0);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Step 1: Fetch position data first
        const position = await fetchUserPosition(account);
        if (!position) {
          console.error("Failed to fetch position");
          return;
        }

        // Handle case where debtAsset might be empty
        const debtAmount = position.debtAsset ? position.debtAmount : 0;

        // Update position data state
        setPositionData({
          stakedAsset: position.stakedAsset,
          stakedAmount: position.stakedAmount,
          debtAsset: position.debtAsset,
          debtAmount: debtAmount,
        });

        // Step 2: Now fetch USD values using the position data we just got
        const collateralVal = await fetchUsdValue(
          position.stakedAsset,
          position.stakedAmount,
        );
        const collateralNum = collateralVal !== null ? parseFloat(formatUnits(BigInt(collateralVal), 18)) : 0;
        setCollateralValue(collateralNum);

        // Step 3: Fetch debt value
        let debtNum = 0;
        if (position.debtAsset && position.debtAmount !== "0") {
          const debtVal = await fetchUsdValue(
            position.debtAsset,
            position.debtAmount,
          );
          debtNum = debtVal !== null ? parseFloat(formatUnits(BigInt(debtVal), 18)) : 0;
          setDebtValue(debtNum);
        } else {
          setDebtValue(0);
        }

        // Calculate total position value (collateral - debt)
        setTotalPositionValue(collateralNum - debtNum);

      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (account) {
      fetchAllData();
    }
  }, [account]);

  const getStatusColor = (status) => {
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
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      HEALTHY: "✅",
      MODERATE: "🟡",
      WARNING: "⚠️",
      CRITICAL: "🔴",
      LIQUIDATABLE: "🚨",
      NO_POSITION: "📭",
      HEALTHY_NO_DEBT: "✅",
      ERROR: "❌",
      LOADING: "⏳",
    };
    return emojis[status] || "❓";
  };

  const getStatusDisplay = (status, isHealthy, healthFactor) => {
    if (loading) return "Loading...";
    if (status === "NO_POSITION") return "No Position";
    if (status === "ERROR") return "Error";
    if (status === "HEALTHY_NO_DEBT") return "✅ No Debt";
    if (healthFactor === Infinity) return "∞ Healthy";
    
    if (!isHealthy && status === "LIQUIDATABLE") return "🚨 At Risk";
    if (!isHealthy) return "🔴 At Risk";
    
    const displays = {
      HEALTHY: "✅ Healthy",
      MODERATE: "🟡 Moderate",
      WARNING: "⚠️ Warning",
      CRITICAL: "🔴 Critical",
    };
    return displays[status] || "Healthy";
  };

  const formatHealthFactor = (healthFactor) => {
    if (healthFactor === Infinity || healthFactor === null || healthFactor === undefined) {
      return "∞";
    }
    if (healthFactor === 0) return "0.00";
    return healthFactor.toFixed(2);
  };

  const getHealthFactorColor = (healthFactor, status) => {
    if (healthFactor === Infinity) return "text-green-500";
    if (status === "ERROR" || status === "NO_POSITION") return "text-gray-500";
    if (status === "LIQUIDATABLE") return "text-red-700";
    if (healthFactor > 1.5) return "text-green-500";
    if (healthFactor > 1.2) return "text-yellow-500";
    if (healthFactor > 1.05) return "text-orange-500";
    if (healthFactor >= 1) return "text-red-500";
    return "text-red-700";
  };

  const getHealthFactorBg = (status) => {
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
  };

  // Format the total position value
  const formattedTotal = totalPositionValue > 0 
    ? `$${totalPositionValue.toFixed(2)}` 
    : totalPositionValue < 0 
      ? `-$${Math.abs(totalPositionValue).toFixed(2)}`
      : "$0.00";

  // Safe check for healthData
  const healthFactor = healthData?.healthFactor ?? 0;
  const status = healthData?.status ?? "LOADING";
  const isHealthy = healthData?.isHealthy ?? false;

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#111111]/80
        backdrop-blur-xl
        p-5
        sm:p-6
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-white/40">Total Position</p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold">
            {loading ? "Loading..." : formattedTotal}
          </h2>
        </div>

        <div
          className={`
            w-11 h-11 rounded-xl
            flex items-center justify-center
            ${getHealthFactorBg(status)}
          `}
        >
          <FiDollarSign className={getStatusColor(status)} size={20} />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          icon={FiLock}
          label="Collateral"
          value={`${formatEther(positionData.stakedAmount || "0")} ETH`}
          color="text-white"
        />

        <Stat
          icon={FiTrendingUp}
          label="Collateral Value"
          value={`$${collateralValue.toFixed(2)}`}
          color="text-white"
        />

        <Stat
          icon={FiDollarSign}
          label="Debt"
          value={positionData.debtAsset ? `${formatEther(positionData.debtAmount || "0")}` : "0"}
          subValue={positionData.debtAsset ? positionData.debtAsset.substring(0, 6) + "..." : "No Debt"}
          color={positionData.debtAsset ? "text-white" : "text-green-500"}
        />

        <Stat
          icon={FiActivity}
          label="Health"
          value={loading ? "Loading..." : getStatusDisplay(status, isHealthy, healthFactor)}
          subValue={!loading && status !== "NO_POSITION" && status !== "ERROR" 
            ? `Factor: ${formatHealthFactor(healthFactor)}` 
            : ""}
          color={loading ? "text-gray-400" : getHealthFactorColor(healthFactor, status)}
          status={status}
          healthFactor={healthFactor}
        />
      </div>
    </div>
  );
}

function Stat({ 
  icon: Icon, 
  label, 
  value, 
  subValue, 
  color = "text-white",
  status,
  healthFactor
}) {
  // Get status-specific styling if this is the health stat
  const getStatusIndicator = () => {
    if (!status) return null;
    
    const indicators = {
      HEALTHY: <span className="ml-1 text-green-500">●</span>,
      MODERATE: <span className="ml-1 text-yellow-500">●</span>,
      WARNING: <span className="ml-1 text-orange-500">●</span>,
      CRITICAL: <span className="ml-1 text-red-500">●</span>,
      LIQUIDATABLE: <span className="ml-1 text-red-700">●</span>,
      HEALTHY_NO_DEBT: <span className="ml-1 text-green-500">●</span>,
    };
    return indicators[status] || null;
  };

  // Get health factor bar
  const getHealthBar = () => {
    if (!healthFactor || healthFactor === Infinity || status === "NO_POSITION") return null;
    if (status === "ERROR") return null;
    
    const percentage = Math.min((healthFactor / 2) * 100, 100);
    const barColor = 
      healthFactor > 1.5 ? "bg-green-500" :
      healthFactor > 1.2 ? "bg-yellow-500" :
      healthFactor > 1.05 ? "bg-orange-500" :
      healthFactor >= 1 ? "bg-red-500" :
      "bg-red-700";
    
    return (
      <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barColor} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-4
        hover:bg-white/[0.05]
        transition-all
        duration-200
      "
    >
      <div className="flex items-center gap-2">
        <Icon size={15} className={color} />
        <span className="text-[11px] text-white/35">{label}</span>
        {getStatusIndicator()}
      </div>

      <p className={`mt-2 text-sm font-semibold ${color}`}>
        {value}
      </p>
      
      {subValue && (
        <p className={`text-xs mt-0.5 ${color}`}>
          {subValue}
        </p>
      )}
      
      {getHealthBar()}
    </div>
  );
}