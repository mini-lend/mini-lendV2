// modals/RepayModal.jsx

import { useState } from "react";
import {
  FiX,
  FiRefreshCw,
  FiArrowUpRight,
  FiAlertCircle,
} from "react-icons/fi";
import { usePositionData } from "../hooks/usePositionData";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useMLending } from "../hooks/useMLending";
import ActivityResultModal from "../components/ActivityResultModal";

export default function RepayModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");

  const [resultModal, setResultModal] = useState({
    isOpen: false,
    status: "success",
    title: "",
    message: "",
    activity: "",
    amount: "",
    asset: "",
    transactionHash: "",
  });

  const { address: account } = useAccount();

  const { positionData, debtValue, healthFactor } = usePositionData();

  const { data: balanceData } = useBalance({
    address: account,
    token: positionData.debtAsset || undefined,
  });

  const { repayAsset, isPending, isConfirming } = useMLending();

  /**
   * The contract stores debtAmount as a raw uint256 value.
   * This assumes the debt token uses 18 decimals, which matches
   * the rest of your current MiniLend implementation.
   */
  const debtWei = BigInt(positionData.debtAmount || "0");

  const debtFormatted = debtWei > 0n ? formatEther(debtWei) : "0";

  const debtNum = Number(debtFormatted) || 0;

  const balance = balanceData ? Number(balanceData.formatted) : 0;

  const isLoading = isPending || isConfirming;

  const amountNum = Number(amount) || 0;

  const remainingDebt = Math.max(0, debtNum - amountNum);

  const isDisabled =
    isLoading ||
    !amount ||
    amountNum <= 0 ||
    amountNum > debtNum ||
    amountNum > balance;

  const closeResultModal = () => {
    setResultModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleMax = () => {
    if (debtNum <= 0) return;

    /**
     * User can only repay what they actually have.
     * Therefore MAX = min(debt, wallet balance).
     */
    const maxAmount = Math.min(debtNum, balance);

    setAmount(maxAmount.toString());
  };

  const handleRepay = async () => {
    if (isDisabled || !positionData.debtAsset) {
      return;
    }

    const repaymentAmount = amount;

    try {
      /**
       * Ideally repayAsset should return the transaction hash.
       *
       * Example:
       * const hash = await repayAsset(debtToken, amount);
       */
      const hash = await repayAsset(positionData.debtAsset, repaymentAmount);

      setAmount("");
      onClose();

      setResultModal({
        isOpen: true,
        status: "success",
        title: "Transaction Successful",
        message: "Your repayment transaction has been successfully completed.",
        activity: "Repay",
        amount: `${repaymentAmount} USDC`,
        asset: "USDC",
        transactionHash: hash || "",
      });
    } catch (error) {
      console.error("Repay failed:", error);

      onClose();

      setResultModal({
        isOpen: true,
        status: "incomplete",
        title: "Transaction Incomplete",
        message:
          error?.shortMessage ||
          error?.message ||
          "Your repayment transaction could not be completed. Please try again.",
        activity: "Repay",
        amount: `${repaymentAmount} USDC`,
        asset: "USDC",
        transactionHash: "",
      });
    }
  };

  const getButtonText = () => {
    if (isPending) return "Confirming...";
    if (isConfirming) return "Processing...";
    return "Repay";
  };

  if (!isOpen) {
    return null;
  }

  /**
   * No debt
   */
  if (debtWei === 0n) {
    return (
      <>
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                  <FiRefreshCw size={18} className="text-[#6DD054]" />
                </div>

                <div>
                  <h2 className="text-base font-semibold">Repay Debt</h2>

                  <p className="text-xs text-white/35 mt-0.5">
                    Reduce your outstanding debt
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05]"
              >
                <FiX size={19} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4">
                  <FiRefreshCw size={22} className="text-white/40" />
                </div>

                <h3 className="text-base font-semibold">No Outstanding Debt</h3>

                <p className="text-sm text-white/40 mt-2 max-w-xs">
                  You currently have no outstanding debt to repay.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full h-12 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-medium text-white/70 hover:bg-white/[0.1] hover:text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <ActivityResultModal
          isOpen={resultModal.isOpen}
          status={resultModal.status}
          title={resultModal.title}
          message={resultModal.message}
          activity={resultModal.activity}
          amount={resultModal.amount}
          asset={resultModal.asset}
          transactionHash={resultModal.transactionHash}
          onClose={closeResultModal}
        />
      </>
    );
  }

  return (
    <>
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
                <FiRefreshCw size={18} className="text-[#6DD054]" />
              </div>

              <div>
                <h2 className="text-base font-semibold">Repay Debt</h2>

                <p className="text-xs text-white/35 mt-0.5">
                  Reduce your outstanding debt
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
            {/* Repay amount */}
            <div className="flex justify-between mb-2">
              <span className="text-xs text-white/40">Repay amount</span>

              <span className="text-xs text-white/40">
                Debt:{" "}
                <span className="text-white/70">{debtFormatted} USDC</span>
              </span>
            </div>

            {/* Input */}
            <div className="rounded-xl border border-white/10 bg-white/[0.025] focus-within:border-[#6DD054]/40 transition">
              <div className="flex items-center px-4 h-16">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  disabled={isLoading}
                  className="w-full bg-transparent outline-none text-xl font-semibold placeholder:text-white/15 disabled:opacity-50"
                />

                <span className="px-3 py-2 rounded-lg bg-white/[0.05] text-xs">
                  USDC
                </span>
              </div>

              <div className="px-4 pb-3 flex justify-between items-center">
                <span className="text-[10px] text-white/25">
                  Balance: {balance} USDC
                </span>

                <button
                  onClick={handleMax}
                  disabled={isLoading || balance <= 0}
                  className="text-[10px] font-semibold text-[#6DD054] hover:text-white transition disabled:opacity-50"
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-white/35">Current debt</span>

                <span className="text-xs text-white/70">
                  {debtFormatted} USDC
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs text-white/35">Repayment amount</span>

                <span className="text-xs text-white/70">
                  {amountNum.toFixed(2)} USDC
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs text-white/35">Remaining debt</span>

                <span className="text-xs text-white">
                  {remainingDebt.toFixed(2)} USDC
                </span>
              </div>

              <div className="h-px bg-white/[0.06]" />

              <div className="flex justify-between">
                <span className="text-xs text-white/35">Health factor</span>

                <span
                  className={`text-xs font-semibold ${
                    healthFactor > 1.2
                      ? "text-[#6DD054]"
                      : healthFactor > 1.05
                        ? "text-yellow-500"
                        : "text-red-500"
                  }`}
                >
                  {healthFactor === Infinity
                    ? "∞ Safe"
                    : Number(healthFactor).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-xs text-white/35">Debt value</span>

                <span className="text-xs text-white/70">
                  ${Number(debtValue || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-4 flex gap-3 rounded-xl border border-[#6DD054]/10 bg-[#6DD054]/[0.04] p-3">
              <FiAlertCircle
                className="shrink-0 mt-0.5 text-[#6DD054]"
                size={15}
              />

              <p className="text-[11px] leading-5 text-white/40">
                Repaying your debt improves your health factor and reduces
                liquidation risk.
              </p>
            </div>

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
                onClick={handleRepay}
                disabled={isDisabled}
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

      {/* Transaction result */}
      <ActivityResultModal
        isOpen={resultModal.isOpen}
        status={resultModal.status}
        title={resultModal.title}
        message={resultModal.message}
        activity={resultModal.activity}
        amount={resultModal.amount}
        asset={resultModal.asset}
        transactionHash={resultModal.transactionHash}
        onClose={closeResultModal}
      />
    </>
  );
}
