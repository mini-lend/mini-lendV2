import { useState } from "react";
import {
  FiPlus,
  FiArrowDownLeft,
  FiRefreshCw,
  FiLock,
  FiArrowUpRight,
  FiAlertCircle,
} from "react-icons/fi";
import { useAccount } from "wagmi";
import { usePositionData } from "../hooks/usePositionData";
import { useMLending } from "../hooks/useMLending";

import StakeModal from "../modals/StakeModal";
import AddCollateralModal from "../modals/AddCollateralModal";
import BorrowModal from "../modals/BorrowModal";
import RepayModal from "../modals/RepayModal";
import WithdrawModal from "../modals/WithdrawModal";

export default function ActionButtons() {
  const { address: account } = useAccount();
  const {
    positionData,
    hasPosition,
    hasDebt,
    healthFactor,
    healthStatus,
    loading: positionLoading,
  } = usePositionData();
  const { isPending } = useMLending();

  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [addCollateralModalOpen, setAddCollateralModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [repayModalOpen, setRepayModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  // Check if user can borrow (has collateral and position is healthy enough)
  const canBorrow = hasPosition && healthFactor > 1.05;

  // Check if user can repay (has debt)
  const canRepay = hasDebt;

  // Check if user can withdraw (has collateral and no debt or enough buffer)
  const canWithdraw = hasPosition && (healthFactor > 1.5 || !hasDebt);

  // Check if user can add collateral (has account connected)
  const canAddCollateral = !!account;

  // Check if any action is in progress
  const isActionInProgress = isPending || positionLoading;

  if (!account) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5">
        <div className="flex items-center gap-3 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
          <FiAlertCircle className="text-yellow-500 shrink-0" size={20} />
          <div>
            <p className="text-sm font-semibold text-white">Connect Wallet</p>
            <p className="text-xs text-white/40 mt-1">
              Please connect your wallet to manage your position
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#111111]/80 p-5">
        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Quick Actions</h2>
              <p className="text-xs text-white/35 mt-1">
                Manage your lending position
              </p>
            </div>
            {positionLoading && (
              <span className="text-xs text-white/30 animate-pulse">
                Loading...
              </span>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          {/* STAKE */}
          <ActionButton
            icon={FiLock}
            title="Stake"
            text="Stake ETH as collateral"
            primary
            onClick={() => setStakeModalOpen(true)}
            disabled={isActionInProgress}
            loading={isActionInProgress}
          />

          {/* ADD COLLATERAL */}
          <ActionButton
            icon={FiPlus}
            title="Add Collateral"
            text="Add more ETH"
            onClick={() => setAddCollateralModalOpen(true)}
            disabled={isActionInProgress || !canAddCollateral}
            loading={isActionInProgress}
            warning={!canAddCollateral && account}
          />

          {/* BORROW */}
          <ActionButton
            icon={FiArrowDownLeft}
            title="Borrow"
            text={canBorrow ? "Borrow assets" : "Add collateral first"}
            onClick={() => setBorrowModalOpen(true)}
            disabled={isActionInProgress || !canBorrow}
            loading={isActionInProgress}
            warning={!canBorrow && hasPosition}
          />

          {/* REPAY */}
          <ActionButton
            icon={FiRefreshCw}
            title="Repay"
            text={canRepay ? "Repay your debt" : "No debt to repay"}
            onClick={() => setRepayModalOpen(true)}
            disabled={isActionInProgress || !canRepay}
            loading={isActionInProgress}
            warning={!canRepay}
          />

          {/* WITHDRAW */}
          <ActionButton
            icon={FiArrowUpRight}
            title="Withdraw"
            text={canWithdraw ? "Withdraw collateral" : "Position locked"}
            onClick={() => setWithdrawModalOpen(true)}
            disabled={isActionInProgress || !canWithdraw}
            loading={isActionInProgress}
            warning={!canWithdraw && hasPosition}
          />
        </div>

        {/* STATUS INDICATOR */}
        {hasPosition && (
          <div className="mt-4 flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
            <span className="text-xs text-white/35">Position Status</span>
            <span
              className={`text-xs font-medium ${
                healthFactor > 1.5
                  ? "text-green-500"
                  : healthFactor > 1.2
                    ? "text-yellow-500"
                    : healthFactor > 1.05
                      ? "text-orange-500"
                      : healthFactor >= 1
                        ? "text-red-500"
                        : "text-red-700"
              }`}
            >
              {healthFactor === Infinity
                ? "∞ Safe"
                : `Health: ${healthFactor.toFixed(2)}`}
            </span>
          </div>
        )}
      </div>

      {/* MODALS */}
      <StakeModal
        isOpen={stakeModalOpen}
        onClose={() => setStakeModalOpen(false)}
      />

      <AddCollateralModal
        isOpen={addCollateralModalOpen}
        onClose={() => setAddCollateralModalOpen(false)}
      />

      <BorrowModal
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
      />

      <RepayModal
        isOpen={repayModalOpen}
        onClose={() => setRepayModalOpen(false)}
      />

      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
      />
    </>
  );
}

/* ============================================================
   ACTION BUTTON
============================================================ */

function ActionButton({
  icon: Icon,
  title,
  text,
  primary = false,
  onClick,
  disabled = false,
  loading = false,
  warning = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        group
        text-left
        rounded-xl
        border
        p-4
        transition-all
        duration-200
        relative
        overflow-hidden

        ${
          disabled && !loading
            ? `
              opacity-50
              cursor-not-allowed
              border-white/[0.05]
              bg-white/[0.01]
            `
            : primary
              ? `
                border-[#6DD054]/20
                bg-[#6DD054]/[0.06]
                hover:bg-[#6DD054]/10
                hover:border-[#6DD054]/30
              `
              : `
                border-white/[0.07]
                bg-white/[0.025]
                hover:bg-white/[0.05]
                hover:border-white/10
              `
        }

        ${
          warning && !disabled
            ? "border-yellow-500/20 bg-yellow-500/[0.04]"
            : ""
        }
      `}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111]/80">
          <div className="w-5 h-5 border-2 border-[#6DD054] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* ICON + ARROW */}
      <div className="flex items-center justify-between">
        <div
          className={`
            w-9
            h-9
            rounded-lg
            flex
            items-center
            justify-center
            transition-colors
            ${
              disabled && !loading
                ? "bg-white/[0.02] text-white/25"
                : primary
                  ? "bg-[#6DD054]/10 text-[#6DD054]"
                  : warning
                    ? "bg-yellow-500/10 text-yellow-500"
                    : "bg-white/[0.05] text-white/50 group-hover:text-[#6DD054]"
            }
          `}
        >
          <Icon size={17} />
        </div>

        <span
          className={`
            transition-all
            duration-200
            ${
              disabled && !loading
                ? "text-white/10"
                : "text-white/20 group-hover:text-[#6DD054] group-hover:translate-x-0.5"
            }
          `}
        >
          →
        </span>
      </div>

      {/* TITLE */}
      <p
        className={`mt-4 text-sm font-semibold ${
          disabled && !loading ? "text-white/30" : "text-white"
        }`}
      >
        {title}
      </p>

      {/* DESCRIPTION */}
      <p
        className={`mt-1 text-xs ${
          disabled && !loading ? "text-white/20" : "text-white/35"
        }`}
      >
        {text}
      </p>

      {/* Warning indicator */}
      {warning && !disabled && (
        <div className="absolute top-2 right-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
        </div>
      )}
    </button>
  );
}
