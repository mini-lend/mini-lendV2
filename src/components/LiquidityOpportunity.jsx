import {
  FiAlertTriangle,
  FiArrowRight,
  FiShield,
  FiTrendingDown,
} from "react-icons/fi";
import { formatEther } from "viem";
import { usePositionData } from "../hooks/usePositionData";
import AddCollateralModal from "../modals/AddCollateralModal";
import { useState } from "react";
export default function LiquidityOpportunity() {
  const [addCollateralModalOpen, setAddCollateralModalOpen] = useState(false);

  const {
    positionData,
    collateralValue,
    debtValue,
    healthFactor,
    healthStatus,
    isHealthy,
    loading,
    hasPosition,
    hasDebt,
    getBorrowUtilization,
    getHealthBarPercentage,
    getStatusColor,
    getStatusBg,
    formatHealthFactor,
  } = usePositionData();

  // Calculate safety level based on health factor
  const getSafetyLevel = () => {
    if (!hasPosition) return 0;
    if (healthFactor === Infinity) return 100;
    if (healthFactor >= 2) return 90;
    if (healthFactor >= 1.5) return 75;
    if (healthFactor >= 1.2) return 60;
    if (healthFactor >= 1.05) return 45;
    if (healthFactor >= 1) return 30;
    return 15;
  };

  const getSafetyText = () => {
    if (!hasPosition) return "No position found";
    if (healthFactor === Infinity) return "No debt, fully safe";
    if (healthFactor >= 2) return "Excellent safety level";
    if (healthFactor >= 1.5) return "Good safety level";
    if (healthFactor >= 1.2) return "Moderate safety level";
    if (healthFactor >= 1.05) return "Low safety level";
    if (healthFactor >= 1) return "Critical safety level";
    return "Position at risk";
  };

  const getSafetyAction = () => {
    if (!hasPosition) return "Open a position to start";
    if (healthFactor === Infinity) return "Position is fully safe with no debt";
    if (healthFactor >= 2)
      return "Great! Keep your position well collateralized";
    if (healthFactor >= 1.5)
      return "Consider adding more collateral to stay safe";
    if (healthFactor >= 1.2)
      return "Add collateral or repay debt to improve safety";
    if (healthFactor >= 1.05)
      return "⚠️ Your position is close to liquidation!";
    if (healthFactor >= 1) return "🚨 Your position is at risk of liquidation!";
    return "⚠️ Position is undercollateralized!";
  };

  const getStatusDisplay = () => {
    if (loading) return "Loading...";
    if (!hasPosition) return "No Position";
    if (healthStatus === "HEALTHY_NO_DEBT") return "Safe";
    if (healthStatus === "LIQUIDATABLE") return "⚠️ At Risk";
    if (!isHealthy) return "⚠️ At Risk";

    const displays = {
      HEALTHY: "Healthy",
      MODERATE: "Moderate",
      WARNING: "Warning",
      CRITICAL: "Critical",
    };
    return displays[healthStatus] || "Healthy";
  };

  const getStatusColorClass = () => {
    if (!hasPosition) return "text-gray-500 border-gray-500/15 bg-gray-500/10";
    if (healthFactor === Infinity)
      return "text-green-500 border-green-500/15 bg-green-500/10";

    const colors = {
      HEALTHY: "text-green-500 border-green-500/15 bg-green-500/10",
      MODERATE: "text-yellow-500 border-yellow-500/15 bg-yellow-500/10",
      WARNING: "text-orange-500 border-orange-500/15 bg-orange-500/10",
      CRITICAL: "text-red-500 border-red-500/15 bg-red-500/10",
      LIQUIDATABLE: "text-red-700 border-red-700/15 bg-red-700/10",
    };
    return (
      colors[healthStatus] || "text-gray-500 border-gray-500/15 bg-gray-500/10"
    );
  };

  const getDotColor = () => {
    if (!hasPosition) return "bg-gray-500";
    if (healthFactor === Infinity) return "bg-green-500";

    const colors = {
      HEALTHY: "bg-green-500",
      MODERATE: "bg-yellow-500",
      WARNING: "bg-orange-500",
      CRITICAL: "bg-red-500",
      LIQUIDATABLE: "bg-red-700",
    };
    return colors[healthStatus] || "bg-gray-500";
  };

  const safetyLevel = getSafetyLevel();
  const safetyText = getSafetyText();
  const actionText = getSafetyAction();
  const barPercentage = getHealthBarPercentage();
  const showWarning =
    healthStatus === "WARNING" ||
    healthStatus === "CRITICAL" ||
    healthStatus === "LIQUIDATABLE";
  const showImproveButton =
    hasPosition &&
    (healthStatus === "WARNING" ||
      healthStatus === "CRITICAL" ||
      healthStatus === "LIQUIDATABLE" ||
      healthFactor < 1.5);

  // Format values for display
  const collateralAmount = parseFloat(positionData.stakedAmount || "0");
  const debtAmount = parseFloat(positionData.debtAmount || "0");

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 backdrop-blur-xl overflow-hidden animate-pulse">
        <div className="p-5 sm:p-6 border-b border-white/[0.07]">
          <div className="h-8 bg-white/5 rounded w-1/2"></div>
        </div>
        <div className="p-5 sm:p-6">
          <div className="h-24 bg-white/5 rounded-xl"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <div className="h-16 bg-white/5 rounded-xl"></div>
            <div className="h-16 bg-white/5 rounded-xl"></div>
            <div className="h-16 bg-white/5 rounded-xl"></div>
          </div>
          <div className="mt-4 h-20 bg-white/5 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 backdrop-blur-xl overflow-hidden">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-white/[0.07]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[#6DD054]/10 border border-[#6DD054]/20 flex items-center justify-center">
                <FiTrendingDown size={17} className="text-[#6DD054]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold">Liquidity Opportunity</h2>
                <p className="text-xs text-white/35 mt-1">
                  Monitor positions that may require attention
                </p>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <span
            className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-medium ${getStatusColorClass()}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${getDotColor()}`} />
            {getStatusDisplay()}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-5 sm:p-6">
          {/* OPPORTUNITY CARD */}
          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:p-5">
            <div className="flex items-start gap-4">
              {/* ICON */}
              <div className="w-10 h-10 shrink-0 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <FiShield
                  size={18}
                  className={
                    !hasPosition || showWarning
                      ? "text-yellow-500"
                      : "text-[#6DD054]"
                  }
                />
              </div>

              {/* TEXT */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">
                      {!hasPosition
                        ? "No active position"
                        : healthFactor === Infinity
                          ? "Position fully safe"
                          : showWarning
                            ? "⚠️ Position needs attention"
                            : "Your position is currently safe"}
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      {!hasPosition
                        ? "Start by staking collateral to borrow assets"
                        : actionText}
                    </p>
                  </div>

                  {hasPosition && (
                    <div className="shrink-0">
                      <span
                        className={`text-sm font-semibold ${getStatusColor(healthStatus)}`}
                      >
                        {safetyLevel.toFixed(1)}%
                      </span>
                      <p className="text-[10px] text-white/25 mt-0.5">
                        Safety level
                      </p>
                    </div>
                  )}
                </div>

                {/* PROGRESS */}
                {hasPosition && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] text-white/30">
                        Current health
                      </span>
                      <span className="text-[10px] text-white/30">
                        {healthFactor === Infinity
                          ? "∞"
                          : `${safetyLevel.toFixed(1)}%`}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          safetyLevel >= 75
                            ? "bg-[#6DD054]"
                            : safetyLevel >= 45
                              ? "bg-yellow-500"
                              : safetyLevel >= 30
                                ? "bg-orange-500"
                                : "bg-red-500"
                        }`}
                        style={{ width: `${Math.min(safetyLevel, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* INFO ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <InfoItem
              label="Collateral"
              value={`${formatEther(collateralAmount)} ETH`}
              subValue={`$${collateralValue.toFixed(2)}`}
            />

            <InfoItem
              label="Borrowed"
              value={hasDebt ? `${formatEther(debtAmount)} Tokens` : "None"}
              subValue={
                hasDebt ? `$${debtValue.toFixed(2)}` : "No borrowed assets"
              }
            />

            <InfoItem
              label="Liquidation Threshold"
              value="75%"
              subValue="Of collateral value"
            />
          </div>

          {/* WARNING / OPPORTUNITY */}
          {!hasPosition ? (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-white/35"
                />
                <div>
                  <p className="text-xs font-medium text-white">
                    No active position
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/35">
                    Stake ETH to start borrowing assets and earn yield
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="group shrink-0 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#6DD054] text-[#0b1609] text-xs font-semibold transition-all duration-200 hover:bg-[#7be663] hover:-translate-y-0.5 active:translate-y-0"
              >
                Open Position
                <FiArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          ) : showImproveButton ? (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-red-500/10 bg-red-500/[0.04] p-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-red-500"
                />
                <div>
                  <p className="text-xs font-medium text-white">
                    ⚠️ Position needs attention
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/35">
                    {healthFactor < 1.05
                      ? "Your position is close to liquidation. Take immediate action!"
                      : "Adding collateral can improve your safety level and reduce liquidation risk."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="group shrink-0 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-red-500 text-white text-xs font-semibold transition-all duration-200 hover:bg-red-600 hover:-translate-y-0.5 active:translate-y-0"
              >
                Improve Position
                <FiArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-[#6DD054]/10 bg-[#6DD054]/[0.04] p-4">
              <div className="flex items-start gap-3">
                <FiAlertTriangle
                  size={17}
                  className="mt-0.5 shrink-0 text-[#6DD054]"
                />
                <div>
                  <p className="text-xs font-medium text-white">
                    Keep your position healthy
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/35">
                    {healthFactor === Infinity
                      ? "No debt to worry about. You're fully safe!"
                      : "Your position is healthy. Continue monitoring to maintain safety."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAddCollateralModalOpen(true)}
                className="group shrink-0 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#6DD054] text-[#0b1609] text-xs font-semibold transition-all duration-200 hover:bg-[#7be663] hover:-translate-y-0.5 active:translate-y-0"
              >
                Add Collateral
                <FiArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </div>
          )}
        </div>
      </div>
      {/* MODAL */}
      <AddCollateralModal
        isOpen={addCollateralModalOpen}
        onClose={() => setAddCollateralModalOpen(false)}
      />
    </>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({ label, value, subValue }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3">
      <p className="text-[10px] uppercase tracking-wider text-white/25">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-white/80">{value}</p>
      {subValue && (
        <p className="mt-0.5 text-[10px] text-white/30">{subValue}</p>
      )}
    </div>
  );
}
