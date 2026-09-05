import { FiLock, FiArrowUpRight } from "react-icons/fi";
import { formatEther } from "viem";
import { usePositionData } from "../hooks/usePositionData";

export default function CollateralCard() {
  const {
    positionData,
    collateralValue,
    loading,
    getAvailableCollateral,
    getBorrowUtilization,
  } = usePositionData();

  const stakedEth = parseFloat(positionData.stakedAmount || "0");
  const availableEth = getAvailableCollateral();
  const utilization = getBorrowUtilization();

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5 sm:p-6 animate-pulse">
        <div className="h-20 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (stakedEth === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6DD054]/10 flex items-center justify-center">
              <FiLock className="text-[#6DD054]" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold">Collateral</p>
              <p className="text-xs text-white/35">No ETH Staked</p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <p className="text-2xl font-bold text-white/40">0 ETH</p>
          <p className="mt-1 text-sm text-white/40">≈ $0.00</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6DD054]/10 flex items-center justify-center">
            <FiLock className="text-[#6DD054]" size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold">Collateral</p>
            <p className="text-xs text-white/35">ETH Staked</p>
          </div>
        </div>
        <FiArrowUpRight className="text-white/25" size={17} />
      </div>

      <div className="mt-6">
        <p className="text-2xl font-bold">{formatEther(stakedEth)} ETH</p>
        <p className="mt-1 text-sm text-white/40">≈ ${collateralValue.toFixed(2)}</p>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-white/35">Available</span>
          <span className="text-white/60">{formatEther(availableEth)} ETH</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-[#6DD054] transition-all duration-500"
            style={{ width: `${Math.min(utilization, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}