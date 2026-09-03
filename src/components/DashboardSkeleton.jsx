import { useEffect, useState } from "react";

export default function DashboardSkeleton({ onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Start fading out shortly before the dashboard appears.
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
        bg-[#080908]
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
          border-white/[0.07]
          bg-[#0b0c0b]
          lg:block
        "
      >
        <div className="flex h-20 items-center px-6">
          <div className="h-9 w-9 animate-pulse rounded-xl bg-white/[0.08]" />

          <div className="ml-3 space-y-2">
            <div className="h-3 w-12 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-3 w-14 animate-pulse rounded bg-white/[0.08]" />
          </div>
        </div>

        <div className="space-y-3 px-4 pt-8">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex h-11 items-center gap-3 rounded-xl px-3"
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
      <main className="lg:ml-64">
        {/* HEADER */}
        <header
          className="
            flex
            h-20
            items-center
            justify-between
            border-b
            border-white/[0.07]
            px-5
            sm:px-8
          "
        >
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-white/[0.08]" />
            <div className="h-3 w-48 animate-pulse rounded bg-white/[0.05]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.07]" />

            <div className="hidden space-y-2 sm:block">
              <div className="h-3 w-24 animate-pulse rounded bg-white/[0.08]" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />
            </div>
          </div>
        </header>

        {/* BODY */}
        <div className="p-5 sm:p-8">
          {/* TITLE */}
          <div className="mb-8 space-y-3">
            <div className="h-7 w-48 animate-pulse rounded-lg bg-white/[0.08]" />
            <div className="h-3 w-72 max-w-full animate-pulse rounded bg-white/[0.05]" />
          </div>

          {/* BALANCE CARDS */}
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-5
                "
              >
                <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />

                <div className="mt-5 h-7 w-32 animate-pulse rounded-lg bg-white/[0.08]" />

                <div className="mt-4 h-2.5 w-20 animate-pulse rounded bg-white/[0.05]" />
              </div>
            ))}
          </div>

          {/* CHART + ACTIVITY */}
          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            {/* CHART */}
            <div
              className="
                min-h-[340px]
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
            >
              <div className="h-4 w-32 animate-pulse rounded bg-white/[0.08]" />

              <div className="mt-3 h-3 w-48 animate-pulse rounded bg-white/[0.05]" />

              <div className="mt-10 flex h-52 items-end gap-3">
                {[35, 55, 40, 70, 50, 80, 60, 90, 65, 75, 50, 85].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="
                        flex-1
                        animate-pulse
                        rounded-t-lg
                        bg-white/[0.06]
                      "
                      style={{ height: `${height}%` }}
                    />
                  )
                )}
              </div>
            </div>

            {/* ACTIVITY */}
            <div
              className="
                min-h-[340px]
                rounded-2xl
                border
                border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
            >
              <div className="h-4 w-32 animate-pulse rounded bg-white/[0.08]" />

              <div className="mt-6 space-y-5">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/[0.07]" />

                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-24 animate-pulse rounded bg-white/[0.07]" />
                      <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />
                    </div>

                    <div className="h-3 w-14 animate-pulse rounded bg-white/[0.06]" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM CARDS */}
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="
                  rounded-2xl
                  border
                  border-white/[0.07]
                  bg-white/[0.025]
                  p-6
                "
              >
                <div className="h-4 w-28 animate-pulse rounded bg-white/[0.08]" />

                <div className="mt-5 h-10 w-40 animate-pulse rounded-lg bg-white/[0.07]" />

                <div className="mt-5 h-3 w-full animate-pulse rounded bg-white/[0.05]" />

                <div className="mt-3 h-3 w-3/4 animate-pulse rounded bg-white/[0.05]" />

                <div className="mt-6 h-10 w-32 animate-pulse rounded-xl bg-white/[0.07]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}