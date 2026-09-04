import { FiDollarSign, FiLock, FiTrendingUp, FiActivity } from "react-icons/fi";
import { formatEther, formatUnits } from "viem";
import { useMLending } from "../hooks/useMLending";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function PositionOverview() {
  const { fetchUserPosition, fetchUsdValue } = useMLending();
  const { address: account } = useAccount();
  const [positionData, setPositionData] = useState({
    stakedAsset: "",
    stakedAmount: "",
    debtAsset: "",
    debtAmount: "",
  });
  const [collateralValue, setCollateralValue] = useState(0); // Usd value of the staked asset
  const [debtValue, setDebtValue] = useState(0); // usd value of the debt asset

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Step 1: Fetch position data first
        const position = await fetchUserPosition(account);
        if (!position) {
          console.error("Failed to fetch position");
          return;
        }

        // Handle case where debtAsset might be empty
        const debtAmount = position.debtAsset ? position.debtAmount : 0;

        // Update position data state
        setPositionData({
          stakedAsset: position.stakedAsset,
          stakedAmount: position.stakedAmount,
          debtAsset: position.debtAsset,
          debtAmount: debtAmount,
        });

        // Step 2: Now fetch USD values using the position data we just got
        // console.log(
        //   "Fetching collateral value for:",
        //   position.stakedAsset,
        //   position.stakedAmount,
        // );

        const collateralVal = await fetchUsdValue(
          position.stakedAsset,
          position.stakedAmount,
        );
        setCollateralValue(collateralVal !== null ? collateralVal : 0);

        // Step 3: Fetch debt value
        if (position.debtAsset) {
          const debtVal = await fetchUsdValue(
            position.debtAsset,
            position.debtAmount,
          );
          setDebtValue(debtVal !== null ? debtVal : 0);
        } else {
          setDebtValue(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    if (account) {
      fetchAllData();
    }
  }, [account]);

  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#111111]/80
        backdrop-blur-xl
        p-5
        sm:p-6
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-white/40">Total Position</p>

          <h2 className="mt-1 text-2xl sm:text-3xl font-bold">$2,840.50</h2>
        </div>

        <div
          className="
            w-11
            h-11
            rounded-xl
            bg-[#6DD054]/10
            border
            border-[#6DD054]/20
            flex
            items-center
            justify-center
          "
        >
          <FiDollarSign className="text-[#6DD054]" size={20} />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat
          icon={FiLock}
          label="Collateral"
          value={`${formatEther(positionData.stakedAmount)} ETH`}
        />

        <Stat
          icon={FiTrendingUp}
          label="Collateral Value"
          value={`$${formatUnits(collateralValue, 18)}`}
        />

        <Stat
          icon={FiDollarSign}
          label="Debt"
          value={formatEther(positionData.debtAmount)}
        />

        <Stat icon={FiActivity} label="Health" value="Healthy" green />
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, green = false }) {
  return (
    <div
      className="
        rounded-xl
        border
        border-white/[0.07]
        bg-white/[0.025]
        p-4
      "
    >
      <div className="flex items-center gap-2">
        <Icon
          size={15}
          className={green ? "text-[#6DD054]" : "text-white/35"}
        />

        <span className="text-[11px] text-white/35">{label}</span>
      </div>

      <p
        className={`mt-2 text-sm font-semibold ${
          green ? "text-[#6DD054]" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
