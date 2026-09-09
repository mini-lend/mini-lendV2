
import { useState } from "react";
import {
  FiArrowRight,
  FiCheckCircle,
  FiLock,
  FiTrendingUp,
  FiLayers,
  FiShield,
} from "react-icons/fi";

import GetStarted from "./GetStarted";

export default function Asset() {
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

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#080908] pt-4 pb-6 text-white">
        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* HERO */}
          <section className="mx-auto max-w-3xl text-center">
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
              <span className="text-[#6DD054]"> liquidity.</span>
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
              MiniLend supports selected digital assets that can be used as
              collateral to access stablecoin liquidity while keeping control
              of your underlying position.
            </p>
          </section>

          {/* QUICK STATS */}
          <section className="mt-16">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {/* NETWORKS */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6DD054]/15 bg-[#6DD054]/10">
                    <FiLayers className="text-[#6DD054]" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">Networks</p>

                    <p className="text-lg font-semibold text-white">
                      Ethereum & Base
                    </p>
                  </div>
                </div>
              </div>

              {/* SUPPORTED ASSETS */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6DD054]/15 bg-[#6DD054]/10">
                    <FiTrendingUp className="text-[#6DD054]" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">
                      Supported Assets
                    </p>

                    <p className="text-lg font-semibold text-white">
                      4 Assets
                    </p>
                  </div>
                </div>
              </div>

              {/* ASSET ROLE */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6DD054]/15 bg-[#6DD054]/10">
                    <FiShield className="text-[#6DD054]" />
                  </div>

                  <div>
                    <p className="text-xs text-white/40">Asset Role</p>

                    <p className="text-lg font-semibold text-white">
                      Collateral
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ASSETS */}
          <section className="mt-24">
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="logo text-xs uppercase tracking-[0.2em] text-[#6DD054]">
                  Available Assets
                </p>

                <h2 className="logo mt-3 text-3xl font-semibold md:text-4xl">
                  Supported digital assets
                </h2>
              </div>

              <p className="logo max-w-md text-sm leading-6 text-white/40">
                These assets are currently configured for the MiniLend lending
                experience.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {assets.map((asset) => (
                <div
                  key={`${asset.symbol}-${asset.network}`}
                  className="
                    group
                    relative
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
                  {/* HEADER */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="
                          flex
                          h-14
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-2xl
                          border
                          border-white/10
                          bg-white/[0.04]
                          text-xl
                          font-bold
                          text-[#6DD054]
                        "
                      >
                        {asset.icon}
                      </div>

                      <div>
                        <h3 className="logo text-lg font-semibold text-white">
                          {asset.name}
                        </h3>

                        <p className="logo mt-1 text-xs text-white/40">
                          {asset.symbol}
                        </p>
                      </div>
                    </div>

                    {/* STATUS */}
                    <div
                      className="
                        flex
                        shrink-0
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
                      <FiCheckCircle className="text-xs text-[#6DD054]" />

                      <span className="text-[10px] font-medium text-[#6DD054]">
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
                    <span className="text-xs text-white/40">Network</span>

                    <span className="text-xs font-medium text-white/70">
                      {asset.network}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="logo mt-5 text-sm leading-6 text-white/40">
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

                  {/* HOVER LINE */}
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
              ))}
            </div>
          </section>

          {/* HOW COLLATERAL WORKS */}
          <section className="mt-24">
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
              <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
                {/* LEFT */}
                <div>
                  <p className="logo text-xs uppercase tracking-[0.2em] text-[#6DD054]">
                    How It Works
                  </p>

                  <h2 className="logo mt-4 text-3xl font-semibold leading-tight md:text-4xl">
                    Turn your assets into
                    <span className="text-[#6DD054]"> liquidity.</span>
                  </h2>

                  <p className="logo mt-5 max-w-md text-sm leading-7 text-white/40">
                    Deposit a supported asset, use it as collateral, access
                    stablecoin liquidity, and repay your position when you're
                    ready.
                  </p>
                </div>

                {/* STEPS */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    ["01", "Deposit"],
                    ["02", "Collateral"],
                    ["03", "Borrow"],
                    ["04", "Repay"],
                  ].map(([number, title]) => (
                    <div
                      key={number}
                      className="
                        rounded-2xl
                        border
                        border-white/[0.07]
                        bg-black/10
                        p-5
                      "
                    >
                      <span className="text-xs font-bold text-[#6DD054]">
                        {number}
                      </span>

                      <h3 className="logo mt-8 text-sm font-semibold text-white">
                        {title}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RISK NOTICE */}
          <section className="mt-8">
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
                <h3 className="logo text-sm font-semibold text-white">
                  Important
                </h3>

                <p className="logo mt-1 text-xs leading-6 text-white/40">
                  Supported assets, collateral requirements, borrowing limits,
                  and availability may change. Always review the current terms
                  of your position before depositing or borrowing.
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 text-center">
            <p className="logo text-xs uppercase tracking-[0.2em] text-[#6DD054]">
              Ready to get started?
            </p>

            <h2 className="logo mt-4 text-3xl font-semibold md:text-4xl">
              Put your assets to work.
            </h2>

            <p className="logo mt-4 text-sm text-white/40">
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
        </div>
      </main>

      {/* WALLET MODAL */}
      <GetStarted
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

