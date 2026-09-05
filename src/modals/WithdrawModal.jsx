// modals/WithdrawModal.js
import { useState } from "react";
import {
  FiX,
  FiArrowUpRight,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { usePositionData } from "../hooks/usePositionData";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useMLending } from "../hooks/useMLending";


export default function WithdrawModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const { address: account } = useAccount();
  const {
    // withdrawCollateral,
    isPending,
    isConfirming,
    txHash,
    triggerRefresh,
    positionData,
    getAvailableCollateral,
    healthFactor,
    hasDebt,
  } = usePositionData();

  const { withdrawCollateral } = useMLending();

  if (!isOpen) return null;

  const collateral = parseFloat(positionData.stakedAmount || "0");
  const available = getAvailableCollateral();
  const isLoading = isPending || isConfirming;

  const handleMax = () => {
    setAmount(available.toString());
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0 || Number(amount) > available) return;

    try {
      await withdrawCollateral(amount);
      await triggerRefresh();
      setAmount("");
      onClose();
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const getButtonText = () => {
    if (isPending) return "Confirming...";
    if (isConfirming) return "Processing...";
    return "Withdraw";
  };

  const isDisabled =
    !amount || Number(amount) <= 0 || Number(amount) > available || isLoading;

  if (collateral === 0) {
    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
        onClick={onClose}
      >
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-yellow-500" size={24} />
            <div>
              <h3 className="text-white font-semibold">
                No Collateral to Withdraw
              </h3>
              <p className="text-white/40 text-sm mt-1">
                You don't have any ETH staked as collateral.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-4 w-full h-12 rounded-xl bg-[#6DD054] text-[#0b1609] font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const canWithdraw = !hasDebt || healthFactor > 1.5;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
              <FiArrowUpRight size={18} className="text-[#6DD054]" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Withdraw ETH</h2>
              <p className="text-xs text-white/35 mt-0.5">
                Withdraw available collateral
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] disabled:opacity-50"
          >
            <FiX size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex justify-between mb-2">
            <span className="text-xs text-white/40">Withdraw amount</span>
            <span className="text-xs text-white/40">
              Available:{" "}
              <span className="text-white/70">{formatEther(available)} ETH</span>
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] focus-within:border-[#6DD054]/40 transition">
            <div className="flex items-center px-4 h-16">
              <input
                type="number"
                min="0"
                step="0.01"
                value={formatEther(amount)}
                onChange={(e) => setAmount(parseEther(e.target.value))}
                placeholder="0.00"
                disabled={isLoading}
                className="w-full bg-transparent outline-none text-xl font-semibold placeholder:text-white/15 disabled:opacity-50"
              />
              <span className="px-3 py-2 rounded-lg bg-white/[0.05] text-xs">
                ETH
              </span>
            </div>
            <div className="px-4 pb-3 flex justify-end">
              <button
                onClick={handleMax}
                disabled={isLoading}
                className="text-[10px] font-semibold text-[#6DD054] hover:text-white transition disabled:opacity-50"
              >
                MAX
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-white/35">Current collateral</span>
              <span className="text-xs text-white/70">
                {formatEther(collateral)} ETH
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-white/35">
                Remaining collateral
              </span>
              <span className="text-xs text-white">
                {formatEther(BigInt(Math.max(0, collateral - (Number(amount) || 0))))} ETH
              </span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex justify-between">
              <span className="text-xs text-white/35">Health factor</span>
              <span
                className={`text-xs font-semibold ${healthFactor > 1.2 ? "text-[#6DD054]" : healthFactor > 1.05 ? "text-yellow-500" : "text-red-500"}`}
              >
                {healthFactor === Infinity ? "∞ Safe" : healthFactor.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div
            className={`mt-4 flex gap-3 rounded-xl border p-3 ${
              canWithdraw
                ? "border-yellow-500/10 bg-yellow-500/[0.04]"
                : "border-red-500/10 bg-red-500/[0.04]"
            }`}
          >
            <FiAlertCircle
              size={15}
              className={`shrink-0 mt-0.5 ${canWithdraw ? "text-yellow-400" : "text-red-400"}`}
            />
            <p className="text-[11px] leading-5 text-white/40">
              {canWithdraw
                ? "You can withdraw collateral that does not put your lending position at risk."
                : "⚠️ You must repay your debt or improve your health factor before withdrawing collateral."}
            </p>
          </div>

          {/* Transaction status */}
          {txHash && (
            <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-[#6DD054]/5 border border-[#6DD054]/10">
              <FiCheckCircle className="text-[#6DD054]" size={14} />
              <span className="text-xs text-white/60">
                Transaction: {txHash.slice(0, 6)}...{txHash.slice(-4)}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="h-12 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleWithdraw}
              disabled={isDisabled || !canWithdraw}
              className="group h-12 rounded-xl bg-[#6DD054] text-[#0b1609] text-sm font-bold flex items-center justify-center gap-2 transition-all hover:bg-[#7be663] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0b1609] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {getButtonText()}
                  <FiArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
