import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import DashboardHeader from "../components/DashboardHeader";
import PositionOverview from "../components/PositionOverview";
import CollateralCard from "../components/CollateralCard";
import DebtCard from "../components/DebtCard";
import HealthCard from "../components/HealthCard";
import LiquidityOpportunity from "../components/LiquidityOpportunity";
import ActionButtons from "../components/ActionButtons";
import Activity from "../components/Activity";
import Footer from "../components/Footer";
import DashboardSkeleton from "../components/DashboardSkeleton";

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show skeleton first whenever Dashboard mounts/refreshed
    const timer = setTimeout(() => {
      setLoading(false);

      // Start dashboard fade-in after skeleton disappears
      requestAnimationFrame(() => {
        setVisible(true);
      });
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  // Show skeleton before dashboard
  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div
      className={`min-h-screen bg-[#0d0d0d] text-white transition-opacity duration-500 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-h-screen lg:ml-64">
        <DashboardHeader
          onMenuClick={() => setMobileOpen(true)}
        />

        <div className="p-5 sm:p-6 lg:p-8">
          <section className="mb-8">
            <p className="text-xs font-medium uppercase tracking-wider text-[#6DD054] sm:text-sm">
              Overview
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Your Position
            </h1>

            <p className="mt-2 max-w-xl text-sm text-white/40">
              Monitor your collateral, borrowing position and
              overall lending health.
            </p>
          </section>

          <section className="mb-6">
            <PositionOverview />
          </section>

          <section className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <CollateralCard />
            <DebtCard />
            <HealthCard />
          </section>

          <section className="mb-6">
            <LiquidityOpportunity />
          </section>

          <section className="mb-6">
            <ActionButtons />
          </section>

          <section className="mb-6">
            <Activity />
          </section>

          <Footer />
        </div>
      </main>
    </div>
  );
}