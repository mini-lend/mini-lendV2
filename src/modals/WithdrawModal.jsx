import { useState } from "react";
import { parseEther, formatEther } from "viem";
import { FiX, FiArrowUpRight, FiAlertCircle } from "react-icons/fi";
import { usePositionData } from "../hooks/usePositionData";
import { useMLending } from "../hooks/useMLending";
import ActivityResultModal from "../components/ActivityResultModal";

export default function WithdrawModal({ isOpen, onClose }) {
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

  const { positionData, getAvailableCollateral, healthFactor, hasDebt } =
    usePositionData();

  const { withdrawCollateral, isPending, isConfirming, txHash } = useMLending();

  if (!isOpen) return null;

  /*
   * positionData.stakedAmount is expected to be a string
   * representing ETH, e.g. "0.5".
   */
  const collateral = parseFloat(positionData.stakedAmount || "0");

  const available = Number(getAvailableCollateral()) || 0;

  const isLoading = isPending || isConfirming;

  const amountNum = Number(amount) || 0;

  const canWithdraw = !hasDebt || healthFactor > 1.5;

  const isDisabled =
    !amount ||
    amountNum <= 0 ||
    amountNum > available ||
    isLoading ||
    !canWithdraw;

  const closeResultModal = () => {
    setResultModal((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleMax = () => {
    setAmount(available.toString());
  };

  const handleWithdraw = async () => {
    if (isDisabled) return;

    try {
      /*
       * withdrawCollateral should handle the transaction
       * and confirmation inside useMLending.
       */
      await withdrawCollateral(amount);

      const withdrawnAmount = amount;

      setAmount("");

      onClose();

      setResultModal({
        isOpen: true,
        status: "success",
        title: "Transaction Successful",
        message: "Your ETH collateral has been successfully withdrawn.",
        activity: "Withdraw",
        amount: `${withdrawnAmount} ETH`,
        asset: "ETH",
        transactionHash: txHash || "",
      });
    } catch (error) {
      console.error("Withdraw failed:", error);

      const withdrawnAmount = amount;

      onClose();

      setResultModal({
        isOpen: true,
        status: "incomplete",
        title: "Transaction Incomplete",
        message:
          error?.shortMessage ||
          error?.message ||
          "Your withdrawal transaction could not be completed. Please try again.",
        activity: "Withdraw",
        amount: `${withdrawnAmount} ETH`,
        asset: "ETH",
        transactionHash: "",
      });
    }
  };

  const getButtonText = () => {
    if (isPending) return "Confirming...";
    if (isConfirming) return "Processing...";
    return "Withdraw";
  };

  /*
   * No collateral state
   */
  if (collateral === 0) {
    return (
      <>
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            bg-black/70
            backdrop-blur-sm
            px-4
          "
          onClick={onClose}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-white/10
              bg-[#111111]
              p-6
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-yellow-500" size={24} />

              <div>
                <h3 className="font-semibold text-white">
                  No Collateral to Withdraw
                </h3>

                <p className="mt-1 text-sm text-white/40">
                  You don't have any ETH staked as collateral.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="
                mt-4
                h-12
                w-full
                rounded-xl
                bg-[#6DD054]
                font-bold
                text-[#0b1609]
              "
            >
              Close
            </button>
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
      {/* Withdraw Modal */}
      <div
        className="
          fixed
          inset-0
          z-[100]
          flex
          items-center
          justify-center
          bg-black/70
          px-4
          backdrop-blur-sm
        "
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="
            w-full
            max-w-md
            overflow-hidden
            rounded-2xl
            border
            border-white/10
            bg-[#111111]
            shadow-[0_25px_80px_rgba(0,0,0,0.55)]
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-white/[0.07]
              px-5
              py-5
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.05]
                "
              >
                <FiArrowUpRight size={18} className="text-[#6DD054]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-white">
                  Withdraw ETH
                </h2>

                <p className="mt-0.5 text-xs text-white/35">
                  Withdraw available collateral
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                text-white/40
                transition
                hover:bg-white/[0.05]
                hover:text-white
                disabled:opacity-50
              "
            >
              <FiX size={19} />
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
            {/* Amount Label */}
            <div className="mb-2 flex justify-between">
              <span className="text-xs text-white/40">Withdraw amount</span>

              <span className="text-xs text-white/40">
                Available:{" "}
                <span className="text-white/70">
                  {formatEther(available)} ETH
                </span>
              </span>
            </div>

            {/* Amount Input */}
            <div
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.025]
                transition
                focus-within:border-[#6DD054]/40
              "
            >
              <div className="flex h-16 items-center px-4">
                <input
                  type="number"
                  min="0"
                  max={available}
                  step="0.01"
                  value={formatEther(amount)}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  disabled={isLoading}
                  className="
                    w-full
                    bg-transparent
                    text-xl
                    font-semibold
                    outline-none
                    placeholder:text-white/15
                    disabled:opacity-50
                  "
                />

                <span
                  className="
                    rounded-lg
                    bg-white/[0.05]
                    px-3
                    py-2
                    text-xs
                    text-white
                  "
                >
                  ETH
                </span>
              </div>

              <div className="flex justify-end px-4 pb-3">
                <button
                  type="button"
                  onClick={handleMax}
                  disabled={isLoading || available === 0}
                  className="
                    text-[10px]
                    font-semibold
                    text-[#6DD054]
                    transition
                    hover:text-white
                    disabled:opacity-50
                  "
                >
                  MAX
                </button>
              </div>
            </div>

            {/* Summary */}
            <div
              className="
                mt-4
                space-y-3
                rounded-xl
                border
                border-white/[0.07]
                bg-white/[0.02]
                p-4
              "
            >
              {/* Current Collateral */}
              <div className="flex justify-between">
                <span className="text-xs text-white/35">
                  Current collateral
                </span>

                <span className="text-xs text-white/70">
                  {formatEther(collateral)} ETH
                </span>
              </div>

              {/* Available Collateral */}
              <div className="flex justify-between">
                <span className="text-xs text-white/35">
                  Available to withdraw
                </span>

                <span className="text-xs text-white/70">
                  {formatEther(available)} ETH
                </span>
              </div>

              {/* Remaining Collateral */}
              <div className="flex justify-between">
                <span className="text-xs text-white/35">
                  Remaining collateral
                </span>

                <span className="text-xs text-white">
                  {formatEther(Math.max(0, collateral - amountNum))} ETH
                </span>
              </div>

              <div className="h-px bg-white/[0.06]" />

              {/* Health Factor */}
              <div className="flex justify-between">
                <span className="text-xs text-white/35">Health factor</span>

                <span
                  className={`text-xs font-semibold ${
                    healthFactor === Infinity
                      ? "text-[#6DD054]"
                      : healthFactor > 1.2
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
                className={`mt-0.5 shrink-0 ${
                  canWithdraw ? "text-yellow-400" : "text-red-400"
                }`}
              />

              <p className="text-[11px] leading-5 text-white/40">
                {canWithdraw
                  ? "You can withdraw collateral that does not put your lending position at risk."
                  : "⚠️ You must repay your debt or improve your health factor before withdrawing collateral."}
              </p>
            </div>

            {/* Transaction Status */}
            {isLoading && (
              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-white/[0.07]
                  bg-white/[0.03]
                  p-2
                "
              >
                <div
                  className="
                    h-3.5
                    w-3.5
                    animate-spin
                    rounded-full
                    border-2
                    border-[#6DD054]
                    border-t-transparent
                  "
                />

                <span className="text-xs text-white/60">
                  {isPending
                    ? "Waiting for wallet confirmation..."
                    : "Transaction is processing..."}
                </span>
              </div>
            )}

            {/* Buttons */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="
                  h-12
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  text-sm
                  text-white/60
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleWithdraw}
                disabled={isDisabled}
                className="
                  group
                  flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#6DD054]
                  text-sm
                  font-bold
                  text-[#0b1609]
                  transition-all
                  hover:bg-[#7be663]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >
                {isLoading ? (
                  <div
                    className="
                      h-5
                      w-5
                      animate-spin
                      rounded-full
                      border-2
                      border-[#0b1609]
                      border-t-transparent
                    "
                  />
                ) : (
                  <>
                    {getButtonText()}

                    <FiArrowUpRight
                      size={16}
                      className="
                        transition-transform
                        group-hover:translate-x-0.5
                        group-hover:-translate-y-0.5
                      "
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Result */}
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
