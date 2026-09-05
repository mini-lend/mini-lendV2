import { useEffect, useState } from "react";

export default function WalletTransferAnimation() {
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const start = setInterval(() => {
      setSending(true);

      setTimeout(() => {
        setSending(false);
      }, 2400);
    }, 4500);

    return () => clearInterval(start);
  }, []);

  return (
    <div className="relative h-[320px] w-full max-w-md overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0b0e0b] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(109,208,84,0.09),transparent_48%)]" />

      <div
        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6DD054]/[0.055]"
        style={{ filter: "blur(80px)" }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Top/bottom subtle gradients */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />


      {/* =====================================================
          AMBIENT PARTICLES
      ====================================================== */}

      <span
        className="absolute left-[14%] top-[22%] h-[3px] w-[3px] rounded-full bg-white/60"
        style={{
          animation: "starGlow 3s ease-in-out infinite",
        }}
      />

      <span
        className="absolute left-[42%] top-[15%] h-[3px] w-[3px] rounded-full bg-[#6DD054]"
        style={{
          animation: "starGlow 2.5s ease-in-out infinite",
        }}
      />

      <span
        className="absolute right-[17%] top-[27%] h-[3px] w-[3px] rounded-full bg-white/50"
        style={{
          animation: "starGlow 2.2s ease-in-out infinite",
        }}
      />

      <span
        className="absolute left-[27%] bottom-[25%] h-[3px] w-[3px] rounded-full bg-[#6DD054]/70"
        style={{
          animation: "starGlow 2.8s ease-in-out infinite",
        }}
      />

      <span
        className="absolute right-[29%] bottom-[21%] h-[3px] w-[3px] rounded-full bg-white/40"
        style={{
          animation: "starGlow 3.2s ease-in-out infinite",
        }}
      />


      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="absolute left-6 top-6 z-30 flex items-center gap-3">

        {/* MiniLend mark */}
        <div className="relative flex h-8 w-8 items-center justify-center rounded-[10px] border border-[#6DD054]/20 bg-[#6DD054]/[0.08]">

          <div className="absolute inset-0 rounded-[10px] bg-[#6DD054]/10 blur-md" />

          <span className="relative text-xs font-bold text-[#6DD054]">
            M
          </span>

        </div>

        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/25">
            MiniLend
          </p>

          <p className="mt-1 text-sm font-medium tracking-[-0.01em] text-white/80">
            Liquidity transfer
          </p>
        </div>

      </div>


      {/* =====================================================
          SOURCE WALLET
      ====================================================== */}

      <div className="absolute left-7 top-1/2 z-20 -translate-y-1/2">

        <div className="relative">

          {/* Glow */}
          <div
            className="absolute inset-2 rounded-2xl bg-[#6DD054]/[0.08]"
            style={{ filter: "blur(18px)" }}
          />

          {/* Wallet */}
          <div className="relative flex h-[76px] w-[92px] items-center justify-center rounded-[18px] border border-white/[0.09] bg-gradient-to-br from-[#2a2e2a] via-[#202420] to-[#171a17] shadow-[0_20px_45px_rgba(0,0,0,0.5)]">

            {/* Wallet top flap */}
            <div className="absolute -top-[7px] left-3 right-3 h-[23px] rounded-[9px] border border-white/[0.08] bg-[#303530]" />

            {/* Flap highlight */}
            <div className="absolute left-4 right-4 top-[1px] h-px bg-white/[0.06]" />

            {/* Wallet bottom detail */}
            <div className="absolute bottom-3 left-3 right-3 h-px bg-white/[0.04]" />

            {/* Wallet clasp */}
            <div className="absolute right-3 top-1/2 flex h-5 w-6 -translate-y-1/2 items-center justify-center rounded-md border border-[#6DD054]/20 bg-[#6DD054]/[0.07]">

              <span className="h-[5px] w-[5px] rounded-full bg-[#6DD054]/80 shadow-[0_0_8px_rgba(109,208,84,0.7)]" />

            </div>

            {/* Dollar */}
            <span className="relative z-10 text-xl font-bold text-[#6DD054]">
              $
            </span>

          </div>

          {/* Label */}
          <div className="mt-3 text-center">

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/20">
              Source
            </p>

            <p className="mt-1 text-[11px] font-medium text-white/45">
              Your Wallet
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          TRANSFER CONNECTION
      ====================================================== */}

      <div className="absolute left-[29%] right-[26%] top-1/2 z-10 -translate-y-1/2">

        {/* Connection background */}
        <div className="relative h-px w-full bg-white/[0.055]">

          {/* Static center glow */}
          <div className="absolute left-1/2 top-1/2 h-8 w-24 -translate-x-1/2 -translate-y-1/2 bg-[#6DD054]/[0.025] blur-xl" />

          {/* Animated energy */}
          <div
            className="absolute left-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6DD054]/80 to-transparent"
            style={{
              width: sending ? "100%" : "0%",
              transition:
                "width 2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Moving particles */}
          {sending && (
            <>
              <span
                className="absolute -top-[2px] left-0 h-[4px] w-[4px] rounded-full bg-[#6DD054] shadow-[0_0_10px_rgba(109,208,84,0.8)]"
                style={{
                  animation:
                    "particleOne 1.5s cubic-bezier(0.4,0,0.2,1) infinite",
                }}
              />

              <span
                className="absolute -top-[1.5px] left-0 h-[3px] w-[3px] rounded-full bg-[#6DD054]/70"
                style={{
                  animation:
                    "particleTwo 1.5s 0.35s cubic-bezier(0.4,0,0.2,1) infinite",
                }}
              />

              <span
                className="absolute -top-[1.5px] left-0 h-[3px] w-[3px] rounded-full bg-[#6DD054]/50"
                style={{
                  animation:
                    "particleThree 1.5s 0.7s cubic-bezier(0.4,0,0.2,1) infinite",
                }}
              />
            </>
          )}

        </div>

        {/* Connection nodes */}

        <div
          className={`absolute -left-[3px] -top-[3px] h-[7px] w-[7px] rounded-full border ${
            sending
              ? "border-[#6DD054]/60 bg-[#6DD054]/20"
              : "border-white/[0.08] bg-[#0b0e0b]"
          } transition-all duration-500`}
        />

        <div
          className={`absolute -right-[3px] -top-[3px] h-[7px] w-[7px] rounded-full border ${
            sending
              ? "border-[#6DD054]/60 bg-[#6DD054]/20 shadow-[0_0_12px_rgba(109,208,84,0.35)]"
              : "border-white/[0.08] bg-[#0b0e0b]"
          } transition-all duration-500`}
        />

      </div>


      {/* =====================================================
          LIQUIDITY TOKEN
      ====================================================== */}

      <div
        className="absolute left-[31%] top-1/2 z-30 -translate-y-1/2"
        style={{
          transform: sending
            ? "translate(160px, -50%) scale(1)"
            : "translate(0, -50%) scale(0.55)",
          opacity: sending ? 1 : 0,
          transition:
            "transform 2s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease",
        }}
      >

        <div className="relative">

          {/* Outer glow */}
          <div
            className="absolute -inset-2 rounded-full bg-[#6DD054]/20"
            style={{ filter: "blur(12px)" }}
          />

          {/* Token */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#6DD054]/50 bg-gradient-to-br from-[#83e96e] via-[#6DD054] to-[#51b63e] shadow-[0_0_30px_rgba(109,208,84,0.45)]">

            <span className="text-lg font-bold text-[#071006]">
              $
            </span>

            {/* Highlight */}
            <span className="absolute left-[10px] top-[8px] h-[5px] w-[5px] rounded-full bg-white/75" />

            {/* Edge */}
            <div className="absolute inset-[3px] rounded-full border border-white/20" />

          </div>

        </div>

      </div>


      {/* =====================================================
          DESTINATION
      ====================================================== */}

      <div className="absolute right-7 top-1/2 z-20 -translate-y-1/2">

        <div className="relative">

          {/* Glow */}
          <div
            className={`absolute inset-0 rounded-full bg-[#6DD054]/[0.08] ${
              sending ? "scale-125" : "scale-100"
            }`}
            style={{
              filter: "blur(18px)",
              transition: "transform 0.6s ease",
            }}
          />

          {/* Destination */}
          <div
            className={`relative flex h-[76px] w-[76px] items-center justify-center rounded-full border ${
              sending
                ? "border-[#6DD054]/45 bg-[#6DD054]/[0.09]"
                : "border-[#6DD054]/20 bg-[#6DD054]/[0.035]"
            }`}
            style={{
              transform: sending ? "scale(1.08)" : "scale(1)",
              transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
            }}
          >

            {/* Inner ring */}
            <div
              className={`absolute inset-[8px] rounded-full border ${
                sending
                  ? "border-[#6DD054]/20"
                  : "border-[#6DD054]/[0.08]"
              } transition-colors duration-500`}
            />

            {/* Arrow */}
            <svg
              width="27"
              height="27"
              viewBox="0 0 24 24"
              fill="none"
              className={`relative z-10 ${
                sending
                  ? "text-[#6DD054]"
                  : "text-[#6DD054]/70"
              } transition-colors duration-500`}
            >
              <path
                d="M12 19V5M6.5 10.5L12 5L17.5 10.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          </div>

          {/* Label */}
          <div className="mt-3 text-center">

            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/20">
              Destination
            </p>

            <p className="mt-1 text-[11px] font-medium text-white/45">
              Liquidity
            </p>

          </div>

        </div>

      </div>


      {/* =====================================================
          STATUS BAR
      ====================================================== */}

      <div className="absolute bottom-5 left-6 right-6 z-40 flex items-center justify-between">

        {/* Security */}
        <div className="flex items-center gap-2">

          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02]">

            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white/35"
            >
              <path
                d="M12 3L19 6V11C19 16 16 19 12 21C8 19 5 16 5 11V6L12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />

              <path
                d="M9 12L11 14L15 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          </div>

          <span className="text-[9px] font-medium tracking-wide text-white/25">
            Secured by MiniLend
          </span>

        </div>


        {/* Status */}
        <div
          className={`flex items-center gap-2 rounded-full border px-2.5 py-1 ${
            sending
              ? "border-[#6DD054]/15 bg-[#6DD054]/[0.05]"
              : "border-white/[0.05] bg-white/[0.015]"
          } transition-all duration-500`}
        >

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              sending
                ? "animate-pulse bg-[#6DD054] shadow-[0_0_8px_rgba(109,208,84,0.7)]"
                : "bg-[#6DD054]/60"
            }`}
          />

          <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#6DD054]/75">
            {sending ? "Transferring" : "Ready"}
          </span>

        </div>

      </div>


      {/* =====================================================
          ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes starGlow {
            0%, 100% {
              opacity: 0.12;
              transform: scale(0.7);
            }

            50% {
              opacity: 1;
              transform: scale(1.8);
            }
          }

          @keyframes particleOne {
            0% {
              transform: translateX(0);
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            85% {
              opacity: 1;
            }

            100% {
              transform: translateX(150px);
              opacity: 0;
            }
          }

          @keyframes particleTwo {
            0% {
              transform: translateX(0);
              opacity: 0;
            }

            15% {
              opacity: 0.8;
            }

            85% {
              opacity: 0.8;
            }

            100% {
              transform: translateX(150px);
              opacity: 0;
            }
          }

          @keyframes particleThree {
            0% {
              transform: translateX(0);
              opacity: 0;
            }

            15% {
              opacity: 0.6;
            }

            85% {
              opacity: 0.6;
            }

            100% {
              transform: translateX(150px);
              opacity: 0;
            }
          }
        `}
      </style>

    </div>
  );
}