import { FiCreditCard, FiArrowUpRight } from "react-icons/fi";
import { formatEther } from "viem";
import { usePositionData } from "../hooks/usePositionData";

export default function DebtCard() {
  const {
    positionData,
    debtValue,
    collateralValue,
    loading,
    hasDebt,
    getBorrowUtilization,
  } = usePositionData();

  const utilization = getBorrowUtilization();
  const debtAmount = parseFloat(positionData.debtAmount || "0");

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5 sm:p-6 animate-pulse">
        <div className="h-20 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (!hasDebt) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
              <FiCreditCard className="text-white/60" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Debt</p>
              <p className="text-xs text-white/35">No Debt</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-bold text-green-500">0</p>
          <p className="mt-1 text-sm text-white/40">No borrowed assets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center">
            <FiCreditCard className="text-white/60" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Debt</p>
            <p className="text-xs text-white/35">
              {positionData.debtAsset ? positionData.debtAsset.substring(0, 6) + "..." : "Borrowed Assets"}
            </p>
          </div>
        </div>
        <FiArrowUpRight className="text-white/25" size={17} />
      </div>

      <div className="mt-6">
        <p className="text-2xl font-bold">
          {formatEther(positionData.debtAmount || "0")}
        </p>
        <p className="mt-1 text-sm text-white/40">≈ ${debtValue.toFixed(2)}</p>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-white/35">Borrow limit</span>
        <span className="text-xs text-white/60">{utilization.toFixed(0)}%</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/50 transition-all duration-500"
          style={{ width: `${Math.min(utilization, 100)}%` }}
        />
      </div>
    </div>
  );
}