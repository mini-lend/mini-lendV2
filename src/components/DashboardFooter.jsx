import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiMail, FiArrowUp } from "react-icons/fi";

export default function DashboardFooter() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#080a08] text-white">
      <div className="mx-auto w-full max-w-[1450px] px-6 py-14 sm:px-8 lg:px-10">
        {/* =====================================================
            MAIN FOOTER CONTENT
        ====================================================== */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* =================================================
              BRAND
          ================================================== */}
          <div className="max-w-md">
            {/* LOGO */}

            <button
              type="button"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");

                  setTimeout(() => {
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }, 100);
                } else {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }
              }}
              className="group inline-flex items-center gap-2.5 text-left"
            >
              <div
                className="
                  relative
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-xl
                  bg-[#6DD054]
                  shadow-[0_0_25px_rgba(109,208,84,0.12)]
                  transition-all
                  duration-300
                  group-hover:scale-105
                  group-hover:shadow-[0_0_30px_rgba(109,208,84,0.25)]
                "
              >
                <img
                  className="w-[50px] object-contain"
                  src="/favicon.png"
                  alt="MiniLend Logo"
                />

                <div
                  className="
                    absolute
                    -right-5
                    -top-5
                    h-10
                    w-10
                    rounded-full
                    bg-white/20
                    blur-md
                  "
                />
              </div>

              <div className="leading-none">
                <span className="block text-sm font-bold tracking-[0.15em] text-white">
                  MINI
                </span>

                <span className="block text-sm font-bold tracking-[0.15em] text-[#6DD054]">
                  LEND
                </span>
              </div>
            </button>

            {/* Description */}
            <p className="mt-7 max-w-[390px] text-[15px] leading-7 text-white/40">
              A decentralized lending protocol designed to give users simple and
              transparent access to crypto-backed liquidity.
            </p>

            {/* Protocol Status */}
            <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#65d84a]/10 bg-[#65d84a]/[0.05] px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#65d84a] shadow-[0_0_10px_rgba(101,216,74,0.6)]" />

              <span className="text-xs font-medium text-white/45">
                Protocol online
              </span>
            </div>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">
              {/* GitHub */}
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MiniLend GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                <FiGithub size={19} />
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="MiniLend Twitter"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                <FiTwitter size={18} />
              </a>

              {/* Email */}
              <a
                href="mailto:support@minilend.io"
                aria-label="Email MiniLend"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-white/70 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
              >
                <FiMail size={18} />
              </a>
            </div>
          </div>

          {/* =================================================
              APP
          ================================================== */}
          <div>
            <h3 className="mb-6 text-[13px] font-bold uppercase tracking-[0.18em] text-white">
              App
            </h3>

            <div className="flex flex-col gap-5">
              <Link
                to="/markets"
                className="text-[15px] text-white/45 transition-colors duration-200 hover:text-white"
              >
                Markets
              </Link>

              <Link
                to="/activity"
                className="text-[15px] text-white/45 transition-colors duration-200 hover:text-white"
              >
                Activity
              </Link>

              <Link
                to="/help"
                className="text-[15px] text-white/45 transition-colors duration-200 hover:text-white"
              >
                Help Center
              </Link>
            </div>
          </div>

          {/* =================================================
              RESOURCES
          ================================================== */}
          <div>
            <h3 className="mb-6 text-[13px] font-bold uppercase tracking-[0.18em] text-white">
              Resources
            </h3>

            <div className="flex flex-col gap-5">
              <Link
                to="/whitepaper"
                className="text-[15px] text-white/80 transition-colors duration-200 hover:text-white"
              >
                White Paper
              </Link>

              <Link
                to="/docs"
                className="text-[15px] text-white/80 transition-colors duration-200 hover:text-white"
              >
                Documentation
              </Link>

              <Link
                to="/help"
                className="text-[15px] text-white/45 transition-colors duration-200 hover:text-white"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* =================================================
              LEGAL
          ================================================== */}
          <div>
            <h3 className="mb-6 text-[13px] font-bold uppercase tracking-[0.18em] text-white">
              Legal
            </h3>

            <div className="flex flex-col gap-5">
              <Link
                to="/privacy"
                className="text-[15px] text-white/80 transition-colors duration-200 hover:text-white"
              >
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                className="text-[15px] text-white/80 transition-colors duration-200 hover:text-white"
              >
                Terms of Use
              </Link>

              <Link
                to="/risk-disclosure"
                className="text-[15px] text-white/80 transition-colors duration-200 hover:text-white"
              >
                Risk Disclosure
              </Link>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM DIVIDER
        ====================================================== */}
        <div className="mt-14 border-t border-white/[0.07]" />

        {/* =====================================================
            BOTTOM FOOTER
        ====================================================== */}
        <div className="flex flex-col gap-5 pt-7 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright */}
          <p className="text-[13px] text-white/30">
            © {new Date().getFullYear()} MiniLend.eth. All rights reserved.
          </p>

          {/* Center Status */}
          <div className="flex items-center gap-2 text-[13px] text-white/35">
            <span className="h-2.5 w-2.5 rounded-full bg-[#65d84a]" />
            Built for decentralized finance
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[14px] text-white/40 transition-colors duration-200 hover:text-white"
          >
            <span>Back to top</span>

            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] transition-all duration-200 group-hover:border-white/20 group-hover:bg-white/[0.04]">
              <FiArrowUp
                size={17}
                className="transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
