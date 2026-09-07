import { useState } from "react";
import {
  FiHelpCircle,
  FiPlus,
  FiMinus,
} from "react-icons/fi";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is MiniLend?",
      answer:
        "MiniLend is a decentralized lending platform that allows users to stake supported digital assets and borrow stablecoins against their collateral.",
    },
    {
      question: "How does MiniLend work?",
      answer:
        "Users deposit supported digital assets as collateral and can borrow stablecoins against them based on the protocol's collateralization requirements. Interest accrues over time, and users can repay their loan to recover their collateral.",
    },
    {
      question: "What happens if my position gets liquidated?",
      answer:
        "If the value of your collateral falls below the required safety threshold, your position may become eligible for liquidation. Users can monitor their position and add collateral or repay their debt to help avoid liquidation.",
    },
    {
      question: "Is MiniLend secure?",
      answer:
        "MiniLend is designed around smart contracts with explicit risk parameters, validation checks, and transparent lending logic. However, decentralized protocols still carry smart-contract and market risks.",
    },
    {
      question: "How is interest calculated?",
      answer:
        "Interest accrues over time based on the borrowed amount, applicable interest rate, and elapsed time. Your outstanding debt can be monitored through the protocol interface.",
    },
    {
      question: "What assets are supported?",
      answer:
        "MiniLend currently supports selected assets for collateral and borrowing. Supported assets and networks may change as the protocol develops.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#080908] py-24 text-white"
    >
      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-20
          h-[420px]
          w-[420px]
          -translate-x-1/2
          rounded-full
          bg-[#6DD054]/[0.035]
          blur-[140px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-x-0
          top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#6DD054]/20
          to-transparent
        "
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-8">

        {/* =================================================
            HEADER
        ================================================== */}

        <div className="mx-auto mb-14 max-w-2xl text-center">

          {/* Badge */}

          <div
            className="
              faq-header
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#6DD054]/20
              bg-[#6DD054]/[0.05]
              px-4
              py-2
              text-xs
              font-medium
              text-[#6DD054]
              animate-[faqHeaderIn_700ms_ease-out_both]
            "
          >
            <FiHelpCircle />

            <span>
              Frequently Asked Questions
            </span>
          </div>

          {/* Heading */}

          <h2
            className="
              faq-heading
              mt-6
              text-3xl
              font-semibold
              leading-tight
              sm:text-4xl
              md:text-5xl
              animate-[faqHeadingIn_800ms_ease-out_100ms_both]
            "
          >
            Everything you need to know
            <span className="text-[#6DD054]">
              {" "}about MiniLend.
            </span>
          </h2>

          {/* Description */}

          <p
            className="
              faq-description
              mt-5
              text-sm
              leading-7
              text-white/45
              sm:text-base
              animate-[faqDescriptionIn_800ms_ease-out_200ms_both]
            "
          >
            Find answers to common questions about borrowing,
            collateral, interest, security, and supported assets.
          </p>

        </div>

        {/* =================================================
            FAQ LIST
        ================================================== */}

        <div className="space-y-3">

          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className={`
                  faq-card
                  group
                  overflow-hidden
                  rounded-2xl
                  border
                  transition-all
                  duration-500
                  ease-out
                  animate-[faqCardIn_700ms_ease-out_both]
                  ${
                    isOpen
                      ? `
                        border-[#6DD054]/25
                        bg-[#6DD054]/[0.035]
                        shadow-[0_0_40px_rgba(109,208,84,0.045)]
                      `
                      : `
                        border-white/[0.08]
                        bg-white/[0.02]
                        hover:border-white/[0.14]
                        hover:bg-white/[0.028]
                      `
                  }
                `}
                style={{
                  animationDelay: `${300 + index * 90}ms`,
                }}
              >

                {/* =================================================
                    QUESTION
                ================================================== */}

                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-5
                    px-5
                    py-5
                    text-left
                    sm:px-6
                  "
                >

                  <div className="flex min-w-0 items-center gap-4">

                    {/* Question icon */}

                    <span
                      className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        transition-all
                        duration-500
                        ${
                          isOpen
                            ? `
                              bg-[#6DD054]/15
                              text-[#6DD054]
                              shadow-[0_0_20px_rgba(109,208,84,0.12)]
                            `
                            : `
                              bg-[#6DD054]/10
                              text-[#6DD054]/80
                              group-hover:bg-[#6DD054]/15
                              group-hover:text-[#6DD054]
                            `
                        }
                      `}
                    >
                      <FiHelpCircle
                        className={`
                          text-sm
                          transition-transform
                          duration-500
                          ${
                            isOpen
                              ? "scale-110"
                              : "scale-100"
                          }
                        `}
                      />
                    </span>

                    {/* Question */}

                    <span
                      className={`
                        text-sm
                        font-medium
                        transition-colors
                        duration-300
                        sm:text-base
                        ${
                          isOpen
                            ? "text-white"
                            : "text-white/85 group-hover:text-white"
                        }
                      `}
                    >
                      {faq.question}
                    </span>

                  </div>

                  {/* =================================================
                      PLUS / MINUS
                  ================================================== */}

                  <span
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      transition-all
                      duration-500
                      ${
                        isOpen
                          ? `
                            rotate-180
                            border-[#6DD054]/25
                            bg-[#6DD054]/10
                            text-[#6DD054]
                          `
                          : `
                            rotate-0
                            border-white/10
                            text-white/35
                            group-hover:border-[#6DD054]/20
                            group-hover:text-[#6DD054]
                          `
                      }
                    `}
                  >
                    {isOpen ? (
                      <FiMinus className="text-sm" />
                    ) : (
                      <FiPlus className="text-sm" />
                    )}
                  </span>

                </button>

                {/* =================================================
                    ANSWER
                ================================================== */}

                <div
                  className={`
                    grid
                    transition-all
                    duration-500
                    ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">

                    <div
                      className={`
                        border-t
                        px-5
                        pb-6
                        pt-5
                        transition-all
                        duration-500
                        sm:px-6
                        ${
                          isOpen
                            ? "translate-y-0 border-white/[0.06]"
                            : "-translate-y-2 border-transparent"
                        }
                      `}
                    >
                      <p
                        className="
                          pl-[3.25rem]
                          text-sm
                          leading-7
                          text-white/45
                          sm:pl-[3.25rem]
                        "
                      >
                        {faq.answer}
                      </p>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}

        </div>

        {/* =================================================
            BOTTOM NOTE
        ================================================== */}

        <div
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-3
            text-center
            animate-[faqFooterIn_700ms_ease-out_900ms_both]
          "
        >
          <span className="h-px w-8 bg-white/10" />

          <span className="text-[9px] uppercase tracking-[0.3em] text-white/20">
            Still have questions?
          </span>

          <span className="h-px w-8 bg-white/10" />
        </div>

      </div>

      {/* =====================================================
          CUSTOM ANIMATIONS
      ====================================================== */}

      <style>
        {`
          @keyframes faqHeaderIn {
            0% {
              opacity: 0;
              transform: translateY(12px) scale(0.96);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes faqHeadingIn {
            0% {
              opacity: 0;
              transform: translateY(18px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes faqDescriptionIn {
            0% {
              opacity: 0;
              transform: translateY(12px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes faqCardIn {
            0% {
              opacity: 0;
              transform: translateY(16px);
            }

            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes faqFooterIn {
            0% {
              opacity: 0;
            }

            100% {
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </section>
  );
}