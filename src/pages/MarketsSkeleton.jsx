export default function MarketsSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      {/* HEADER */}
      <div className="border-b border-white/[0.07]">
        <div className="px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="h-9 w-36 animate-pulse rounded-xl bg-white/[0.07]" />

          <div className="mt-6 h-3 w-16 animate-pulse rounded bg-white/[0.07]" />

          <div className="mt-2 h-8 w-56 animate-pulse rounded-lg bg-white/[0.08]" />

          <div className="mt-3 h-3 w-80 max-w-full animate-pulse rounded bg-white/[0.05]" />
        </div>
      </div>

      {/* CONTENT */}
      <main className="flex-1 px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* OVERVIEW CARDS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="
                rounded-2xl
                border border-white/[0.07]
                bg-white/[0.025]
                p-5
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="h-3 w-24 animate-pulse rounded bg-white/[0.06]" />

                  <div className="mt-4 h-7 w-28 animate-pulse rounded-lg bg-white/[0.08]" />
                </div>

                <div className="h-10 w-10 animate-pulse rounded-xl bg-white/[0.07]" />
              </div>

              <div className="mt-5 h-3 w-40 animate-pulse rounded bg-white/[0.05]" />
            </div>
          ))}
        </section>

        {/* MARKET HEADER */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="h-5 w-36 animate-pulse rounded bg-white/[0.08]" />

            <div className="mt-2 h-3 w-48 animate-pulse rounded bg-white/[0.05]" />
          </div>

          <div className="h-10 w-full animate-pulse rounded-xl bg-white/[0.05] sm:w-64" />
        </div>

        {/* MARKET TABLE */}
        <div
          className="
            overflow-hidden
            rounded-2xl
            border border-white/[0.07]
            bg-white/[0.025]
          "
        >
          {/* TABLE HEADER */}
          <div
            className="
              hidden
              md:grid
              grid-cols-5
              gap-4
              px-6
              py-4
              border-b
              border-white/[0.07]
            "
          >
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]"
              />
            ))}
          </div>

          {/* MARKET ROWS */}
          <div className="space-y-1 p-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-4
                  rounded-xl
                  px-2
                  py-4
                "
              >
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-white/[0.07]" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 animate-pulse rounded bg-white/[0.07]" />
                  <div className="h-2.5 w-16 animate-pulse rounded bg-white/[0.05]" />
                </div>

                <div className="hidden h-3 w-16 animate-pulse rounded bg-white/[0.06] md:block" />

                <div className="hidden h-3 w-16 animate-pulse rounded bg-white/[0.06] md:block" />

                <div className="hidden h-3 w-20 animate-pulse rounded bg-white/[0.06] md:block" />

                <div className="h-8 w-20 animate-pulse rounded-lg bg-white/[0.06]" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FOOTER SKELETON */}
      <div className="border-t border-white/[0.07] px-5 py-6 sm:px-6 lg:px-8">
        <div className="h-3 w-32 animate-pulse rounded bg-white/[0.05]" />
      </div>
    </div>
  );
}