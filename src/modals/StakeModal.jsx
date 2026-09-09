// modals/StakeModal.js

import { useState } from "react";
import {
  FiX,
  FiLock,
  FiArrowUpRight,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { usePositionData } from "../hooks/usePositionData";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useMLending } from "../hooks/useMLending";
import ActivityResultModal from "../components/ActivityResultModal";

export default function StakeModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");

  // =====================================================
  // REUSABLE ACTIVITY RESULT MODAL STATE
  // =====================================================

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

  // =====================================================
  // WALLET
  // =====================================================

  const { address: account } = useAccount();

  const { data: balanceData } = useBalance({
    address: account,
  });

  // =====================================================
  // POSITION DATA
  // =====================================================

  const {
    handleRefresh,
    positionData,
    collateralValue,
  } = usePositionData();

  // =====================================================
  // LENDING HOOK
  // =====================================================

  const {
    isPending,
    isConfirming,
    txHash,
    stakeEth,
  } = useMLending();

  // =====================================================
  // VALUES
  // =====================================================

  const balance = balanceData
    ? balanceData.value
    : 0;

  const currentCollateral = parseFloat(
    positionData?.stakedAmount || "0"
  );

  const isLoading = isPending || isConfirming;

  const isDisabled =
    !amount ||
    Number(amount) <= 0 ||
    Number(amount) > balance ||
    isLoading;

  // =====================================================
  // MAX BUTTON
  // =====================================================

  const handleMax = () => {
    if (isLoading) return;

    setAmount(balance.toString());
  };

  // =====================================================
  // CLOSE RESULT MODAL
  // =====================================================

  const closeResultModal = () => {
    setResultModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  // =====================================================
  // STAKE
  // =====================================================

  const handleStake = async () => {
    if (
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > balance ||
      isLoading
    ) {
      console.log("amount:", amount, "balance:", balance);
      return;
    }

    const stakingAmount = amount;

    try {
      // stakeEth waits until the blockchain transaction
      // has been confirmed successfully.
      isPending;
      const result = await stakeEth(stakingAmount);
      isConfirming;

      // Refresh dashboard/position data
      handleRefresh();

      // Clear input
      setAmount("");

      // Close the Stake input modal
      onClose();

      // Show reusable SUCCESS modal
      setResultModal({
        isOpen: true,
        status: "success",
        title: "Transaction Successful",
        message:
          "Your ETH has been successfully added as collateral.",
        activity: "Stake",
        amount: `${stakingAmount} ETH`,
        asset: "ETH",
        transactionHash: result?.hash || "",
      });
      isConfirming ;
    } catch (error) {
      console.error("Stake failed:", error);

      // Close the Stake input modal
      onClose();

      // Show reusable INCOMPLETE modal
      setResultModal({
        isOpen: true,
        status: "incomplete",
        title: "Transaction Incomplete",
        message:
          error?.shortMessage ||
          error?.message ||
          "Your staking transaction could not be completed. Please try again.",
        activity: "Stake",
        amount: `${stakingAmount} ETH`,
        asset: "ETH",
        transactionHash: "",
      });
    }
  };

  // =====================================================
  // BUTTON TEXT
  // =====================================================

  const getButtonText = () => {
    if (isPending) return "Confirming...";
    if (isConfirming) return "Processing...";

    return "Stake ETH";
  };

  // =====================================================
  // DISPLAY VALUES
  // =====================================================

  const afterStaking =
    currentCollateral + (Number(amount) || 0);

  const currentCollateralValue =
    Number(collateralValue) || 0;

  const ethPrice =
    currentCollateral > 0
      ? currentCollateralValue / currentCollateral
      : 0;

  const afterStakingValue =
    currentCollateralValue +
    (Number(amount) || 0) * ethPrice;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* =====================================================
          STAKE MODAL
      ====================================================== */}

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] shadow-[0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden"
          >
            {/* Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6DD054] to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.07]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6DD054]/10 border border-[#6DD054]/20 flex items-center justify-center">
                  <FiLock
                    size={18}
                    className="text-[#6DD054]"
                  />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-white">
                    Stake ETH
                  </h2>

                  <p className="text-xs text-white/35 mt-0.5">
                    Add ETH as collateral
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] transition disabled:opacity-50"
              >
                <FiX size={19} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">

              {/* Balance */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/40">
                  Amount
                </span>

                <span className="text-xs text-white/40">
                  Balance:{" "}
                  <span className="text-white/70">
                    {formatEther(balance)} ETH
                  </span>
                </span>
              </div>

              {/* Input */}
              <div className="rounded-xl border border-white/10 bg-white/[0.025] focus-within:border-[#6DD054]/40 transition">
                <div className="flex items-center px-4 h-16">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formatEther(amount)}
                    onChange={(e) =>
                      setAmount(e.target.value)
                    }
                    placeholder="0.00"
                    disabled={isLoading}
                    className="w-full bg-transparent outline-none text-xl font-semibold text-white placeholder:text-white/15 disabled:opacity-50"
                  />

                  <div className="flex items-center gap-2 shrink-0 px-3 py-2 rounded-lg bg-white/[0.05] border border-white/[0.06]">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px] font-bold">
                      Ξ
                    </div>

                    <span className="text-xs font-medium">
                      ETH
                    </span>
                  </div>
                </div>

                <div className="px-4 pb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleMax}
                    disabled={isLoading}
                    className="text-[10px] font-semibold text-[#6DD054] hover:text-white transition disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">

                {/* Current Collateral */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/35">
                    Current collateral
                  </span>

                  <span className="text-xs font-medium text-white/70">
                    {currentCollateral.toFixed(4)} ETH
                  </span>
                </div>

                {/* After Staking */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/35">
                    After staking
                  </span>

                  <span className="text-xs font-medium text-white">
                    {afterStaking.toFixed(4)} ETH
                  </span>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Collateral Value */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/35">
                    Collateral Value
                  </span>

                  <span className="text-xs font-medium text-[#6DD054]">
                    ${afterStakingValue.toFixed(2)}
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
                  Your ETH will be locked as collateral and can
                  be withdrawn later as long as your position
                  remains healthy.
                </p>
              </div>

              {/* Transaction Status */}
              {txHash && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-[#6DD054]/5 border border-[#6DD054]/10">
                  <FiCheckCircle
                    className="text-[#6DD054]"
                    size={14}
                  />

                  <span className="text-xs text-white/60">
                    Transaction:{" "}
                    {txHash.slice(0, 6)}...
                    {txHash.slice(-4)}
                  </span>
                </div>
              )}

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-5">

                {/* Cancel */}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.03] text-sm font-medium text-white/60 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* Stake */}
                <button
                  type="button"
                  onClick={handleStake}
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
      )}

      {/* =====================================================
          ONE REUSABLE ACTIVITY RESULT MODAL
          IMPORTANT: This stays OUTSIDE {isOpen}
      ====================================================== */}

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