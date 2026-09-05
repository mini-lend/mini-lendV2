import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";

import {
  FiGrid,
  FiTrendingUp,
  FiActivity,
  FiHelpCircle,
  FiX,
  FiAlertCircle,
  FiLogOut,
} from "react-icons/fi";

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiGrid,
    },
    {
      name: "Markets",
      path: "/markets",
      icon: FiTrendingUp,
    },
    {
      name: "Activity",
      path: "/activity",
      icon: FiActivity,
    },
  ];

  const bottomItems = [
    {
      name: "Help Center",
      path: "/help",
      icon: FiHelpCircle,
    },
  ];

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "Not Connected";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get connection status text
  const getConnectionStatus = () => {
    if (isConnected) return "Connected";
    return "Not Connected";
  };

  // Get connection status color
  const getConnectionColor = () => {
    if (isConnected) return "bg-[#6DD054]";
    return "bg-gray-500";
  };

  // Get wallet status text color
  const getStatusTextColor = () => {
    if (isConnected) return "text-[#6DD054]";
    return "text-gray-500";
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDisconnectModal(false);
  };

  return (
    <>
      {/* =====================================================
          MOBILE OVERLAY
      ====================================================== */}

      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-black/60
            backdrop-blur-sm
            lg:hidden
          "
        />
      )}

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-64
          bg-[#0d0d0d]
          border-r
          border-white/10
          flex
          flex-col
          transition-transform
          duration-300

          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        {/* =================================================
            LOGO
        ================================================== */}

        <div
          className="
            h-20
            px-6
            flex
            items-center
            justify-between
            border-b
            border-white/10
            shrink-0
          "
        >
          <div>
            <h1 className="text-white text-xl font-bold tracking-tight">
              MINI<span className="text-[#6DD054]">LEND</span>
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest mt-1">
              DECENTRALIZED LENDING
            </p>
          </div>

          {/* MOBILE CLOSE */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              lg:hidden
              w-9
              h-9
              rounded-lg
              flex
              items-center
              justify-center
              text-gray-400
              hover:text-white
              hover:bg-white/5
              transition
            "
          >
            <FiX size={20} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================== */}

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <p
            className="
              px-3
              mb-3
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.15em]
              text-gray-500
            "
          >
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                      group
                      flex
                      items-center
                      gap-3
                      px-3
                      py-3
                      rounded-xl
                      text-sm
                      font-medium
                      transition-all
                      duration-200

                      ${
                        isActive
                          ? `
                            bg-[#6DD054]/10
                            text-[#6DD054]
                            border
                            border-[#6DD054]/20
                          `
                          : `
                            text-gray-400
                            hover:text-white
                            hover:bg-white/5
                          `
                      }
                    `
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </div>

          {/* =================================================
              SUPPORT
          ================================================== */}

          <div className="mt-8">
            <p
              className="
                px-3
                mb-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-gray-500
              "
            >
              Support
            </p>

            <div className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `
                        flex
                        items-center
                        gap-3
                        px-3
                        py-3
                        rounded-xl
                        text-sm
                        font-medium
                        transition-all

                        ${
                          isActive
                            ? `
                              bg-[#6DD054]/10
                              text-[#6DD054]
                            `
                            : `
                              text-gray-400
                              hover:text-white
                              hover:bg-white/5
                            `
                        }
                      `
                    }
                  >
                    <Icon size={18} className="shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>

        {/* =================================================
            WALLET STATUS
        ================================================== */}

        <div className="px-4 pb-4 shrink-0">
          <div
            className={`
              rounded-2xl
              border
              p-4
              backdrop-blur-xl
              ${
                isConnected
                  ? "border-[#6DD054]/20 bg-[#111111]/80"
                  : "border-white/10 bg-[#111111]/50"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`
                    w-9
                    h-9
                    rounded-full
                    flex
                    items-center
                    justify-center
                    border
                    ${
                      isConnected
                        ? "bg-[#6DD054]/10 border-[#6DD054]/20"
                        : "bg-gray-500/10 border-gray-500/20"
                    }
                  `}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${getConnectionColor()}`}
                  />
                </div>

                <span
                  className={`
                    absolute
                    bottom-0
                    right-0
                    w-2.5
                    h-2.5
                    rounded-full
                    ${getConnectionColor()}
                    border-2
                    border-[#111111]
                  `}
                />
              </div>

              <div className="min-w-0">
                <p className={`text-xs ${getStatusTextColor()}`}>
                  {getConnectionStatus()}
                </p>
                <p className="text-sm text-white font-medium truncate">
                  {isConnected ? formatAddress(address) : "Not Connected"}
                </p>
                {isConnected && (
                  <p className="text-[10px] text-white/30 truncate mt-0.5">
                    {address}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (isConnected) {
                  setShowDisconnectModal(true);
                } else {
                  // Trigger connect wallet flow
                  // You can import and use useConnect from wagmi here
                  console.log("Connect wallet clicked");
                }
              }}
              className={`
                mt-4
                w-full
                flex
                items-center
                justify-center
                gap-2
                py-2.5
                rounded-xl
                text-black
                text-xs
                font-bold
                transition
                ${
                  isConnected
                    ? "bg-[#6DD054] hover:bg-[#7be663]"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }
              `}
            >
              {isConnected ? formatAddress(address) : "Connect Wallet"}
            </button>
          </div>
        </div>

        {/* =================================================
            FOOTER
        ================================================== */}

        <div
          className="
            px-6
            py-4
            border-t
            border-white/10
            shrink-0
          "
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-gray-600">MiniLend.eth</p>

            {/* DISCONNECT - Only show when connected */}
            {isConnected && (
              <button
                type="button"
                onClick={() => setShowDisconnectModal(true)}
                aria-label="Disconnect wallet"
                title="Disconnect wallet"
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-gray-500
                  hover:text-red-400
                  hover:bg-red-400/10
                  transition
                "
              >
                <FiLogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* =====================================================
          DISCONNECT MODAL
      ====================================================== */}

      {showDisconnectModal && (
        <div
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-center
            justify-center
            px-5
            bg-black/70
            backdrop-blur-sm
          "
          onClick={() => setShowDisconnectModal(false)}
        >
          <div
            className="
              w-full
              max-w-sm
              rounded-2xl
              border
              border-white/10
              bg-[#111111]
              p-6
              shadow-[0_20px_80px_rgba(0,0,0,0.55)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="flex items-start justify-between">
              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-red-400/10
                  border
                  border-red-400/20
                  flex
                  items-center
                  justify-center
                  text-red-400
                "
              >
                <FiAlertCircle size={21} />
              </div>

              <button
                type="button"
                onClick={() => setShowDisconnectModal(false)}
                aria-label="Close"
                className="
                  w-8
                  h-8
                  rounded-lg
                  flex
                  items-center
                  justify-center
                  text-white/40
                  hover:text-white
                  hover:bg-white/5
                  transition
                "
              >
                <FiX size={18} />
              </button>
            </div>

            {/* MODAL CONTENT */}
            <div className="mt-5">
              <h2 className="text-lg font-bold text-white">
                Disconnect Wallet?
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Are you sure you want to disconnect your wallet from MiniLend?
              </p>
              {address && (
                <p className="mt-2 text-xs text-white/30 font-mono">
                  {formatAddress(address)}
                </p>
              )}
            </div>

            {/* MODAL ACTIONS */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDisconnectModal(false)}
                className="
                  flex-1
                  h-11
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  text-sm
                  font-semibold
                  text-white/70
                  hover:bg-white/[0.08]
                  hover:text-white
                  transition
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                className="
                  flex-1
                  h-11
                  rounded-xl
                  bg-red-500
                  text-white
                  text-sm
                  font-bold
                  hover:bg-red-400
                  transition
                  active:scale-[0.98]
                "
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
