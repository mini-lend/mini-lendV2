// modals/BorrowModal.js
import { useState, useEffect } from "react";
import {
  FiX,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { usePositionData } from "../hooks/usePositionData";
import { useAccount, useChainId } from "wagmi";
import { formatEther } from "viem";
import { useMLending } from "../hooks/useMLending";
import {TOKEN_ADDRESSES} from "../utils/chains.address";

export default function BorrowModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const [borrowableAmount, setBorrowableAmount] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");
  const { address: account } = useAccount();
  const chainId = useChainId();
  const {
    borrowAsset,
    isPending,
    isConfirming,
    txHash,
    triggerRefresh,
    positionData,
    debtValue,
    healthFactor,
  } = usePositionData();

  const {fetchBorrowableAmount} = useMLending();

  useEffect(() => {
    if (isOpen && account && positionData.stakedAsset) {
      // Fetch borrowable amount for the token (USDC in this example)
      const fetchBorrowable = async () => {
        try {
          // You'll need to get the actual token address from your config
          const tokenAddress = TOKEN_ADDRESSES[chainId].link.address; // Replace with actual USDC address
          setTokenAddress(tokenAddress);
          const amount = await fetchBorrowableAmount(account, tokenAddress);
          setBorrowableAmount(parseFloat(formatEther(amount)));
        } catch (error) {
          console.error("Failed to fetch borrowable amount:", error);
          setBorrowableAmount(0);
        }
      };
      fetchBorrowable();
    }
  }, [isOpen, account, positionData.stakedAsset]);

  if (!isOpen) return null;

  const isLoading = isPending || isConfirming;
  const currentDebt = parseFloat(positionData.debtAmount || "0");

  const handleMax = () => {
    setAmount(borrowableAmount.toString());
  };

  const handleBorrow = async () => {
    if (!amount || Number(amount) <= 0 || !tokenAddress) return;

    try {
      await borrowAsset(tokenAddress, amount);
      await triggerRefresh();
      setAmount("");
      onClose();
    } catch (error) {
      console.error("Borrow failed:", error);
    }
  };

  const getButtonText = () => {
    if (isPending) return "Confirming...";
    if (isConfirming) return "Processing...";
    return "Borrow";
  };

  const isDisabled =
    !amount ||
    Number(amount) <= 0 ||
    Number(amount) > borrowableAmount ||
    isLoading;

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
              <FiArrowDownLeft size={18} className="text-[#6DD054]" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Borrow USDC</h2>
              <p className="text-xs text-white/35 mt-0.5">
                Borrow against your collateral
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
            <span className="text-xs text-white/40">Borrow amount</span>
            <span className="text-xs text-white/40">
              Available:{" "}
              <span className="text-white/70">
                {borrowableAmount.toFixed(2)} USDC
              </span>
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] focus-within:border-[#6DD054]/40 transition">
            <div className="flex items-center px-4 h-16">
              <input
                type="number"
                min="0"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                disabled={isLoading}
                className="w-full bg-transparent outline-none text-xl font-semibold placeholder:text-white/15 disabled:opacity-50"
              />
              <span className="px-3 py-2 rounded-lg bg-white/[0.05] text-xs">
                Token
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

          {/* Position */}
          <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-xs text-white/35">Current debt</span>
              <span className="text-xs text-white/70">
                {formatEther(currentDebt)} Token
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-white/35">New debt</span>
              <span className="text-xs text-white">
                {formatEther(currentDebt + (Number(amount) || 0))} Token
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
            <div className="flex justify-between">
              <span className="text-xs text-white/35">Debt value</span>
              <span className="text-xs text-white/70">
                ${debtValue.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Warning */}
          <div className="mt-4 flex gap-3 rounded-xl border border-yellow-500/10 bg-yellow-500/[0.04] p-3">
            <FiAlertCircle
              size={15}
              className="shrink-0 mt-0.5 text-yellow-400"
            />
            <p className="text-[11px] leading-5 text-white/40">
              Ensure you have enough collateral to maintain a healthy position.
              Borrowing too much can lead to liquidation.
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
              onClick={handleBorrow}
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
  );
}
