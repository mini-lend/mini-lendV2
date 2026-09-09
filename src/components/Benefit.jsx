import { useState } from "react";
import GetStarted from "../components/GetStarted"; // Removed curly braces since it's a default export
import {
  FiArrowRight,
  FiArrowUpRight,
  FiStar,
  FiCheckCircle,
  FiShield,
  FiX,
} from "react-icons/fi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import WalletTransferAnimation from "./WalletTransferAnimation";

/* =========================================================
   SCROLL REVEAL
========================================================= */

function ScrollReveal({
  children,
  className = "",
  delay = 0,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Animate only once
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.12,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        transform
        transition-all
        duration-700
        ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100"
            : "translate-y-10 opacity-0"
        }
        ${className}
      `}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   BENEFITS
========================================================= */

export default function Benefits() {
  const [modalOpen, setModalOpen] = useState(false);

  const benefitPoints = [
    "Keep your assets",
    "Access stablecoins",
    "Stay in control",
    "Simple borrowing",
  ];

  return (
    <>
      {/* =====================================================
          BENEFITS SECTION
      ====================================================== */}
      <section className="bg-[#080908] py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          {/* =====================================================
              MAIN SECTION HEADING
          ====================================================== */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="logo text-[#6DD054] text-xs tracking-[0.2em] uppercase mb-3">
              Why MiniLend
            </p>

            <h2
              className="
                logo
                text-3xl
                font-semibold
                leading-tight
                text-white
                md:text-4xl
                lg:text-5xl
              "
            >
              Built to make
              <span className="text-[#6DD054]"> crypto lending simple.</span>
            </h2>

            <p className="logo text-white/50 text-sm md:text-base leading-relaxed mt-4">
              Access liquidity without giving up your crypto. MiniLend gives you
              a simple and secure way to borrow while keeping your assets
              working for you.
            </p>
          </div>

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-14">
            {/* =================================================
                LEFT SIDE — WALLET ANIMATION
            ================================================== */}
            <div className="w-full lg:w-[52%]">
              <h3 className="logo text-white text-2xl md:text-3xl text-center font-bold mb-8">
                Benefits of <span className="text-[#6DD054]">choosing us</span>
              </h3>

              {/* WALLET TRANSFER ANIMATION */}
              <div className="w-full flex justify-center">
                <WalletTransferAnimation />
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}
            <div className="w-full max-w-lg text-white">
              {/* LABEL */}

              <p
                className="
                  logo
                  mb-4
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-[#6DD054]
                "
              >
                Why MiniLend
              </p>

              {/* HEADING */}

              <h3
                className="
                  logo
                  text-3xl
                  font-semibold
                  leading-tight
                  md:text-4xl
                "
              >
                Access liquidity without
                <span className="text-[#6DD054]"> selling your crypto.</span>
              </h3>

              {/* DESCRIPTION */}
              <p className="logo text-white/70 leading-relaxed mt-6">
                MiniLend lets you stake your crypto to get instant stablecoin
                loans while still earning rewards. It's secure, easy to use, and
                designed to make decentralized borrowing simple.
              </p>

              {/* =================================================
                  BENEFIT POINTS
              ================================================== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                {/* BENEFIT 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6DD054]/10 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-[#6DD054] text-sm" />
                  </div>

                  <span className="logo text-sm text-white/80">
                    Keep your assets
                  </span>
                </div>

                {/* BENEFIT 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6DD054]/10 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-[#6DD054] text-sm" />
                  </div>

                  <span className="logo text-sm text-white/80">
                    Access stablecoins
                  </span>
                </div>

                {/* BENEFIT 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6DD054]/10 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-[#6DD054] text-sm" />
                  </div>

                  <span className="logo text-sm text-white/80">
                    Stay in control
                  </span>
                </div>

                {/* BENEFIT 4 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#6DD054]/10 flex items-center justify-center shrink-0">
                    <FiCheckCircle className="text-[#6DD054] text-sm" />
                  </div>

                  <span className="logo text-sm text-white/80">
                    Simple borrowing
                  </span>
                </div>
              </div>

              {/* =================================================
                  CTA
              ================================================== */}
              <div className="flex justify-start">
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="
                    logo
                    group
                    flex
                    items-center
                    gap-3
                    text-[#6DD054]
                    text-xs
                    border
                    border-[#6DD054]/50
                    rounded-[14px]
                    px-8
                    h-[42px]
                    mt-9
                    hover:bg-[#6DD054]
                    hover:text-black
                    hover:-translate-y-0.5
                    transition-all
                    duration-300
                  "
                >
                  GET STARTED                         
                </button>
              </div>

              {/* =================================================
                  TESTIMONIAL
              ================================================== */}
              <div
                className="
                  mt-10
                  p-5
                  rounded-2xl
                  border
                  border-white/10
                  bg-black/10
                "
              >
                {/* STARS */}
                <div className="flex gap-1 text-[#6DD054] mb-3">
                  <FiStar className="text-sm fill-current" />
                  <FiStar className="text-sm fill-current" />
                  <FiStar className="text-sm fill-current" />
                  <FiStar className="text-sm fill-current" />
                  <FiStar className="text-sm fill-current" />
                </div>

                {/* QUOTE */}
                <p className="logo text-sm leading-relaxed text-white/70">
                  "MiniLend makes accessing liquidity feel simple. I don't have
                  to sell my crypto just because I need stablecoins."
                </p>

                {/* USER */}
                <div className="flex items-center gap-3 mt-4">
                  <div
                    className="
                      mb-3
                      flex
                      gap-1
                      text-[#6DD054]
                    "
                  >
                    <span className="logo text-xs text-[#6DD054]">M</span>
                  </div>

                  <div>
                    <p className="logo text-xs font-semibold text-white">
                      MiniLend User
                    </p>

                    <p className="logo text-[10px] text-white/40">
                      Early Access User
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CONNECT WALLET MODAL
      ====================================================== */}
      <GetStarted isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
