import { useEffect, useState } from "react";

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame;
    const startTime = performance.now();
    const duration = 2600;

    const animateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const percentage = Math.min(elapsed / duration, 1);

      // Smooth progress easing
      const eased = 1 - Math.pow(1 - percentage, 3);

      setProgress(Math.floor(eased * 100));

      if (percentage < 1) {
        frame = requestAnimationFrame(animateProgress);
      } else {
        setProgress(100);

        setTimeout(() => {
          setReady(true);
        }, 150);
      }
    };

    frame = requestAnimationFrame(animateProgress);

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 350);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, 850);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [ready, onComplete]);

  const steps = [
    {
      label: "SECURE CONNECTION",
      threshold: 25,
    },
    {
      label: "LIQUIDITY ENGINE",
      threshold: 55,
    },
    {
      label: "SMART CONTRACTS",
      threshold: 85,
    },
  ];

  return (
    <div
      className={`
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-[#070807]
        transition-all
        duration-700
        ease-out
        ${
          fadeOut
            ? "scale-[1.035] opacity-0"
            : "scale-100 opacity-100"
        }
      `}
    >
      {/* =====================================================
          MAIN GRID
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.09]
          bg-[linear-gradient(to_right,rgba(109,208,84,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(109,208,84,0.22)_1px,transparent_1px)]
          bg-[size:55px_55px]
        "
      />

      {/* =====================================================
          FINE TECH GRID
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.025]
          bg-[linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.5)_1px,transparent_1px)]
          bg-[size:10px_10px]
        "
      />

      {/* =====================================================
          CENTER VIGNETTE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-[radial-gradient(circle_at_center,transparent_0%,transparent_28%,#070807_82%)]
        "
      />

      {/* =====================================================
          LARGE AMBIENT GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[520px]
          w-[520px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#6DD054]/[0.055]
          blur-[150px]
          animate-pulse
        "
      />

      {/* =====================================================
          INNER GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[260px]
          w-[260px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#6DD054]/[0.07]
          blur-[90px]
        "
      />

      {/* =====================================================
          SCANNING LINE
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          h-px
          w-full
          bg-[#6DD054]/30
          shadow-[0_0_18px_rgba(109,208,84,0.45)]
          animate-[screenScan_3.5s_linear_infinite]
        "
      />

      {/* =====================================================
          SMALL PARTICLES
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-[18%]
          top-[24%]
          h-1
          w-1
          rounded-full
          bg-[#6DD054]/70
          shadow-[0_0_12px_rgba(109,208,84,0.8)]
          animate-[particleOne_3s_ease-in-out_infinite]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[20%]
          top-[34%]
          h-1
          w-1
          rounded-full
          bg-[#6DD054]/50
          shadow-[0_0_10px_rgba(109,208,84,0.7)]
          animate-[particleTwo_4s_ease-in-out_infinite]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[25%]
          bottom-[28%]
          h-1
          w-1
          rounded-full
          bg-[#6DD054]/40
          animate-[particleThree_3.5s_ease-in-out_infinite]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[27%]
          bottom-[23%]
          h-1.5
          w-1.5
          rounded-full
          bg-[#6DD054]/40
          shadow-[0_0_12px_rgba(109,208,84,0.5)]
          animate-[particleTwo_4s_ease-in-out_infinite]
        "
      />

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6">

        {/* =================================================
            TOP SYSTEM LABEL
        ================================================== */}

        <div
          className="
            mb-8
            flex
            items-center
            gap-3
            text-[8px]
            font-medium
            uppercase
            tracking-[0.35em]
            text-white/25
          "
        >
          <span className="h-px w-8 bg-white/10" />

          <span>MINILEND PROTOCOL</span>

          <span className="h-px w-8 bg-white/10" />
        </div>

        {/* =================================================
            HUD LOGO AREA
        ================================================== */}

        <div className="relative flex h-[270px] w-[270px] items-center justify-center">

          {/* OUTER ROTATING RING */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-[#6DD054]/10
              animate-[rotateSlow_12s_linear_infinite]
            "
          />

          {/* SECOND RING */}

          <div
            className="
              absolute
              inset-[18px]
              rounded-full
              border
              border-dashed
              border-[#6DD054]/15
              animate-[rotateReverse_18s_linear_infinite]
            "
          />

          {/* THIRD RING */}

          <div
            className="
              absolute
              inset-[42px]
              rounded-full
              border
              border-[#6DD054]/10
            "
          />

          {/* ROTATING ARC */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-transparent
              border-t-[#6DD054]/60
              border-r-[#6DD054]/20
              animate-[rotateSlow_5s_linear_infinite]
            "
          />

          {/* CENTER GLOW */}

          <div
            className="
              absolute
              h-[130px]
              w-[130px]
              rounded-full
              bg-[#6DD054]/[0.08]
              blur-[40px]
              animate-pulse
            "
          />

          {/* CENTER LOGO */}

          <div className="relative flex flex-col items-center">

            <div
              className="
                text-[42px]
                font-black
                leading-none
                tracking-[-0.08em]
                text-white
                drop-shadow-[0_0_20px_rgba(109,208,84,0.25)]
              "
            >
              MINI
            </div>

            <div
              className="
                mt-1
                text-[42px]
                font-black
                leading-none
                tracking-[-0.08em]
                text-[#6DD054]
                drop-shadow-[0_0_22px_rgba(109,208,84,0.45)]
              "
            >
              LEND
            </div>

            {/* Logo shine */}

            <div
              className="
                pointer-events-none
                absolute
                left-0
                top-0
                h-full
                w-[2px]
                bg-white
                opacity-0
                shadow-[0_0_15px_5px_rgba(109,208,84,0.7)]
                animate-[logoSweep_2.8s_ease-in-out_infinite]
              "
            />
          </div>

          {/* TOP MARKER */}

          <div
            className="
              absolute
              left-1/2
              top-[-4px]
              h-2
              w-2
              -translate-x-1/2
              rounded-full
              bg-[#6DD054]
              shadow-[0_0_12px_3px_rgba(109,208,84,0.55)]
            "
          />

          {/* BOTTOM MARKER */}

          <div
            className="
              absolute
              bottom-[-4px]
              left-1/2
              h-1
              w-1
              -translate-x-1/2
              rounded-full
              bg-[#6DD054]/50
            "
          />
        </div>

        {/* =================================================
            STATUS
        ================================================== */}

        <div className="mt-5 text-center">

          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.42em]
              text-white/35
            "
          >
            {ready ? "Protocol Ready" : "Protocol Initializing"}
          </p>

          <div className="mt-3 flex items-center justify-center gap-2">

            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                bg-[#6DD054]
                shadow-[0_0_10px_rgba(109,208,84,0.9)]
                ${
                  ready
                    ? ""
                    : "animate-pulse"
                }
              `}
            />

            <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
              {ready
                ? "Secure connection established"
                : "Initializing secure environment"}
            </span>
          </div>
        </div>

        {/* =================================================
            PROGRESS
        ================================================== */}

        <div className="mt-8 w-full max-w-[280px]">

          <div className="mb-2 flex items-center justify-between">

            <span className="text-[8px] uppercase tracking-[0.25em] text-white/20">
              System Status
            </span>

            <span className="font-mono text-[9px] text-[#6DD054]/70">
              {String(progress).padStart(3, "0")}%
            </span>
          </div>

          <div
            className="
              h-[2px]
              w-full
              overflow-hidden
              rounded-full
              bg-white/[0.06]
            "
          >
            <div
              className="
                h-full
                rounded-full
                bg-[#6DD054]
                shadow-[0_0_12px_rgba(109,208,84,0.8)]
                transition-[width]
                duration-100
                ease-linear
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* =================================================
            SYSTEM CHECKS
        ================================================== */}

        <div className="mt-7 w-full max-w-[280px] space-y-2">

          {steps.map((step, index) => {
            const complete = progress >= step.threshold;

            return (
              <div
                key={step.label}
                className="
                  flex
                  items-center
                  justify-between
                  text-[8px]
                  uppercase
                  tracking-[0.2em]
                "
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-center gap-2">

                  <span
                    className={`
                      flex
                      h-3
                      w-3
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      duration-500
                      ${
                        complete
                          ? "border-[#6DD054]/40 bg-[#6DD054]/10"
                          : "border-white/10 bg-white/[0.02]"
                      }
                    `}
                  >
                    {complete && (
                      <span className="h-1 w-1 rounded-full bg-[#6DD054] shadow-[0_0_6px_#6DD054]" />
                    )}
                  </span>

                  <span
                    className={`
                      transition-colors
                      duration-500
                      ${
                        complete
                          ? "text-white/45"
                          : "text-white/15"
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                <span
                  className={`
                    font-mono
                    text-[7px]
                    transition-colors
                    duration-500
                    ${
                      complete
                        ? "text-[#6DD054]/60"
                        : "text-white/10"
                    }
                  `}
                >
                  {complete ? "READY" : "WAIT"}
                </span>
              </div>
            );
          })}
        </div>

        {/* =================================================
            BOTTOM BRANDING
        ================================================== */}

        <div className="mt-8 flex items-center gap-2">

          <div className="h-px w-5 bg-[#6DD054]/20" />

          <span
            className="
              text-[7px]
              uppercase
              tracking-[0.45em]
              text-white/15
            "
          >
            Decentralized Lending
          </span>

          <div className="h-px w-5 bg-[#6DD054]/20" />
        </div>
      </div>

      {/* =====================================================
          CORNER HUD ELEMENTS
      ====================================================== */}

      {/* TOP LEFT */}

      <div className="pointer-events-none absolute left-6 top-6">
        <div className="h-8 w-8 border-l border-t border-[#6DD054]/20" />

        <span className="absolute left-0 top-10 whitespace-nowrap font-mono text-[6px] tracking-[0.2em] text-white/10">
          ML / 001
        </span>
      </div>

      {/* TOP RIGHT */}

      <div className="pointer-events-none absolute right-6 top-6">
        <div className="h-8 w-8 border-r border-t border-[#6DD054]/20" />

        <span className="absolute right-0 top-10 whitespace-nowrap font-mono text-[6px] tracking-[0.2em] text-white/10">
          SECURE
        </span>
      </div>

      {/* BOTTOM LEFT */}

      <div className="pointer-events-none absolute bottom-6 left-6">
        <div className="h-8 w-8 border-b border-l border-[#6DD054]/20" />

        <span className="absolute bottom-10 left-0 whitespace-nowrap font-mono text-[6px] tracking-[0.2em] text-white/10">
          ETH / BASE
        </span>
      </div>

      {/* BOTTOM RIGHT */}

      <div className="pointer-events-none absolute bottom-6 right-6">
        <div className="h-8 w-8 border-b border-r border-[#6DD054]/20" />

        <span className="absolute bottom-10 right-0 whitespace-nowrap font-mono text-[6px] tracking-[0.2em] text-white/10">
          ONLINE
        </span>
      </div>

      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes rotateSlow {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes rotateReverse {
            from {
              transform: rotate(360deg);
            }

            to {
              transform: rotate(0deg);
            }
          }

          @keyframes screenScan {
            0% {
              transform: translateY(-10px);
              opacity: 0;
            }

            10% {
              opacity: 0.8;
            }

            50% {
              opacity: 0.4;
            }

            90% {
              opacity: 0.8;
            }

            100% {
              transform: translateY(100vh);
              opacity: 0;
            }
          }

          @keyframes logoSweep {
            0% {
              left: -20px;
              opacity: 0;
            }

            15% {
              opacity: 0.8;
            }

            55% {
              opacity: 0.8;
            }

            75% {
              opacity: 0;
            }

            100% {
              left: 110%;
              opacity: 0;
            }
          }

          @keyframes particleOne {
            0%,
            100% {
              transform: translate(0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate(20px, -25px);
              opacity: 1;
            }
          }

          @keyframes particleTwo {
            0%,
            100% {
              transform: translate(0, 0);
              opacity: 0.2;
            }

            50% {
              transform: translate(-25px, 20px);
              opacity: 0.9;
            }
          }

          @keyframes particleThree {
            0%,
            100% {
              transform: translate(0, 0);
              opacity: 0.15;
            }

            50% {
              transform: translate(15px, -18px);
              opacity: 0.7;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
            }
          }
        `}
      </style>
    </div>
  );
}