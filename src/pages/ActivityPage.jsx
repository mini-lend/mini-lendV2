import { useState } from "react";
import {
  FiArrowLeft,
  FiActivity,
  FiTrendingUp,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import ActivityFilters from "../activity/ActivityFilters";
import ActivityList from "../activity/ActivityList";
import useActivity from "../hooks/useActivity";

export default function ActivityPage() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const { activities, summary, loading, error, refetchActivities } =
    useActivity();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="border-b border-white/[0.07]">
        <div className="px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
              inline-flex
              items-center
              gap-2
              mb-6
              px-3.5
              py-2
              rounded-xl
              border
              border-white/10
              bg-white/[0.03]
              text-sm
              text-white/60
              hover:text-white
              hover:border-[#6DD054]/30
              hover:bg-[#6DD054]/[0.06]
              transition-all
              duration-200
            "
          >
            <FiArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-start gap-3">
            <div
              className="
                hidden
                sm:flex
                w-11
                h-11
                rounded-xl
                bg-[#6DD054]/10
                border
                border-[#6DD054]/15
                items-center
                justify-center
                text-[#6DD054]
              "
            >
              <FiActivity size={20} />
            </div>

            <div>
              <p
                className="
                  text-xs
                  sm:text-sm
                  text-[#6DD054]
                  font-medium
                  uppercase
                  tracking-wider
                "
              >
                Activity
              </p>

              <h1
                className="
                  mt-1
                  text-2xl
                  sm:text-3xl
                  font-bold
                  tracking-tight
                "
              >
                Transaction History
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  text-white/40
                  max-w-xl
                "
              >
                View and track your MiniLend lending activity, transactions and
                position changes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="px-5 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="
              mb-5
              rounded-2xl
              border
              border-red-500/20
              bg-red-500/[0.05]
              px-4
              py-3
              text-sm
              text-red-300
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            SUMMARY
        ================================================== */}

        <section
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-3
            gap-4
            mb-8
          "
        >
          <SummaryCard
            icon={FiActivity}
            label="Total Transactions"
            value={summary.totalTransactions.toLocaleString()}
            description="All recorded transactions"
          />

          <SummaryCard
            icon={FiTrendingUp}
            label="Total Supplied"
            value={`${summary.totalSupplied.toLocaleString(undefined, {
              maximumFractionDigits: 6,
            })} ETH`}
            description="Total ETH supplied through staking"
          />

          <SummaryCard
            icon={FiDollarSign}
            label="Total Borrowed"
            value={`${summary.totalBorrowed.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })} USDC`}
            description="Total USDC borrowed"
          />
        </section>

        {/* =================================================
            FILTERS
        ================================================== */}

        <section className="mb-5">
          <ActivityFilters
            filter={filter}
            setFilter={setFilter}
            search={search}
            setSearch={setSearch}
          />
        </section>

        {/* =================================================
            ACTIVITY HEADER
        ================================================== */}

        <section>
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Transactions</h2>

              <p className="mt-1 text-xs text-white/35">
                Your MiniLend activity recorded on-chain
              </p>
            </div>

            <button
              type="button"
              onClick={refetchActivities}
              disabled={loading}
              className="
                inline-flex
                items-center
                gap-2
                px-3
                py-2
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                text-xs
                text-white/50
                hover:text-white
                hover:border-[#6DD054]/30
                transition
                disabled:opacity-40
                disabled:cursor-not-allowed
              "
            >
              <FiRefreshCw
                size={13}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <ActivityList
            activities={activities}
            filter={filter}
            search={search}
            loading={loading}
          />
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ icon: Icon, label, value, description }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#111111]/80
        p-5
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-white/35">{label}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight">{value}</p>
        </div>

        <div
          className="
            w-10
            h-10
            rounded-xl
            bg-[#6DD054]/10
            border
            border-[#6DD054]/15
            flex
            items-center
            justify-center
            text-[#6DD054]
          "
        >
          <Icon size={18} />
        </div>
      </div>

      <p className="mt-4 text-xs text-white/25">{description}</p>
    </div>
  );
}
