
import {
  FiArrowUpRight,
  FiGithub,
  FiTwitter,
  FiMail,
} from "react-icons/fi";

import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // ============================================================
  // PRODUCT LINKS
  // ============================================================

  const productLinks = [
    {
      label: "How It Works",
      id: "how-it-works",
    },
    {
      label: "Benefits",
      id: "benefits",
    },
    {
      label: "Supported Assets",
      id: "assets",
    },
    {
      label: "FAQ",
      id: "faq",
    },
  ];

  // ============================================================
  // RESOURCE LINKS
  // ============================================================

  const resourceLinks = [
    {
      label: "White Paper",
      to: "/whitepaper",
      page: true,
    },
    {
      label: "Documentation",
      to: "/docs",
      page: true,
    },
    {
      label: "Contact Us",
      id: "contact",
    },
  ];

  // ============================================================
  // LEGAL LINKS
  // ============================================================

  const legalLinks = [
    {
      label: "Privacy Policy",
      to: "/privacy",
      page: true,
    },
    {
      label: "Terms of Use",
      to: "/terms",
      page: true,
    },
    {
      label: "Risk Disclosure",
      to: "/risk-disclosure",
      page: true,
    },
  ];

  // ============================================================
  // SCROLL TO LANDING PAGE SECTION
  // ============================================================

  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);

    if (!section) {
      return;
    }

    const navbarOffset = 110;

    const position =
      section.getBoundingClientRect().top +
      window.scrollY -
      navbarOffset;

    window.history.replaceState(
      null,
      "",
      `/#${id}`
    );

    window.scrollTo({
      top: position,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#080908] text-white">

      {/* =====================================================
          MAIN FOOTER
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <div
          className="
            grid
            grid-cols-1
            gap-12
            border-b
            border-white/[0.07]
            py-14
            sm:grid-cols-2
            lg:grid-cols-[1.5fr_1fr_1fr_1fr]
          "
        >

          {/* =================================================
              BRAND
          ================================================= */}

          <div className="max-w-sm">

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


            {/* DESCRIPTION */}

            <p className="mt-6 text-sm leading-7 text-white/40">
              A decentralized lending protocol designed to give
              users simple and transparent access to crypto-backed
              liquidity.
            </p>


            {/* NETWORK STATUS */}

            <div
              className="
                mt-6
                inline-flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#6DD054]/10
                bg-[#6DD054]/[0.04]
                px-3
                py-2
              "
            >

              <span className="relative flex h-2 w-2">

                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-[#6DD054]
                    opacity-50
                  "
                />

                <span
                  className="
                    relative
                    h-2
                    w-2
                    rounded-full
                    bg-[#6DD054]
                  "
                />

              </span>

              <span className="text-xs text-white/50">
                Protocol online
              </span>

            </div>


            {/* SOCIALS */}

            <div className="mt-6 flex items-center gap-2">

              <a
                href="#"
                aria-label="GitHub"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-white/40
                  transition-all
                  duration-200
                  hover:border-[#6DD054]/25
                  hover:bg-[#6DD054]/10
                  hover:text-[#6DD054]
                "
              >
                <FiGithub />
              </a>

              <a
                href="#"
                aria-label="Twitter"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-white/40
                  transition-all
                  duration-200
                  hover:border-[#6DD054]/25
                  hover:bg-[#6DD054]/10
                  hover:text-[#6DD054]
                "
              >
                <FiTwitter />
              </a>

              <a
                href="mailto:minilend9@gmail.com"
                aria-label="Email"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  text-white/40
                  transition-all
                  duration-200
                  hover:border-[#6DD054]/25
                  hover:bg-[#6DD054]/10
                  hover:text-[#6DD054]
                "
              >
                <FiMail />
              </a>

            </div>

          </div>


          {/* =================================================
              PRODUCT
          ================================================= */}

          <div>

            <h3
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Product
            </h3>

            <div className="mt-5 space-y-3">

              {productLinks.map((item) => (

                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-white/40
                    transition-colors
                    hover:text-[#6DD054]
                  "
                >

                  {item.label}

                  <FiArrowUpRight
                    className="
                      text-xs
                      opacity-0
                      transition-all
                      duration-200
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:opacity-100
                    "
                  />

                </button>

              ))}

            </div>

          </div>


          {/* =================================================
              RESOURCES
          ================================================= */}

          <div>

            <h3
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Resources
            </h3>

            <div className="mt-5 space-y-3">

              {resourceLinks.map((item) => {

                {/* LANDING PAGE SECTION */}

                if (item.id) {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="
                        group
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-white/40
                        transition-colors
                        hover:text-[#6DD054]
                      "
                    >

                      {item.label}

                      <FiArrowUpRight
                        className="
                          text-xs
                          opacity-0
                          transition-all
                          duration-200
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                          group-hover:opacity-100
                        "
                      />

                    </button>
                  );
                }

                {/* NORMAL PAGE */}

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-white/40
                      transition-colors
                      hover:text-[#6DD054]
                    "
                  >

                    {item.label}

                    <FiArrowUpRight
                      className="
                        text-xs
                        opacity-0
                        transition-all
                        duration-200
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:opacity-100
                      "
                    />

                  </Link>
                );
              })}

            </div>

          </div>


          {/* =================================================
              LEGAL
          ================================================= */}

          <div>

            <h3
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white
              "
            >
              Legal
            </h3>

            <div className="mt-5 space-y-3">

              {legalLinks.map((item) => (

                <Link
                  key={item.to}
                  to={item.to}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-white/40
                    transition-colors
                    hover:text-[#6DD054]
                  "
                >

                  {item.label}

                  <FiArrowUpRight
                    className="
                      text-xs
                      opacity-0
                      transition-all
                      duration-200
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                      group-hover:opacity-100
                    "
                  />

                </Link>

              ))}

            </div>

          </div>

        </div>


        {/* =====================================================
            BOTTOM FOOTER
        ====================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            py-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          {/* COPYRIGHT */}

          <p className="text-[11px] text-white/30">
            © 2026 MiniLend.eth. All rights reserved.
          </p>


          {/* STATUS */}

          <div className="flex items-center gap-2">

            <span className="relative flex h-2 w-2">

              <span
                className="
                  absolute
                  inline-flex
                  h-full
                  w-full
                  animate-ping
                  rounded-full
                  bg-[#6DD054]
                  opacity-40
                "
              />

              <span
                className="
                  relative
                  h-2
                  w-2
                  rounded-full
                  bg-[#6DD054]
                "
              />

            </span>

            <span className="text-[11px] text-white/30">
              Built for decentralized finance
            </span>

          </div>


          {/* BACK TO TOP */}

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="
              group
              flex
              items-center
              gap-2
              text-[11px]
              text-white/35
              transition-colors
              hover:text-[#6DD054]
            "
          >

            Back to top

            <span
              className="
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-lg
                border
                border-white/10
                transition-all
                group-hover:border-[#6DD054]/30
                group-hover:bg-[#6DD054]/10
              "
            >
              <FiArrowUpRight className="-rotate-45" />
            </span>

          </button>

        </div>

      </div>

    </footer>
  );
}

