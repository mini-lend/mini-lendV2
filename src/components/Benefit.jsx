import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiStar,
  FiCheckCircle,
  FiShield,
  FiX,
} from "react-icons/fi";

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

      <section
        className="
          overflow-hidden
          bg-[#080908]
          py-20
        "
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10">

          {/* =====================================================
              MAIN SECTION HEADING
          ====================================================== */}

          <ScrollReveal
            className="
              mx-auto
              mb-14
              max-w-2xl
              text-center
            "
          >
            <p
              className="
                logo
                mb-3
                text-xs
                uppercase
                tracking-[0.2em]
                text-[#6DD054]
              "
            >
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

              <span className="text-[#6DD054]">
                {" "}crypto lending simple.
              </span>
            </h2>

            <p
              className="
                logo
                mt-4
                text-sm
                leading-relaxed
                text-white/50
                md:text-base
              "
            >
              Access liquidity without giving up your crypto.
              MiniLend gives you a simple and secure way to borrow
              while keeping your assets working for you.
            </p>
          </ScrollReveal>


          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <div
            className="
              flex
              flex-col
              items-center
              justify-between
              gap-14
              lg:flex-row
            "
          >

            {/* =================================================
                LEFT SIDE — WALLET ANIMATION
            ================================================== */}

            <ScrollReveal
              className="w-full lg:w-[52%]"
              delay={100}
            >
              <h3
                className="
                  logo
                  mb-8
                  text-center
                  text-2xl
                  font-bold
                  text-white
                  md:text-3xl
                "
              >
                Benefits of{" "}

                <span className="text-[#6DD054]">
                  choosing us
                </span>
              </h3>

              {/* WALLET TRANSFER ANIMATION */}

              <div className="flex w-full justify-center">
                <WalletTransferAnimation />
              </div>
            </ScrollReveal>


            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <ScrollReveal
              className="w-full max-w-lg text-white"
              delay={220}
            >

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

                <span className="text-[#6DD054]">
                  {" "}selling your crypto.
                </span>
              </h3>


              {/* DESCRIPTION */}

              <p
                className="
                  logo
                  mt-6
                  leading-relaxed
                  text-white/70
                "
              >
                MiniLend lets you stake your crypto to get instant
                stablecoin loans while still earning rewards. It's
                secure, easy to use, and designed to make
                decentralized borrowing simple.
              </p>


              {/* =================================================
                  BENEFIT POINTS
              ================================================== */}

              <div
                className="
                  mt-7
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >

                {benefitPoints.map((point, index) => (
                  <ScrollReveal
                    key={point}
                    delay={350 + index * 100}
                  >
                    <div className="flex items-center gap-3">

                      <div
                        className="
                          flex
                          h-8
                          w-8
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-[#6DD054]/10
                          transition-all
                          duration-300
                          hover:scale-110
                          hover:bg-[#6DD054]/15
                        "
                      >
                        <FiCheckCircle
                          className="
                            text-sm
                            text-[#6DD054]
                          "
                        />
                      </div>

                      <span
                        className="
                          logo
                          text-sm
                          text-white/80
                        "
                      >
                        {point}
                      </span>

                    </div>
                  </ScrollReveal>
                ))}

              </div>


              {/* =================================================
                  CTA
              ================================================== */}

              <ScrollReveal delay={750}>
                <div className="flex justify-start">

                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="
                      logo
                      group
                      mt-9
                      flex
                      h-[42px]
                      items-center
                      gap-3
                      rounded-[14px]
                      border
                      border-[#6DD054]/50
                      px-8
                      text-xs
                      text-[#6DD054]
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      hover:bg-[#6DD054]
                      hover:text-black
                    "
                  >
                    GET STARTED

                    <FiArrowRight
                      className="
                        text-sm
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                    />
                  </button>

                </div>
              </ScrollReveal>


              {/* =================================================
                  TESTIMONIAL
              ================================================== */}

              <ScrollReveal delay={850}>
                <div
                  className="
                    mt-10
                    rounded-2xl
                    border
                    border-white/10
                    bg-black/10
                    p-5
                    transition-all
                    duration-300
                    hover:border-[#6DD054]/20
                    hover:bg-[#6DD054]/[0.02]
                  "
                >

                  {/* STARS */}

                  <div
                    className="
                      mb-3
                      flex
                      gap-1
                      text-[#6DD054]
                    "
                  >
                    <FiStar className="text-sm fill-current" />
                    <FiStar className="text-sm fill-current" />
                    <FiStar className="text-sm fill-current" />
                    <FiStar className="text-sm fill-current" />
                    <FiStar className="text-sm fill-current" />
                  </div>


                  {/* QUOTE */}

                  <p
                    className="
                      logo
                      text-sm
                      leading-relaxed
                      text-white/70
                    "
                  >
                    "MiniLend makes accessing liquidity feel simple.
                    I don't have to sell my crypto just because I
                    need stablecoins."
                  </p>


                  {/* USER */}

                  <div className="mt-4 flex items-center gap-3">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#6DD054]/20
                        bg-[#6DD054]/10
                      "
                    >
                      <span
                        className="
                          logo
                          text-xs
                          text-[#6DD054]
                        "
                      >
                        M
                      </span>
                    </div>


                    <div>

                      <p
                        className="
                          logo
                          text-xs
                          font-semibold
                          text-white
                        "
                      >
                        MiniLend User
                      </p>

                      <p
                        className="
                          logo
                          text-[10px]
                          text-white/40
                        "
                      >
                        Early Access User
                      </p>

                    </div>

                  </div>

                </div>
              </ScrollReveal>

            </ScrollReveal>

          </div>

        </div>
      </section>


      {/* =====================================================
          CONNECT WALLET MODAL
      ====================================================== */}

      {modalOpen && (
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
            backdrop-blur-md
          "
          onClick={() => setModalOpen(false)}
        >

          <div
            className="
              relative
              w-full
              max-w-md
              rounded-3xl
              border
              border-white/10
              bg-[#111311]
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.6)]
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label="Close wallet modal"
              className="
                absolute
                right-4
                top-4
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                text-white/40
                transition
                hover:border-white/20
                hover:bg-white/[0.04]
                hover:text-white
              "
            >
              <FiX />
            </button>


            {/* ICON */}

            <div
              className="
                mx-auto
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-2xl
                bg-[#6DD054]/10
              "
            >
              <FiShield className="text-2xl text-[#6DD054]" />
            </div>


            {/* TITLE */}

            <h2
              className="
                mt-5
                text-center
                text-xl
                font-bold
                text-white
              "
            >
              Connect Your Wallet
            </h2>


            {/* DESCRIPTION */}

            <p
              className="
                mx-auto
                mt-2
                max-w-sm
                text-center
                text-sm
                leading-6
                text-white/40
              "
            >
              Connect your wallet to start staking assets and access
              stablecoin loans through MiniLend.
            </p>


            {/* CONNECT WALLET */}

            <button
              type="button"
              id="connectWalletBtn"
              className="
                group
                mt-6
                flex
                h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#6DD054]
                text-sm
                font-bold
                text-[#0b1609]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#7ae360]
                active:scale-[0.98]
              "
            >
              Connect Wallet

              <FiArrowUpRight
                className="
                  transition-transform
                  duration-300
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                "
              />
            </button>


            {/* TERMS */}

            <p
              className="
                mt-4
                text-center
                text-[10px]
                leading-5
                text-white/25
              "
            >
              By connecting, you agree to our{" "}

              <a
                href="#"
                className="
                  text-white/50
                  underline
                  underline-offset-2
                  hover:text-white
                "
              >
                Terms of Use
              </a>

              {" "}and{" "}

              <a
                href="#"
                className="
                  text-white/50
                  underline
                  underline-offset-2
                  hover:text-white
                "
              >
                Privacy Policy
              </a>

              .
            </p>

          </div>

        </div>
      )}

    </>
  );
}