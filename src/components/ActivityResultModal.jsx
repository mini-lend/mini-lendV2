import { useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiX,
  FiArrowUpRight,
} from "react-icons/fi";

export default function ActivityResultModal({
  isOpen,
  status = "success",
  title,
  message,
  activity,
  amount,
  asset,
  transactionHash,
  onClose,
}) {
  // Automatically close after 4 seconds
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose?.();
    }, 4000);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = status === "success";

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/70
        px-4
        backdrop-blur-md
        animate-[modalOverlayIn_250ms_ease-out]
      "
      onClick={onClose}
    >
      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-[#0c0e0c]
          shadow-[0_25px_100px_rgba(0,0,0,0.55)]
          animate-[modalCardIn_350ms_cubic-bezier(0.16,1,0.3,1)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* =====================================================
            TOP GLOW
        ====================================================== */}

        <div
          className={`
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-40
            w-72
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            blur-[70px]
            ${
              isSuccess
                ? "bg-[#6DD054]/10"
                : "bg-red-500/[0.08]"
            }
          `}
        />

        {/* =====================================================
            CLOSE BUTTON
        ====================================================== */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            border
            border-white/10
            bg-white/[0.03]
            text-white/40
            transition-all
            duration-200
            hover:border-white/20
            hover:bg-white/[0.06]
            hover:text-white
          "
        >
          <FiX size={17} />
        </button>

        {/* =====================================================
            CONTENT
        ====================================================== */}

        <div className="relative px-6 pb-7 pt-8 sm:px-8">

          {/* =================================================
              STATUS ICON
          ================================================== */}

          <div className="flex justify-center">

            <div
              className={`
                relative
                flex
                h-20
                w-20
                items-center
                justify-center
                rounded-full
                border
                ${
                  isSuccess
                    ? "border-[#6DD054]/25 bg-[#6DD054]/10"
                    : "border-red-400/20 bg-red-400/[0.07]"
                }
              `}
            >
              {/* Outer ring */}

              <div
                className={`
                  absolute
                  inset-[-8px]
                  rounded-full
                  border
                  animate-[statusRing_1.2s_ease-out]
                  ${
                    isSuccess
                      ? "border-[#6DD054]/10"
                      : "border-red-400/10"
                  }
                `}
              />

              {isSuccess ? (
                <FiCheckCircle
                  className="
                    text-[#6DD054]
                    drop-shadow-[0_0_12px_rgba(109,208,84,0.5)]
                    animate-[statusIcon_450ms_cubic-bezier(0.16,1,0.3,1)]
                  "
                  size={38}
                />
              ) : (
                <FiXCircle
                  className="
                    text-red-400
                    drop-shadow-[0_0_12px_rgba(248,113,113,0.35)]
                    animate-[statusIcon_450ms_cubic-bezier(0.16,1,0.3,1)]
                  "
                  size={38}
                />
              )}
            </div>

          </div>

          {/* =================================================
              TITLE
          ================================================== */}

          <div className="mt-7 text-center">

            <h2 className="text-xl font-semibold text-white sm:text-2xl">
              {title ||
                (isSuccess
                  ? "Transaction Successful"
                  : "Transaction Incomplete")}
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/40">
              {message ||
                (isSuccess
                  ? "Your transaction has been successfully completed."
                  : "Your transaction could not be completed. Please try again.")}
            </p>

          </div>

          {/* =================================================
              ACTIVITY DETAILS
          ================================================== */}

          {(activity || amount || asset) && (
            <div className="mt-7 overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">

              {/* Activity */}

              {activity && (
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5">
                  <span className="text-xs text-white/30">
                    Activity
                  </span>

                  <span className="text-sm font-medium text-white/75">
                    {activity}
                  </span>
                </div>
              )}

              {/* Amount */}

              {amount && (
                <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3.5">
                  <span className="text-xs text-white/30">
                    Amount
                  </span>

                  <span
                    className={`
                      text-sm
                      font-semibold
                      ${
                        isSuccess
                          ? "text-[#6DD054]"
                          : "text-white/60"
                      }
                    `}
                  >
                    {amount}
                  </span>
                </div>
              )}

              {/* Asset */}

              {asset && (
                <div className="flex items-center justify-between px-4 py-3.5">
                  <span className="text-xs text-white/30">
                    Asset
                  </span>

                  <span className="text-sm font-medium text-white/75">
                    {asset}
                  </span>
                </div>
              )}

            </div>
          )}

          {/* =================================================
              TRANSACTION HASH
          ================================================== */}

          {transactionHash && isSuccess && (
            <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3">

              <div className="flex items-center justify-between gap-4">

                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/25">
                    Transaction
                  </p>

                  <p className="mt-1 truncate font-mono text-xs text-white/45">
                    {transactionHash}
                  </p>
                </div>

                <button
                  type="button"
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-white/10
                    text-white/35
                    transition-all
                    hover:border-[#6DD054]/25
                    hover:bg-[#6DD054]/5
                    hover:text-[#6DD054]
                  "
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      transactionHash
                    );
                  }}
                >
                  <FiArrowUpRight size={14} />
                </button>

              </div>

            </div>
          )}

          {/* =================================================
              STATUS LABEL
          ================================================== */}

          <div className="mt-6 flex items-center justify-center gap-2">

            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${
                  isSuccess
                    ? "bg-[#6DD054] shadow-[0_0_8px_rgba(109,208,84,0.8)]"
                    : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                }
              `}
            />

            <span
              className={`
                text-[9px]
                font-medium
                uppercase
                tracking-[0.25em]
                ${
                  isSuccess
                    ? "text-[#6DD054]/60"
                    : "text-red-400/60"
                }
              `}
            >
              {isSuccess
                ? "Confirmed"
                : "Action not completed"}
            </span>

          </div>

          {/* =================================================
              CLOSE BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={onClose}
            className="
              mt-7
              w-full
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              px-5
              py-3
              text-sm
              font-medium
              text-white/60
              transition-all
              duration-300
              hover:border-[#6DD054]/20
              hover:bg-[#6DD054]/5
              hover:text-white
            "
          >
            Done
          </button>

        </div>

        {/* =====================================================
            BOTTOM ACCENT
        ====================================================== */}

        <div
          className={`
            h-px
            w-full
            ${
              isSuccess
                ? "bg-gradient-to-r from-transparent via-[#6DD054]/40 to-transparent"
                : "bg-gradient-to-r from-transparent via-red-400/30 to-transparent"
            }
          `}
        />
      </div>

      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes modalOverlayIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @keyframes modalCardIn {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes statusIcon {
            0% {
              opacity: 0;
              transform: scale(0.5) rotate(-15deg);
            }

            70% {
              opacity: 1;
              transform: scale(1.12) rotate(3deg);
            }

            100% {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }

          @keyframes statusRing {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }

            60% {
              opacity: 1;
              transform: scale(1.05);
            }

            100% {
              opacity: 0;
              transform: scale(1.2);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  );
}