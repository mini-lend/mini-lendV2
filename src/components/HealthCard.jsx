import { FiShield, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import { usePositionData } from "../hooks/usePositionData";

export default function HealthCard() {
  const {
    healthFactor,
    healthStatus,
    isHealthy,
    loading,
    formatHealthFactor,
    getStatusColor,
    getStatusBg,
    getHealthBarPercentage,
    getHealthBarColor,
  } = usePositionData();

  const getStatusDisplay = () => {
    if (loading) return "Loading...";
    if (healthStatus === "NO_POSITION") return "No Position";
    if (healthStatus === "ERROR") return "Error";
    if (healthStatus === "HEALTHY_NO_DEBT") return "No Debt";
    return isHealthy ? "Healthy" : "At Risk";
  };

  const getStatusText = () => {
    if (loading) return "Loading position data...";
    if (healthStatus === "NO_POSITION") return "No active position found";
    if (healthStatus === "HEALTHY_NO_DEBT") return "No debt, position is fully collateralized";
    
    const messages = {
      HEALTHY: "Position is well collateralized",
      MODERATE: "Moderately healthy, consider adding collateral",
      WARNING: "Close to liquidation, take action soon",
      CRITICAL: "At risk of liquidation, take immediate action",
      LIQUIDATABLE: "Position can be liquidated",
    };
    return messages[healthStatus] || "Position health is stable";
  };

  const barPercentage = getHealthBarPercentage();
  const barColor = getHealthBarColor();
  const statusColor = getStatusColor(healthStatus);
  const statusBg = getStatusBg(healthStatus);

  const isUnhealthy = healthStatus === "LIQUIDATABLE" || healthStatus === "CRITICAL" || healthStatus === "WARNING";

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 ${statusBg}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#6DD054]/10 flex items-center justify-center">
          <FiShield className="text-[#6DD054]" size={19} />
        </div>
        <div>
          <p className="text-sm font-semibold">Position Health</p>
          <p className="text-xs text-white/35">Liquidation protection</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className={`text-3xl font-bold ${statusColor}`}>
            {loading ? "..." : formatHealthFactor()}
          </p>
          <p className="mt-1 text-xs text-white/40">Health Factor</p>
        </div>
        {!loading && healthStatus !== "NO_POSITION" && (
          isUnhealthy ? (
            <FiAlertTriangle className="text-red-500" size={30} />
          ) : (
            <FiCheckCircle className="text-[#6DD054]" size={30} />
          )
        )}
      </div>

      {!loading && healthStatus !== "NO_POSITION" && healthStatus !== "ERROR" && (
        <>
          <div className="mt-5">
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full ${barColor} transition-all duration-500`}
                style={{ width: `${Math.min(barPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-white/30">Liquidation</span>
              <span className={`text-[10px] ${statusColor}`}>
                {getStatusDisplay()}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-white/40">{getStatusText()}</p>
          </div>
        </>
      )}
    </div>
  );
}