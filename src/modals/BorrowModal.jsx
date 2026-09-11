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
import { formatUnits } from "viem";
import { useMLending } from "../hooks/useMLending";
import { TOKEN_ADDRESSES } from "../utils/chains.address";
import { getTokenSymbol } from "../utils/tokenSelect";
import ActivityResultModal from "../components/ActivityResultModal";

export default function BorrowModal({ isOpen, onClose }) {
  const [amount, setAmount] = useState("");
  const [borrowableAmount, setBorrowableAmount] = useState(0);
  const [tokenAddress, setTokenAddress] = useState("");

  // =====================================================
  // REUSABLE ACTIVITY RESULT MODAL
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
  const chainId = useChainId();

  // =====================================================
  // SUPPORTED DEBT TOKENS
  // =====================================================

  const chainTokens = TOKEN_ADDRESSES[chainId] || {};

  const supportedTokens = Object.values(chainTokens);

  const selectedToken = supportedTokens.find(
    (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
  );

  const debtToken = getTokenSymbol(chainId, tokenAddress);

  const debtTokenDecimals = selectedToken?.decimals ?? 18;

  // =====================================================
  // POSITION DATA
  // =====================================================

  const { triggerRefresh, positionData, debtValue, healthFactor } =
    usePositionData();

  // =====================================================
  // LENDING
  // =====================================================

  const {
    borrowAsset,
    isPending,
    isConfirming,
    txHash,
    fetchBorrowableAmount,
  } = useMLending();

  // =====================================================
  // RESET TOKEN WHEN CHAIN CHANGES
  // =====================================================

  useEffect(() => {
    const tokens = TOKEN_ADDRESSES[chainId];

    if (!tokens) {
      setTokenAddress("");
      setBorrowableAmount(0);
      return;
    }

    const tokensList = Object.values(tokens);

    if (tokensList.length === 0) {
      setTokenAddress("");
      setBorrowableAmount(0);
      return;
    }

    // If the currently selected token exists on this chain,
    // keep it. Otherwise select the first supported token.
    const currentTokenExists = tokensList.some(
      (token) => token.address.toLowerCase() === tokenAddress.toLowerCase(),
    );

    if (!currentTokenExists) {
      setTokenAddress(tokensList[0].address);
      setAmount("");
      setBorrowableAmount(0);
    }
  }, [chainId]);

  // =====================================================
  // FETCH BORROWABLE AMOUNT
  // =====================================================

  useEffect(() => {
    if (
      !isOpen ||
      !account ||
      !chainId ||
      !positionData?.stakedAsset ||
      !tokenAddress ||
      !selectedToken
    ) {
      return;
    }

    const fetchBorrowable = async () => {
      try {
        const amount = await fetchBorrowableAmount(account, tokenAddress);

        if (amount === null || amount === undefined) {
          setBorrowableAmount(0);
          return;
        }

        // Use the selected token's decimals.
        const formattedAmount = formatUnits(amount, selectedToken.decimals);

        setBorrowableAmount(parseFloat(formattedAmount));
      } catch (error) {
        console.error("Failed to fetch borrowable amount:", error);

        setBorrowableAmount(0);
      }
    };

    fetchBorrowable();
  }, [
    isOpen,
    account,
    chainId,
    positionData?.stakedAsset,
    tokenAddress,
    selectedToken,
    fetchBorrowableAmount,
  ]);

  // =====================================================
  // TOKEN CHANGE
  // =====================================================

  const handleTokenChange = (e) => {
    const newTokenAddress = e.target.value;

    setTokenAddress(newTokenAddress);
    setAmount("");
    setBorrowableAmount(0);
  };

  // =====================================================
  // VALUES
  // =====================================================

  const isLoading = isPending || isConfirming;

  const currentDebt = parseFloat(positionData?.debtAmount || "0");

  const newDebt = currentDebt + (Number(amount) || 0);

  const isDisabled =
    !amount ||
    Number(amount) <= 0 ||
    Number(amount) > borrowableAmount ||
    !tokenAddress ||
    !selectedToken ||
    isLoading;

  // =====================================================
  // MAX
  // =====================================================

  const handleMax = () => {
    if (isLoading) return;

    setAmount(borrowableAmount.toString());
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
  // BORROW
  // =====================================================

  const handleBorrow = async () => {
    if (
      !amount ||
      Number(amount) <= 0 ||
      Number(amount) > borrowableAmount ||
      !tokenAddress ||
      !selectedToken ||
      isLoading
    ) {
      return;
    }

    const borrowingAmount = amount;

    try {
      const result = await borrowAsset(tokenAddress, amount);

      // await triggerRefresh();

      setAmount("");

      // Close Borrow modal
      onClose();

      // Show reusable SUCCESS modal
      setResultModal({
        isOpen: true,
        status: "success",
        title: "Transaction Successful",
        message: "Your borrowing transaction has been successfully completed.",
        activity: "Borrow",
        amount: `${borrowingAmount} ${debtToken}`,
        asset: debtToken,
        transactionHash: result?.hash || txHash || "",
      });
    } catch (error) {
      console.error("Borrow failed:", error);

      // Close Borrow modal
      onClose();

      // Show reusable INCOMPLETE modal
      setResultModal({
        isOpen: true,
        status: "incomplete",
        title: "Transaction Incomplete",
        message:
          error?.shortMessage ||
          error?.message ||
          "Your borrowing transaction could not be completed. Please try again.",
        activity: "Borrow",
        amount: `${borrowingAmount} ${debtToken}`,
        asset: debtToken,
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

    return "Borrow";
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* =====================================================
          BORROW MODAL
      ====================================================== */}

      {isOpen && (
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
                  <h2 className="text-base font-semibold text-white">
                    Borrow {debtToken}
                  </h2>

                  <p className="text-xs text-white/35 mt-0.5">
                    Borrow against your collateral
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.05] disabled:opacity-50"
              >
                <FiX size={19} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              {/* Debt Token */}
              <div className="mb-4">
                <label className="block text-xs text-white/40 mb-2">
                  Debt token
                </label>

                <select
                  value={tokenAddress}
                  onChange={handleTokenChange}
                  disabled={isLoading || supportedTokens.length === 0}
                  className="w-full h-11 px-3 rounded-xl border border-white/10 bg-white/[0.025] text-sm text-white outline-none focus:border-[#6DD054]/40 disabled:opacity-50"
                >
                  {supportedTokens.length === 0 ? (
                    <option value="">No supported debt tokens</option>
                  ) : (
                    supportedTokens.map((token) => (
                      <option
                        key={token.address}
                        value={token.address}
                        className="bg-[#111111]"
                      >
                        {token.symbol}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Borrow Amount */}
              <div className="flex justify-between mb-2">
                <span className="text-xs text-white/40">Borrow amount</span>

                <span className="text-xs text-white/40">
                  Available:{" "}
                  <span className="text-white/70">
                    {borrowableAmount.toFixed(2)} {debtToken}
                  </span>
                </span>
              </div>

              {/* Input */}
              <div className="rounded-xl border border-white/10 bg-white/[0.025] focus-within:border-[#6DD054]/40 transition">
                <div className="flex items-center px-4 h-16">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    disabled={
                      isLoading || !tokenAddress || supportedTokens.length === 0
                    }
                    className="w-full bg-transparent outline-none text-xl font-semibold text-white placeholder:text-white/15 disabled:opacity-50"
                  />

                  <span className="px-3 py-2 rounded-lg bg-white/[0.05] text-xs text-white">
                    {debtToken}
                  </span>
                </div>

                <div className="px-4 pb-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleMax}
                    disabled={isLoading || !tokenAddress}
                    className="text-[10px] font-semibold text-[#6DD054] hover:text-white transition disabled:opacity-50"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Position */}
              <div className="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                {/* Current Debt */}
                <div className="flex justify-between">
                  <span className="text-xs text-white/35">Current debt</span>

                  <span className="text-xs text-white/70">
                    {currentDebt.toFixed(2)} {debtToken}
                  </span>
                </div>

                {/* New Debt */}
                <div className="flex justify-between">
                  <span className="text-xs text-white/35">New debt</span>

                  <span className="text-xs text-white">
                    {newDebt.toFixed(2)} {debtToken}
                  </span>
                </div>

                <div className="h-px bg-white/[0.06]" />

                {/* Health Factor */}
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
                      : Number(healthFactor || 0).toFixed(2)}
                  </span>
                </div>

                {/* Debt Value */}
                <div className="flex justify-between">
                  <span className="text-xs text-white/35">Debt value</span>

                  <span className="text-xs text-white/70">
                    ${Number(debtValue || 0).toFixed(2)}
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
                  Ensure you have enough collateral to maintain a healthy
                  position. Borrowing too much can lead to liquidation.
                </p>
              </div>

              {/* Transaction Status */}
              {txHash && (
                <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-[#6DD054]/5 border border-[#6DD054]/10">
                  <FiCheckCircle className="text-[#6DD054]" size={14} />

                  <span className="text-xs text-white/60">
                    Transaction: {txHash.slice(0, 6)}...
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
                  className="h-12 rounded-xl border border-white/10 bg-white/[0.03] text-sm text-white/60 hover:text-white hover:bg-white/[0.06] transition disabled:opacity-50"
                >
                  Cancel
                </button>

                {/* Borrow */}
                <button
                  type="button"
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
      )}

      {/* =====================================================
          ONE REUSABLE ACTIVITY RESULT MODAL
          KEEP THIS OUTSIDE {isOpen}
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
