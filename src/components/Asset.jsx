import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiTrendingUp,
  FiLayers,
  FiShield,
} from "react-icons/fi";

import ConnectWalletModal from "./ConnectWalletModal";

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
   ASSETS
========================================================= */

export default function Assets() {
  const [modalOpen, setModalOpen] = useState(false);

  const assets = [
    {
      name: "Ethereum",
      symbol: "ETH",
      network: "Ethereum",
      description:
        "Use ETH as collateral to access stablecoin liquidity without selling your position.",
      icon: "Ξ",
      status: "Supported",
    },
    {
      name: "Wrapped Ether",
      symbol: "WETH",
      network: "Ethereum",
      description:
        "Wrapped Ether can be supplied as collateral for decentralized borrowing.",
      icon: "W",
      status: "Supported",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      network: "Ethereum",
      description:
        "A stable digital asset designed for predictable value and liquidity.",
      icon: "$",
      status: "Supported",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      network: "Base",
      description:
        "Access stablecoin liquidity across the Base network through MiniLend.",
      icon: "$",
      status: "Supported",
    },
  ];

  const stats = [
    {
      label: "Networks",
      value: "Ethereum & Base",
      icon: FiLayers,
    },
    {
      label: "Supported Assets",
      value: "4 Assets",
      icon: FiTrendingUp,
    },
    {
      label: "Asset Role",
      value: "Collateral",
      icon: FiShield,
    },
  ];

  const flowItems = [
    ["01", "Deposit"],
    ["02", "Collateral"],
    ["03", "Borrow"],
    ["04", "Repay"],
  ];

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#080908] pt-32 pb-24 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

          {/* =================================================
              HERO
          ================================================== */}

          <ScrollReveal className="mx-auto max-w-3xl text-center">

            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-[#6DD054]/20
                bg-[#6DD054]/[0.05]
                px-4
                py-2
                text-xs
                font-medium
                text-[#6DD054]
              "
            >
              <FiLayers />

              Supported Assets
            </div>

            <h1
              className="
                logo
                mt-6
                text-4xl
                font-bold
                leading-tight
                tracking-tight
                sm:text-5xl
                md:text-6xl
              "
            >
              Assets built for

              <span className="text-[#6DD054]">
                {" "}liquidity.
              </span>
            </h1>

            <p
              className="
                logo
                mx-auto
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-white/50
                sm:text-base
                sm:leading-8
              "
            >
              MiniLend supports selected digital assets that can be used
              as collateral to access stablecoin liquidity while keeping
              control of your underlying position.
            </p>

          </ScrollReveal>


          {/* =================================================
              QUICK STATS
          ================================================== */}

          <section className="mt-16">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <ScrollReveal
                    key={stat.label}
                    delay={index * 120}
                  >
                    <div
                      className="
                        group
                        h-full
                        rounded-2xl
                        border
                        border-white/[0.08]
                        bg-white/[0.02]
                        p-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#6DD054]/20
                        hover:bg-white/[0.035]
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
                            border-[#6DD054]/15
                            bg-[#6DD054]/10
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        >
                          <Icon className="text-[#6DD054]" />
                        </div>

                        <div>
                          <p className="text-xs text-white/40">
                            {stat.label}
                          </p>

                          <p className="text-lg font-semibold text-white">
                            {stat.value}
                          </p>
                        </div>

                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}

            </div>

          </section>


          {/* =================================================
              ASSETS
          ================================================== */}

          <section className="mt-24">

            {/* SECTION HEADER */}

            <ScrollReveal>

              <div
                className="
                  mb-8
                  flex
                  flex-col
                  gap-5
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >

                <div>

                  <p
                    className="
                      logo
                      text-xs
                      uppercase
                      tracking-[0.2em]
                      text-[#6DD054]
                    "
                  >
                    Available Assets
                  </p>

                  <h2
                    className="
                      logo
                      mt-3
                      text-3xl
                      font-semibold
                      md:text-4xl
                    "
                  >
                    Supported digital assets
                  </h2>

                </div>

                <p
                  className="
                    logo
                    max-w-md
                    text-sm
                    leading-6
                    text-white/40
                  "
                >
                  These assets are currently configured for the MiniLend
                  lending experience.
                </p>

              </div>

            </ScrollReveal>


            {/* ASSET CARDS */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {assets.map((asset, index) => (
                <ScrollReveal
                  key={`${asset.symbol}-${asset.network}`}
                  delay={index * 120}
                >
                  <div
                    className="
                      group
                      relative
                      h-full
                      overflow-hidden
                      rounded-3xl
                      border
                      border-white/[0.08]
                      bg-white/[0.02]
                      p-6
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:border-[#6DD054]/25
                      hover:bg-white/[0.035]
                    "
                  >

                    {/* TOP */}

                    <div className="flex items-start justify-between">

                      <div className="flex items-center gap-4">

                        <div
                          className="
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/[0.04]
                            text-xl
                            font-bold
                            text-[#6DD054]
                            transition-all
                            duration-300
                            group-hover:border-[#6DD054]/20
                            group-hover:bg-[#6DD054]/[0.06]
                          "
                        >
                          {asset.icon}
                        </div>

                        <div>

                          <h3
                            className="
                              logo
                              text-lg
                              font-semibold
                              text-white
                            "
                          >
                            {asset.name}
                          </h3>

                          <p
                            className="
                              logo
                              mt-1
                              text-xs
                              text-white/40
                            "
                          >
                            {asset.symbol}
                          </p>

                        </div>

                      </div>


                      {/* STATUS */}

                      <div
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-full
                          border
                          border-[#6DD054]/15
                          bg-[#6DD054]/[0.05]
                          px-3
                          py-1.5
                        "
                      >
                        <FiCheckCircle
                          className="
                            text-xs
                            text-[#6DD054]
                          "
                        />

                        <span
                          className="
                            text-[10px]
                            font-medium
                            text-[#6DD054]
                          "
                        >
                          {asset.status}
                        </span>

                      </div>

                    </div>


                    {/* NETWORK */}

                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        border
                        border-white/[0.06]
                        bg-black/10
                        px-4
                        py-3
                      "
                    >
                      <span className="text-xs text-white/40">
                        Network
                      </span>

                      <span className="text-xs font-medium text-white/70">
                        {asset.network}
                      </span>
                    </div>


                    {/* DESCRIPTION */}

                    <p
                      className="
                        logo
                        mt-5
                        text-sm
                        leading-6
                        text-white/40
                      "
                    >
                      {asset.description}
                    </p>


                    {/* FOOTER */}

                    <div
                      className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        border-t
                        border-white/[0.06]
                        pt-5
                      "
                    >

                      <div className="flex items-center gap-2">

                        <FiLock className="text-sm text-[#6DD054]" />

                        <span className="text-xs text-white/45">
                          Available as collateral
                        </span>

                      </div>

                      <FiArrowRight
                        className="
                          text-white/25
                          transition-all
                          duration-300
                          group-hover:translate-x-1
                          group-hover:text-[#6DD054]
                        "
                      />

                    </div>


                    {/* HOVER ACCENT */}

                    <div
                      className="
                        absolute
                        bottom-0
                        left-6
                        right-6
                        h-px
                        origin-left
                        scale-x-0
                        bg-[#6DD054]
                        transition-transform
                        duration-300
                        group-hover:scale-x-100
                      "
                    />

                  </div>
                </ScrollReveal>
              ))}

            </div>

          </section>


          {/* =================================================
              HOW COLLATERAL WORKS
          ================================================== */}

          <ScrollReveal
            className="mt-24"
            delay={100}
          >
            <section>

              <div
                className="
                  rounded-3xl
                  border
                  border-white/[0.08]
                  bg-white/[0.02]
                  p-7
                  sm:p-10
                  lg:p-12
                "
              >

                <div
                  className="
                    grid
                    items-center
                    gap-12
                    lg:grid-cols-[0.8fr_1.2fr]
                  "
                >

                  {/* LEFT */}

                  <div>

                    <p
                      className="
                        logo
                        text-xs
                        uppercase
                        tracking-[0.2em]
                        text-[#6DD054]
                      "
                    >
                      How It Works
                    </p>

                    <h2
                      className="
                        logo
                        mt-4
                        text-3xl
                        font-semibold
                        leading-tight
                        md:text-4xl
                      "
                    >
                      Turn your assets into

                      <span className="text-[#6DD054]">
                        {" "}liquidity.
                      </span>
                    </h2>

                    <p
                      className="
                        logo
                        mt-5
                        max-w-md
                        text-sm
                        leading-7
                        text-white/40
                      "
                    >
                      Deposit a supported asset, use it as collateral,
                      access stablecoin liquidity, and repay your position
                      when you're ready.
                    </p>

                  </div>


                  {/* RIGHT FLOW */}

                  <div className="grid gap-3 sm:grid-cols-4">

                    {flowItems.map(([number, title], index) => (
                      <ScrollReveal
                        key={number}
                        delay={index * 100}
                      >
                        <div
                          className="
                            h-full
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-black/10
                            p-5
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:border-[#6DD054]/20
                            hover:bg-[#6DD054]/[0.025]
                          "
                        >

                          <span
                            className="
                              text-xs
                              font-bold
                              text-[#6DD054]
                            "
                          >
                            {number}
                          </span>

                          <h3
                            className="
                              logo
                              mt-8
                              text-sm
                              font-semibold
                              text-white
                            "
                          >
                            {title}
                          </h3>

                        </div>
                      </ScrollReveal>
                    ))}

                  </div>

                </div>

              </div>

            </section>
          </ScrollReveal>


          {/* =================================================
              RISK NOTICE
          ================================================== */}

          <ScrollReveal
            className="mt-8"
            delay={100}
          >
            <section>

              <div
                className="
                  flex
                  flex-col
                  items-start
                  gap-4
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.015]
                  p-5
                  sm:flex-row
                "
              >

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#6DD054]/15
                    bg-[#6DD054]/10
                  "
                >
                  <FiShield className="text-[#6DD054]" />
                </div>

                <div>

                  <h3
                    className="
                      logo
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    Important
                  </h3>

                  <p
                    className="
                      logo
                      mt-1
                      text-xs
                      leading-6
                      text-white/40
                    "
                  >
                    Supported assets, collateral requirements, borrowing
                    limits, and availability may change. Always review
                    the current terms of your position before depositing
                    or borrowing.
                  </p>

                </div>

              </div>

            </section>
          </ScrollReveal>


          {/* =================================================
              CTA
          ================================================== */}

          <ScrollReveal
            className="mt-20 text-center"
            delay={150}
          >
            <section>

              <p
                className="
                  logo
                  text-xs
                  uppercase
                  tracking-[0.2em]
                  text-[#6DD054]
                "
              >
                Ready to get started?
              </p>

              <h2
                className="
                  logo
                  mt-4
                  text-3xl
                  font-semibold
                  md:text-4xl
                "
              >
                Put your assets to work.
              </h2>

              <p
                className="
                  logo
                  mt-4
                  text-sm
                  text-white/40
                "
              >
                Connect your wallet and explore MiniLend.
              </p>

              <div className="flex justify-center">

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="
                    logo
                    mt-8
                    flex
                    h-[44px]
                    items-center
                    gap-3
                    rounded-[14px]
                    border
                    border-[#6DD054]/50
                    px-8
                    text-xs
                    font-medium
                    text-[#6DD054]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#6DD054]
                    hover:text-black
                  "
                >
                  CONNECT WALLET

                  <FiArrowRight className="text-sm" />
                </button>

              </div>

            </section>
          </ScrollReveal>

        </div>
      </main>


      {/* =====================================================
          REUSABLE WALLET MODAL
      ====================================================== */}

      <ConnectWalletModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}