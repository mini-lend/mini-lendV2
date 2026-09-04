
import { useEffect, useState } from "react";

export default function DashboardSkeleton({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1050);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) {
      const timer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);

  return (
    <div
      className={`
        min-h-screen
        bg-[#0d0d0d]
        text-white
        transition-opacity
        duration-300
        ease-out
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* SIDEBAR */}
      <aside
        className="
          fixed
          left-0
          top-0
          hidden
          h-screen
          w-64
          border-r
          border-white/10
          bg-[#0d0d0d]
          lg:block
        "
      >
        {/* Logo */}
        <div className="flex h-20 items-center px-6">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.08]" />

          <div className="ml-3 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-2.5 w-12 animate-pulse rounded bg-white/[0.05]" />
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-3 px-4 pt-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="
                flex
                h-11
                items-center
                gap-3
                rounded-xl
                px-3
              "
            >
              <div className="h-5 w-5 animate-pulse rounded bg-white/[0.07]" />

              <div
                className={`h-3 animate-pulse rounded bg-white/[0.07] ${
                  item % 2 === 0 ? "w-24" : "w-20"
                }`}
              />
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN */}
      <main className="min-h-screen lg:ml-64">

        {/* HEADER */}
        <header
          className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-white/10
            px-5
            sm:px-6
            lg:px-8
          "
        >
          {/* Left side */}
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-3 w-48 animate-pulse rounded bg-white/[0.05]" />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.07]" />

            <div className="hidden space-y-2 sm:block">
              <div className="h-3 w-24 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="p-5 sm:p-6 lg:p-8">

          {/* ========================================= */}
          {/* PAGE TITLE */}
          {/* Matches actual Dashboard section */}
          {/* ========================================= */}
          <section className="mb-8">
            <div className="h-3 w-20 animate-pulse rounded bg-[#6DD054]/20" />

            <div className="mt-3 h-9 w-56 animate-pulse rounded-lg bg-white/[0.08]" />

            <div className="mt-3 h-3 w-full max-w-xl animate-pulse rounded bg-white/[0.05]" />

            <div className="mt-2 h-3 w-80 max-w-full animate-pulse rounded bg-white/[0.04]" />
          </section>

          {/* ========================================= */}
          {/* POSITION OVERVIEW */}
          {/* Matches <PositionOverview /> */}
          {/* ========================================= */}
          <section className="mb-6">
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-5
                sm:p-6
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-3 w-32 animate-pulse rounded bg-white/[0.07]" />

                  <div className="mt-3 h-8 w-40 animate-pulse rounded-lg bg-white/[0.08]" />
                </div>

                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.07]" />
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="
                      rounded-xl
                      border
                      border-white/[0.06]
                      bg-white/[0.02]
                      p-4
                    "
                  >
                    <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />

                    <div className="mt-3 h-5 w-24 animate-pulse rounded bg-white/[0.07]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================= */}
          {/* COLLATERAL / DEBT / HEALTH */}
          {/* Matches actual 3-card grid */}
          {/* ========================================= */}
          <section className="mb-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    p-5
                    sm:p-6
                  "
                >
                  {/* Card heading */}
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-24 animate-pulse rounded bg-white/[0.07]" />

                    <div className="h-8 w-8 animate-pulse rounded-lg bg-white/[0.06]" />
                  </div>

                  {/* Main number */}
                  <div className="mt-5 h-8 w-32 animate-pulse rounded-lg bg-white/[0.08]" />

                  {/* Secondary text */}
                  <div className="mt-3 h-3 w-24 animate-pulse rounded bg-white/[0.05]" />

                  {/* Progress / info */}
                  <div className="mt-6 h-2 w-full animate-pulse rounded-full bg-white/[0.06]" />

                  <div className="mt-4 flex justify-between">
                    <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />
                    <div className="h-2.5 w-12 animate-pulse rounded bg-white/[0.05]" />
                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* ========================================= */}
          {/* LIQUIDITY OPPORTUNITY */}
          {/* Matches <LiquidityOpportunity /> */}
          {/* ========================================= */}
          <section className="mb-6">
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-5
                sm:p-6
              "
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex-1">
                  <div className="h-3 w-36 animate-pulse rounded bg-white/[0.07]" />

                  <div className="mt-4 h-6 w-56 animate-pulse rounded-lg bg-white/[0.08]" />

                  <div className="mt-3 h-3 w-full max-w-lg animate-pulse rounded bg-white/[0.05]" />

                  <div className="mt-2 h-3 w-72 max-w-full animate-pulse rounded bg-white/[0.04]" />
                </div>

                <div className="h-11 w-32 animate-pulse rounded-xl bg-white/[0.07]" />
              </div>
            </div>
          </section>

          {/* ========================================= */}
          {/* ACTION BUTTONS */}
          {/* Matches <ActionButtons /> */}
          {/* ========================================= */}
          <section className="mb-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="
                    h-12
                    animate-pulse
                    rounded-xl
                    border
                    border-white/[0.07]
                    bg-white/[0.04]
                  "
                />
              ))}

            </div>
          </section>

          {/* ========================================= */}
          {/* ACTIVITY */}
          {/* Matches <Activity /> */}
          {/* ========================================= */}
          <section className="mb-6">
            <div
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                p-5
                sm:p-6
              "
            >
              {/* Activity heading */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-28 animate-pulse rounded bg-white/[0.08]" />

                  <div className="mt-2 h-2.5 w-40 animate-pulse rounded bg-white/[0.05]" />
                </div>

                <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.06]" />
              </div>

              {/* Activity rows */}
              <div className="mt-6 divide-y divide-white/[0.05]">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-center
                      gap-3
                      py-4
                    "
                  >
                    {/* Icon */}
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/[0.07]" />

                    {/* Text */}
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="h-3 w-28 animate-pulse rounded bg-white/[0.07]" />

                      <div className="h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
                    </div>

                    {/* Amount */}
                    <div className="h-3 w-16 animate-pulse rounded bg-white/[0.06]" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ========================================= */}
          {/* FOOTER */}
          {/* Matches DashboardFooter */}
          {/* ========================================= */}
          <div className="mt-8 border-t border-white/10 pt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-2.5 w-40 animate-pulse rounded bg-white/[0.04]" />
              </div>

              <div className="flex gap-4">
                <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
                <div className="h-3 w-20 animate-pulse rounded bg-white/[0.05]" />
                <div className="h-3 w-16 animate-pulse rounded bg-white/[0.05]" />
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

