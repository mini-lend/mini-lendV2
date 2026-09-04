import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import DashboardSkeleton from "../components/DashboardSkeleton";

import {
  FiArrowUpRight,
  FiMenu,
  FiX,
  FiCircle,
  FiFileText,
} from "react-icons/fi";

export default function Navbar() {
  const { address, isConnected } = useAccount();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ============================================================
  // CENTER NAVIGATION
  // ============================================================

  const navItems = [
    {
      label: "How It Works",
      id: "how-it-works",
    },
    {
      label: "FAQ",
      id: "faq",
    },
  ];

  // ============================================================
  // SCROLL BACKGROUND
  // ============================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ============================================================
  // ACTIVE SECTION
  // ============================================================

  useEffect(() => {
    if (location.pathname !== "/") return;

    const updateActiveSection = () => {
      const sections = navItems
        .map((item) => ({
          id: item.id,
          element: document.getElementById(item.id),
        }))
        .filter((item) => item.element);

      const scrollPosition = window.scrollY + 140;

      let currentSection = "home";

      for (const section of sections) {
        if (scrollPosition >= section.element.offsetTop) {
          currentSection = section.id;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname]);

  // ============================================================
  // HASH NAVIGATION
  // ============================================================

  useEffect(() => {
    if (location.pathname !== "/") return;

    const hash = window.location.hash;

    if (!hash) return;

    const id = hash.replace("#", "");

    const timeout = setTimeout(() => {
      const section = document.getElementById(id);

      if (!section) return;

      const navbarOffset = 110;

      const position =
        section.getBoundingClientRect().top +
        window.scrollY -
        navbarOffset;

      window.scrollTo({
        top: position,
        behavior: "smooth",
      });

      setActiveSection(id);
    }, 100);

    return () => clearTimeout(timeout);
  }, [location.pathname, location.hash]);

  // ============================================================
  // CLOSE MOBILE MENU
  // ============================================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // ============================================================
  // SCROLL TO SECTION
  // ============================================================

  const scrollToSection = (id) => {
    closeMobileMenu();

    // If user is not on Landing page,
    // navigate to Landing first.
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);

    if (!section) return;

    const navbarOffset = 110;

    const position =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    setActiveSection(id);

    window.history.replaceState(
      null,
      "",
      id === "home" ? "/" : `/#${id}`
    );

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  // ============================================================
  // RESIZE
  // ============================================================

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // ============================================================
  // REDIRECT WHEN WALLET CONNECTS
  // ============================================================

  useEffect(() => {
    // Only trigger this behavior from the landing page.
    if (location.pathname !== "/") return;

    // Do nothing until wallet is actually connected.
    if (!address || !isConnected) return;

    // Show dashboard skeleton immediately.
    setDashboardLoading(true);

    // Keep skeleton visible briefly so the transition
    // feels intentional instead of flashing.
    const timer = setTimeout(() => {
      navigate("/dashboard", {
        replace: true,
      });

      console.log(`Connected account: ${address}`);
    }, 1200);

    return () => clearTimeout(timer);
  }, [address, isConnected, location.pathname, navigate]);

  // ============================================================
  // DASHBOARD LOADING SKELETON
  // ============================================================

  if (dashboardLoading) {
    return <DashboardSkeleton />;
  }

  // ============================================================
  // NAVBAR
  // ============================================================

  return (
    <header
      className={`
        fixed
        top-4
        left-1/2
        z-50
        w-[calc(100%-2rem)]
        -translate-x-1/2
        rounded-2xl
        border
        transition-all
        duration-300
        sm:w-[calc(100%-3rem)]
        lg:w-[calc(100%-5rem)]
        max-w-7xl

        ${
          scrolled
            ? `
              border-white/[0.10]
              bg-[#0c0c0c]/95
              shadow-[0_18px_50px_rgba(0,0,0,0.45)]
              backdrop-blur-2xl
            `
            : `
              border-white/[0.08]
              bg-[#101010]/90
              backdrop-blur-xl
            `
        }
      `}
    >
      {/* =====================================================
          MAIN NAVBAR
      ====================================================== */}

      <div className="relative flex h-[64px] items-center px-4 sm:px-6 lg:px-7">
        {/* =================================================
            LOGO
        ================================================== */}

        <button
          type="button"
          onClick={() => scrollToSection("home")}
          className="
            group
            flex
            shrink-0
            items-center
            gap-2.5
          "
        >
          <div className="relative">
            <img
              src="/favicon.png"
              alt="MiniLend Logo"
              className="h-[46px] w-[46px] object-contain"
            />

            <div
              className="
                absolute
                -right-4
                -top-4
                h-8
                w-8
                rounded-full
                bg-white/15
                opacity-70
                blur-md
                transition-transform
                duration-500
                group-hover:translate-x-2
                group-hover:translate-y-2
              "
            />
          </div>

          <div className="leading-none text-left">
            <span className="block text-sm font-bold tracking-[0.12em] text-white">
              MINI
            </span>

            <span className="block text-sm font-bold tracking-[0.12em] text-[#6DD054]">
              LEND
            </span>
          </div>
        </button>

        {/* =================================================
            CENTER MENU
        ================================================== */}

        <nav
          className="
            absolute
            left-1/2
            hidden
            -translate-x-1/2
            items-center
            gap-1
            md:flex
          "
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`
                  group
                  relative
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  px-4
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        border-[#6DD054]/10
                        bg-[#6DD054]/[0.08]
                        text-white
                      `
                      : `
                        border-transparent
                        text-white/55
                        hover:border-white/[0.07]
                        hover:bg-white/[0.05]
                        hover:text-white
                      `
                  }
                `}
              >
                {item.label}

                <span
                  className={`
                    absolute
                    bottom-1
                    left-4
                    right-4
                    h-px
                    origin-center
                    bg-[#6DD054]
                    transition-transform
                    duration-300

                    ${
                      isActive
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }
                  `}
                />
              </button>
            );
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================== */}

        <div className="ml-auto flex items-center gap-1.5">
          {/* =================================================
              WHITE PAPER - DESKTOP
          ================================================== */}

          <Link
            to="/whitepaper"
            className="
              group
              hidden
              items-center
              gap-1.5
              rounded-xl
              border
              border-transparent
              px-3
              py-2.5
              text-xs
              font-medium
              text-white/55
              transition-all
              duration-200
              hover:border-white/[0.07]
              hover:bg-white/[0.05]
              hover:text-white
              lg:flex
            "
          >
            <FiFileText
              className="
                text-white/35
                transition-colors
                group-hover:text-[#6DD054]
              "
            />

            White Paper

            <FiArrowUpRight
              className="
                text-white/20
                transition-all
                duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                group-hover:text-[#6DD054]
              "
            />
          </Link>

          
          {/* =================================================
              CONNECT WALLET
          ================================================== */}

          <ConnectButton
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            showBalance={{
              smallScreen: false,
              largeScreen: true,
            }}
            label="Sign in"
          />

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================== */}

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={
              mobileOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileOpen}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-white/10
              bg-white/[0.04]
              text-white
              transition-all
              hover:border-[#6DD054]/30
              hover:bg-[#6DD054]/10
              hover:text-[#6DD054]
              md:hidden
            "
          >
            {mobileOpen ? (
              <FiX className="text-xl" />
            ) : (
              <FiMenu className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* =====================================================
          MOBILE MENU
      ====================================================== */}

      <div
        className={`
          grid
          transition-all
          duration-300
          ease-out
          md:hidden

          ${
            mobileOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4">
            <div className="border-t border-white/[0.07] pt-3">
              {/* MOBILE NAVIGATION */}

              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className={`
                        group
                        flex
                        w-full
                        items-center
                        justify-between
                        rounded-xl
                        border
                        px-3
                        py-3
                        text-left
                        text-sm
                        font-medium
                        transition-all
                        duration-200

                        ${
                          isActive
                            ? `
                              border-[#6DD054]/10
                              bg-[#6DD054]/[0.08]
                              text-white
                            `
                            : `
                              border-transparent
                              text-white/60
                              hover:border-white/[0.07]
                              hover:bg-white/[0.05]
                              hover:text-white
                            `
                        }
                      `}
                    >
                      {item.label}

                      <FiArrowUpRight
                        className={`
                          transition-all
                          duration-200

                          ${
                            isActive
                              ? "text-[#6DD054]"
                              : "text-white/20 group-hover:text-[#6DD054]"
                          }
                        `}
                      />
                    </button>
                  );
                })}

                {/* =================================================
                    WHITE PAPER - MOBILE
                ================================================== */}

                <Link
                  to="/whitepaper"
                  onClick={closeMobileMenu}
                  className="
                    group
                    flex
                    w-full
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-transparent
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-white/60
                    transition-all
                    hover:border-white/[0.07]
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  <span className="flex items-center gap-3">
                    <FiFileText className="text-[#6DD054]" />
                    White Paper
                  </span>

                  <FiArrowUpRight
                    className="
                      text-white/20
                      transition-all
                      group-hover:text-[#6DD054]
                    "
                  />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
}