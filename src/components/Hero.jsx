import { useEffect, useRef, useState } from "react";
import GetStarted from "./getStarted"
import {
  FiArrowRight,
  FiArrowUpRight,
  FiShield,
  FiTrendingUp,
  FiLock,
  FiActivity,
  FiZap,
} from "react-icons/fi";

export default function Hero() {
  const sceneRef = useRef(null);
  const animationFrameRef = useRef(null);

  // =====================================================
  // EXISTING GET STARTED MODAL — KEPT INTACT
  // =====================================================
  const [modalOpen, setModalOpen] = useState(false);

  // =====================================================
  // HERO ENTRANCE ANIMATION
  // =====================================================
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // =====================================================
  // TYPING TEXT
  // =====================================================
  const phrases = [
    "without selling.",
    "against your crypto.",
    "while keeping rewards.",
    "when you need it.",
    "without middlemen.",
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout;

    if (!isDeleting && displayText.length < currentPhrase.length) {
      timeout = setTimeout(() => {
        setDisplayText(
          currentPhrase.substring(0, displayText.length + 1)
        );
      }, 80);
    } else if (
      !isDeleting &&
      displayText.length === currentPhrase.length
    ) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 2200);
    } else if (isDeleting && displayText.length > 0) {
      timeout = setTimeout(() => {
        setDisplayText(
          currentPhrase.substring(0, displayText.length - 1)
        );
      }, 45);
    } else if (isDeleting && displayText.length === 0) {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, phraseIndex]);

  // =====================================================
  // NUMBER COUNTING ANIMATION
  // =====================================================
  const [liquidity, setLiquidity] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [borrowed, setBorrowed] = useState(0);
  const [health, setHealth] = useState(0);
  const [numbersStarted, setNumbersStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setNumbersStarted(true);
    }, 450);

    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!numbersStarted) return;

    const duration = 2200;
    const startTime = performance.now();

    let animationFrame;

    const animateNumbers = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setLiquidity(Math.floor(2450 * easedProgress));
      setCollateral(Number((1.25 * easedProgress).toFixed(2)));
      setBorrowed(Math.floor(2450 * easedProgress));
      setHealth(Math.floor(78 * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateNumbers);
      } else {
        setLiquidity(2450);
        setCollateral(1.25);
        setBorrowed(2450);
        setHealth(78);
      }
    };

    animationFrame = requestAnimationFrame(animateNumbers);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [numbersStarted]);

  // =====================================================
  // MOUSE-REACTIVE 3D SCENE
  // =====================================================
  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) return;

    const finePointer = window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    if (prefersReducedMotion.matches) {
      return;
    }

    const handlePointerMove = (event) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const x =
          (event.clientX / window.innerWidth - 0.5) * 2;

        const y =
          (event.clientY / window.innerHeight - 0.5) * 2;

        const rotateY = x * 5;
        const rotateX = y * -4;

        scene.style.setProperty("--tilt-x", `${rotateX}deg`);
        scene.style.setProperty("--tilt-y", `${rotateY}deg`);

        scene.style.setProperty("--mouse-x", x.toFixed(3));
        scene.style.setProperty("--mouse-y", y.toFixed(3));
      });
    };

    const handlePointerLeave = () => {
      scene.style.setProperty("--tilt-x", "0deg");
      scene.style.setProperty("--tilt-y", "0deg");
      scene.style.setProperty("--mouse-x", "0");
      scene.style.setProperty("--mouse-y", "0");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // =====================================================
  // STARS
  // =====================================================
  const stars = [
    {
      top: "12%",
      left: "7%",
      size: "2px",
      delay: "0s",
      duration: "2.8s",
    },
    {
      top: "20%",
      left: "22%",
      size: "3px",
      delay: "1.2s",
      duration: "3.5s",
    },
    {
      top: "9%",
      left: "42%",
      size: "2px",
      delay: "0.6s",
      duration: "2.5s",
    },
    {
      top: "28%",
      left: "53%",
      size: "2px",
      delay: "2s",
      duration: "4s",
    },
    {
      top: "15%",
      left: "68%",
      size: "3px",
      delay: "0.3s",
      duration: "3.2s",
    },
    {
      top: "34%",
      left: "88%",
      size: "2px",
      delay: "1.7s",
      duration: "2.7s",
    },
    {
      top: "47%",
      left: "5%",
      size: "2px",
      delay: "2.5s",
      duration: "3.8s",
    },
    {
      top: "55%",
      left: "28%",
      size: "3px",
      delay: "0.9s",
      duration: "3s",
    },
    {
      top: "63%",
      left: "48%",
      size: "2px",
      delay: "1.5s",
      duration: "3.6s",
    },
    {
      top: "72%",
      left: "76%",
      size: "3px",
      delay: "0.2s",
      duration: "2.9s",
    },
    {
      top: "82%",
      left: "15%",
      size: "2px",
      delay: "2.2s",
      duration: "3.4s",
    },
    {
      top: "88%",
      left: "62%",
      size: "2px",
      delay: "1s",
      duration: "2.6s",
    },
    {
      top: "42%",
      left: "94%",
      size: "2px",
      delay: "2.8s",
      duration: "3.7s",
    },
    {
      top: "76%",
      left: "38%",
      size: "2px",
      delay: "0.5s",
      duration: "3.1s",
    },
    {
      top: "24%",
      left: "78%",
      size: "2px",
      delay: "1.9s",
      duration: "4.2s",
    },
  ];

  return (
    <>
      <section
        id="home"
        className="relative min-h-screen overflow-hidden bg-[#080908] text-white"
      >
        {/* =====================================================
            BACKGROUND
        ====================================================== */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute
              left-[8%]
              top-[25%]
              h-[320px]
              w-[320px]
              rounded-full
              bg-[#6DD054]/10
              blur-[120px]
            "
          />

          <div
            className="
              absolute
              right-[5%]
              top-[18%]
              h-[400px]
              w-[400px]
              rounded-full
              bg-[#6DD054]/[0.07]
              blur-[140px]
            "
          />

          <div
            className="
              absolute
              inset-0
              opacity-[0.035]
              bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)]
              bg-[size:55px_55px]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,transparent_25%,#080908_88%)]
            "
          />
        </div>

        {/* =====================================================
            STARS
        ====================================================== */}
        <div className="pointer-events-none absolute inset-0 z-[1]">
          {stars.map((star, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-white animate-[twinkle_ease-in-out_infinite]"
              style={{
                top: star.top,
                left: star.left,
                width: star.size,
                height: star.size,
                animationDelay: star.delay,
                animationDuration: star.duration,
              }}
            />
          ))}
        </div>

        {/* =====================================================
            MAIN HERO
        ====================================================== */}
        <div
          className={`
            relative
            z-10
            mx-auto
            flex
            min-h-screen
            max-w-7xl
            items-center
            px-5
            pb-20
            pt-32
            sm:px-8
            lg:px-10
            transition-all
            duration-1000
            ease-out
            ${
              heroVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-6 opacity-0"
            }
          `}
        >
          <div
            className="
              grid
              w-full
              items-center
              gap-14
              lg:grid-cols-[1fr_0.9fr]
              lg:gap-16
            "
          >
            {/* =================================================
                LEFT CONTENT
            ================================================== */}
            <div className="mx-auto w-full max-w-2xl text-center lg:mx-0 lg:text-left">
              {/* BADGE */}
              <div
                className="
                  mb-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#6DD054]/20
                  bg-[#6DD054]/[0.06]
                  px-3.5
                  py-2
                  text-xs
                  font-medium
                  text-white/65
                "
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6DD054] opacity-60" />

                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6DD054]" />
                </span>

                Decentralized Lending Protocol
              </div>

              {/* HEADING */}
              <h1
                className="
                  text-4xl
                  font-black
                  leading-[1.05]
                  tracking-[-0.04em]
                  sm:text-5xl
                  md:text-6xl
                  lg:text-[68px]
                "
              >
                Unlock liquidity

                <span className="block min-h-[1.1em] text-[#6DD054]">
                  {displayText}

                  <span
                    className="
                      ml-1
                      inline-block
                      h-[0.8em]
                      w-[3px]
                      translate-y-[2px]
                      animate-pulse
                      rounded-full
                      bg-[#6DD054]
                    "
                  />
                </span>
              </h1>

              {/* DESCRIPTION */}
              <p
                className="
                  mx-auto
                  mt-7
                  max-w-xl
                  text-sm
                  leading-7
                  text-white/50
                  sm:text-base
                  sm:leading-8
                  lg:mx-0
                "
              >
                MiniLend lets you stake your digital assets, borrow
                stablecoins, and keep your staking rewards. No credit
                checks. No middlemen. Just decentralized access to
                liquidity.
              </p>

              {/* BUTTONS */}
              <div
                className="
                  mt-9
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:items-center
                  sm:justify-center
                  lg:justify-start
                "
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="
                    group
                    flex
                    h-12
                    items-center
                    justify-center
                    gap-2.5
                    rounded-xl
                    bg-[#6DD054]
                    px-6
                    text-sm
                    font-bold
                    text-[#0b1609]
                    shadow-[0_10px_35px_rgba(109,208,84,0.16)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#7ae360]
                    hover:shadow-[0_14px_40px_rgba(109,208,84,0.25)]
                    active:scale-[0.98]
                  "
                >
                  Get Started

                  <FiArrowRight
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-1
                    "
                  />
                </button>

                <a
                  href="#how-it-works"
                  className="
                    group
                    flex
                    h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.025]
                    px-6
                    text-sm
                    font-semibold
                    text-white/70
                    transition-all
                    duration-300
                    hover:border-white/20
                    hover:bg-white/[0.05]
                    hover:text-white
                  "
                >
                  Learn More

                  <FiArrowUpRight
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </a>
              </div>

              {/* TRUST POINTS */}
              <div
                className="
                  mt-10
                  flex
                  flex-wrap
                  justify-center
                  gap-x-7
                  gap-y-3
                  lg:justify-start
                "
              >
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <FiShield className="text-[#6DD054]" />
                  Non-custodial
                </div>

                <div className="flex items-center gap-2 text-xs text-white/40">
                  <FiLock className="text-[#6DD054]" />
                  Secure lending
                </div>

                <div className="flex items-center gap-2 text-xs text-white/40">
                  <FiTrendingUp className="text-[#6DD054]" />
                  Keep staking rewards
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT SIDE — ORBITAL SYSTEM
            ================================================== */}
            <div
              className="
                relative
                mx-auto
                h-[430px]
                w-full
                max-w-[520px]
                sm:h-[500px]
                sm:max-w-[580px]
                lg:h-[560px]
                lg:max-w-[620px]
              "
            >
              <div
                className="
                  absolute
                  inset-0
                  flex
                  items-center
                  justify-center
                  overflow-visible
                  lg:translate-x-[14%]
                "
              >
                <div
                  ref={sceneRef}
                  className="
                    absolute
                    inset-0
                    origin-center
                    scale-[0.68]
                    will-change-transform
                    transition-transform
                    duration-700
                    ease-out
                    min-[375px]:scale-[0.74]
                    min-[430px]:scale-[0.80]
                    sm:scale-[0.88]
                    md:scale-[0.94]
                    lg:scale-100
                  "
                  style={{
                    transform:
                      "perspective(1200px) rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg))",
                  }}
                >
                  {/* =================================================
                      AMBIENT GLOW
                  ================================================== */}
                  <div
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      h-[390px]
                      w-[390px]
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#6DD054]/[0.09]
                      blur-[95px]
                    "
                  />

                  <div
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      h-[260px]
                      w-[260px]
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#6DD054]/[0.08]
                      blur-[70px]
                    "
                  />

                  {/* =================================================
                      OUTER ORBIT
                  ================================================== */}
                  <div
                    className="
                      orbit-plane
                      orbit-outer
                    "
                  >
                    <div className="orbit-spin orbit-spin-one">
                      <span className="orbit-particle orbit-particle-green" />
                    </div>
                  </div>

                  {/* =================================================
                      SECOND ORBIT
                  ================================================== */}
                  <div
                    className="
                      orbit-plane
                      orbit-second
                    "
                  >
                    <div className="orbit-spin orbit-spin-two">
                      <span className="orbit-particle orbit-particle-white" />
                    </div>
                  </div>

                  {/* =================================================
                      MIDDLE ORBIT
                  ================================================== */}
                  <div
                    className="
                      orbit-plane
                      orbit-middle
                    "
                  >
                    <div className="orbit-spin orbit-spin-three">
                      <span className="orbit-particle orbit-particle-green small" />
                    </div>
                  </div>

                  {/* =================================================
                      INNER ORBIT
                  ================================================== */}
                  <div
                    className="
                      orbit-plane
                      orbit-inner
                    "
                  >
                    <div className="orbit-spin orbit-spin-four">
                      <span className="orbit-particle orbit-particle-white small" />
                    </div>
                  </div>

                  {/* =================================================
                      HORIZONTAL LIGHT SWEEP
                  ================================================== */}
                  <div className="absolute left-1/2 top-1/2 h-[2px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-transparent via-[#6DD054]/30 to-transparent blur-[1px]" />

                  {/* =================================================
                      CENTER GROUND GLOW
                  ================================================== */}
                  <div
                    className="
                      absolute
                      left-1/2
                      top-[67%]
                      h-[55px]
                      w-[250px]
                      -translate-x-1/2
                      -translate-y-1/2
                      rounded-full
                      bg-[#6DD054]/[0.13]
                      blur-[22px]
                    "
                  />

                  {/* =================================================
                      ETHEREUM CORE
                  ================================================== */}
                  <div
                    className="
                      absolute
                      left-1/2
                      top-1/2
                      h-[190px]
                      w-[190px]
                      -translate-x-1/2
                      -translate-y-1/2
                      animate-[ethFloat_5s_ease-in-out_infinite]
                    "
                  >
                    <div
                      className="
                        absolute
                        inset-0
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.025]
                        shadow-[inset_0_0_60px_rgba(109,208,84,0.04),0_0_70px_rgba(109,208,84,0.08)]
                        backdrop-blur-xl
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-[20px]
                        rounded-full
                        bg-[#6DD054]/[0.055]
                        blur-[20px]
                      "
                    />

                    <div
                      className="
                        absolute
                        left-[22%]
                        top-[18%]
                        h-[55px]
                        w-[55px]
                        rounded-full
                        bg-white/[0.035]
                        blur-[12px]
                      "
                    />

                    {/* ETH CRYSTAL */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        viewBox="0 0 120 180"
                        className="
                          h-[105px]
                          w-[72px]
                          drop-shadow-[0_0_22px_rgba(109,208,84,0.25)]
                        "
                      >
                        <defs>
                          <linearGradient
                            id="miniLendEthGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#ffffff"
                            />

                            <stop
                              offset="45%"
                              stopColor="#b8e9ad"
                            />

                            <stop
                              offset="100%"
                              stopColor="#6DD054"
                            />
                          </linearGradient>
                        </defs>

                        <path
                          d="M60 4 L8 90 L60 65 L112 90 Z"
                          fill="url(#miniLendEthGradient)"
                          opacity="0.95"
                        />

                        <path
                          d="M60 65 L8 90 L60 176 L112 90 Z"
                          fill="#6DD054"
                          opacity="0.7"
                        />

                        <path
                          d="M60 65 L60 176 L8 90 Z"
                          fill="#ffffff"
                          opacity="0.12"
                        />

                        <path
                          d="M60 65 L112 90 L60 176 Z"
                          fill="#061006"
                          opacity="0.16"
                        />
                      </svg>
                    </div>

                    {/* CORE STATUS */}
                    <div
                      className="
                        absolute
                        bottom-[-15px]
                        left-1/2
                        -translate-x-1/2
                        whitespace-nowrap
                        rounded-full
                        border
                        border-[#6DD054]/15
                        bg-[#071008]/90
                        px-3
                        py-1.5
                        text-[9px]
                        font-medium
                        tracking-[0.15em]
                        text-[#9BE58A]
                        shadow-lg
                        backdrop-blur-xl
                      "
                    >
                      NETWORK ACTIVE
                    </div>
                  </div>

                  {/* =================================================
                      LIQUIDITY NODE
                  ================================================== */}
                  <div
                    className="
                      absolute
                      left-[7%]
                      top-[35%]
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#6DD054]/20
                      bg-[#071008]/80
                      text-sm
                      text-[#6DD054]
                      shadow-[0_0_25px_rgba(109,208,84,0.08)]
                      backdrop-blur-xl
                      animate-[nodeFloat_5s_ease-in-out_infinite]
                    "
                  >
                    $
                  </div>

                  {/* =================================================
                      ETH NODE
                  ================================================== */}
                  <div
                    className="
                      absolute
                      right-[9%]
                      top-[29%]
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/10
                      bg-[#0a0d0b]/80
                      text-sm
                      text-white/80
                      shadow-[0_0_25px_rgba(255,255,255,0.05)]
                      backdrop-blur-xl
                      animate-[nodeFloat_6s_ease-in-out_infinite_reverse]
                    "
                  >
                    Ξ
                  </div>

                  {/* =================================================
                      DATA FLOW
                  ================================================== */}
                  <div className="absolute inset-0">
                    <span className="data-dot data-dot-one" />
                    <span className="data-dot data-dot-two" />
                    <span className="data-dot data-dot-three" />
                    <span className="data-dot data-dot-four" />
                  </div>

                  {/* =================================================
                      COLLATERAL
                  ================================================== */}
                  <div
                    className="
                      absolute
                      left-[0%]
                      top-[61%]
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-[#09100a]/80
                      px-4
                      py-3
                      shadow-2xl
                      backdrop-blur-xl
                      transition-transform
                      duration-500
                      ease-out
                    "
                    style={{
                      transform:
                        "translate3d(calc(var(--mouse-x, 0) * -7px), calc(var(--mouse-y, 0) * -5px), 0)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-[#6DD054]/10
                          text-[#6DD054]
                        "
                      >
                        <FiLock size={15} />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/35">
                          Collateral
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-white">
                          {collateral.toFixed(2)} ETH
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      AVAILABLE LIQUIDITY
                  ================================================== */}
                  <div
                    className="
                      absolute
                      right-[0%]
                      top-[57%]
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-[#09100a]/80
                      px-4
                      py-3
                      shadow-2xl
                      backdrop-blur-xl
                      transition-transform
                      duration-500
                      ease-out
                    "
                    style={{
                      transform:
                        "translate3d(calc(var(--mouse-x, 0) * 8px), calc(var(--mouse-y, 0) * -4px), 0)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-xl
                          bg-white/[0.05]
                          text-white/75
                        "
                      >
                        <FiTrendingUp size={15} />
                      </div>

                      <div>
                        <p className="text-[9px] uppercase tracking-widest text-white/35">
                          Available
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-white">
                          ${liquidity.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      HEALTH
                  ================================================== */}
                  <div
                    className="
                      absolute
                      right-[7%]
                      top-[11%]
                      flex
                      items-center
                      gap-3
                      rounded-full
                      border
                      border-[#6DD054]/10
                      bg-[#071008]/75
                      px-3
                      py-2
                      backdrop-blur-xl
                    "
                    style={{
                      transform:
                        "translate3d(calc(var(--mouse-x, 0) * 5px), calc(var(--mouse-y, 0) * 5px), 0)",
                    }}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6DD054]/10">
                      <FiActivity
                        className="text-[#6DD054]"
                        size={13}
                      />
                    </div>

                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/30">
                        Health
                      </p>

                      <p className="text-xs font-semibold text-[#9BE58A]">
                        {health}%
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      MINI POSITION PANEL
                  ================================================== */}
                  <div
                    className="
                      absolute
                      bottom-[-4%]
                      left-1/2
                      w-[min(245px,calc(100vw-32px))]
                      rounded-2xl
                      border
                      border-white/[0.08]
                      bg-[#080d09]/85
                      p-4
                      shadow-2xl
                      backdrop-blur-xl
                    "
                    style={{
                      transform:
                        "translate3d(calc(-50% + var(--mouse-x, 0) * -2px), calc(var(--mouse-y, 0) * 2px), 0)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                          Active position
                        </p>

                        <p className="mt-1 text-sm font-semibold text-white">
                          ETH Lending
                        </p>
                      </div>

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6DD054]/10">
                        <FiZap
                          className="text-[#6DD054]"
                          size={14}
                        />
                      </div>
                    </div>

                    <div className="mt-4 h-px bg-white/[0.06]" />

                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-white/25">
                          Borrowed
                        </p>

                        <p className="mt-1 text-xs font-medium text-white/80">
                          ${borrowed.toLocaleString()} USDT
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[8px] uppercase tracking-wider text-white/25">
                          Status
                        </p>

                        <div className="mt-1 flex items-center justify-end gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#6DD054] shadow-[0_0_8px_rgba(109,208,84,0.8)]" />

                          <span className="text-xs font-medium text-[#9BE58A]">
                            Healthy
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* =================================================
                      DECORATIVE PARTICLES
                  ================================================== */}
                  <div
                    className="
                      absolute
                      left-[22%]
                      top-[19%]
                      h-3
                      w-3
                      rounded-full
                      border
                      border-[#6DD054]/40
                      bg-[#6DD054]/10
                      shadow-[0_0_15px_rgba(109,208,84,0.3)]
                    "
                  />

                  <div
                    className="
                      absolute
                      bottom-[22%]
                      right-[19%]
                      h-2
                      w-2
                      rounded-full
                      bg-white/40
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BOTTOM FADE
        ====================================================== */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080908] to-transparent" />

        {/* =====================================================
            ANIMATIONS
        ====================================================== */}
        <style>
          {`
            @keyframes twinkle {
              0%,
              100% {
                opacity: 0.15;
                transform: scale(0.7);
              }

              50% {
                opacity: 1;
                transform: scale(1.5);
              }
            }

            /* =================================================
               3D ORBIT SYSTEM
            ================================================== */

            .orbit-plane {
              position: absolute;
              left: 50%;
              top: 50%;
              transform:
                translate(-50%, -50%)
                rotateX(67deg);
              transform-style: preserve-3d;
              border-radius: 50%;
              pointer-events: none;
            }

            .orbit-outer {
              width: 510px;
              height: 510px;
              border: 1px solid rgba(109, 208, 84, 0.16);
              box-shadow:
                0 0 35px rgba(109, 208, 84, 0.035),
                inset 0 0 25px rgba(109, 208, 84, 0.025);
            }

            .orbit-second {
              width: 420px;
              height: 420px;
              transform:
                translate(-50%, -50%)
                rotateX(67deg)
                rotateZ(8deg);
              border: 1px solid rgba(255, 255, 255, 0.075);
            }

            .orbit-middle {
              width: 335px;
              height: 335px;
              transform:
                translate(-50%, -50%)
                rotateX(67deg)
                rotateZ(-8deg);
              border: 1px solid rgba(109, 208, 84, 0.12);
            }

            .orbit-inner {
              width: 255px;
              height: 255px;
              transform:
                translate(-50%, -50%)
                rotateX(67deg);
              border: 1px solid rgba(255, 255, 255, 0.065);
            }

            /* =================================================
               ORBIT ROTATION
            ================================================== */

            .orbit-spin {
              position: absolute;
              inset: 0;
              transform-style: preserve-3d;
              border-radius: 50%;
            }

            .orbit-spin-one {
              animation: orbitSpinOne 20s linear infinite;
            }

            .orbit-spin-two {
              animation: orbitSpinTwo 16s linear infinite;
            }

            .orbit-spin-three {
              animation: orbitSpinThree 12s linear infinite;
            }

            .orbit-spin-four {
              animation: orbitSpinFour 9s linear infinite;
            }

            @keyframes orbitSpinOne {
              from {
                transform: rotateZ(0deg);
              }

              to {
                transform: rotateZ(360deg);
              }
            }

            @keyframes orbitSpinTwo {
              from {
                transform: rotateZ(360deg);
              }

              to {
                transform: rotateZ(0deg);
              }
            }

            @keyframes orbitSpinThree {
              from {
                transform: rotateZ(0deg);
              }

              to {
                transform: rotateZ(360deg);
              }
            }

            @keyframes orbitSpinFour {
              from {
                transform: rotateZ(360deg);
              }

              to {
                transform: rotateZ(0deg);
              }
            }

            /* =================================================
               ORBIT PARTICLES
            ================================================== */

            .orbit-particle {
              position: absolute;
              left: 50%;
              top: -5px;
              display: block;
              width: 10px;
              height: 10px;
              transform: translateX(-50%);
              border-radius: 9999px;
            }

            .orbit-particle-green {
              background: #6DD054;
              box-shadow:
                0 0 8px rgba(109, 208, 84, 0.9),
                0 0 22px rgba(109, 208, 84, 0.65),
                0 0 45px rgba(109, 208, 84, 0.25);
            }

            .orbit-particle-white {
              background: rgba(255, 255, 255, 0.9);
              box-shadow:
                0 0 8px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.35);
            }

            .orbit-particle.small {
              width: 7px;
              height: 7px;
            }

            /* =================================================
               DATA FLOW
            ================================================== */

            @keyframes dataFlow {
              0% {
                opacity: 0;
                transform: translate(40px, 30px) scale(0.5);
              }

              20% {
                opacity: 1;
              }

              80% {
                opacity: 1;
              }

              100% {
                opacity: 0;
                transform: translate(150px, -75px) scale(1);
              }
            }

            @keyframes dataFlowReverse {
              0% {
                opacity: 0;
                transform: translate(-30px, -20px) scale(0.5);
              }

              20% {
                opacity: 1;
              }

              80% {
                opacity: 1;
              }

              100% {
                opacity: 0;
                transform: translate(-130px, 70px) scale(1);
              }
            }

            .data-dot {
              position: absolute;
              left: 50%;
              top: 50%;
              width: 4px;
              height: 4px;
              border-radius: 9999px;
              background: #6DD054;
              box-shadow:
                0 0 12px rgba(109, 208, 84, 0.85);
            }

            .data-dot-one {
              animation: dataFlow 3.2s linear infinite;
            }

            .data-dot-two {
              animation: dataFlowReverse 4s linear infinite;
              animation-delay: -1.2s;
            }

            .data-dot-three {
              animation: dataFlow 4.5s linear infinite;
              animation-delay: -2.4s;
            }

            .data-dot-four {
              animation: dataFlowReverse 3.7s linear infinite;
              animation-delay: -2.1s;
            }

            /* =================================================
               CORE FLOAT
            ================================================== */

            @keyframes ethFloat {
              0%,
              100% {
                transform:
                  translate(-50%, -50%)
                  translateY(0px);
              }

              50% {
                transform:
                  translate(-50%, -50%)
                  translateY(-7px);
              }
            }

            /* =================================================
               NODE FLOAT
            ================================================== */

            @keyframes nodeFloat {
              0%,
              100% {
                transform: translateY(0px);
              }

              50% {
                transform: translateY(-8px);
              }
            }

            /* =================================================
               REDUCED MOTION
            ================================================== */

            @media (prefers-reduced-motion: reduce) {
              .data-dot,
              .orbit-spin {
                animation: none !important;
              }

              * {
                scroll-behavior: auto !important;
              }
            }

            /* =================================================
               MOBILE
            ================================================== */

            @media (max-width: 640px) {
              .data-dot {
                width: 3px;
                height: 3px;
              }

              .orbit-outer {
                width: 430px;
                height: 430px;
              }

              .orbit-second {
                width: 355px;
                height: 355px;
              }

              .orbit-middle {
                width: 285px;
                height: 285px;
              }

              .orbit-inner {
                width: 220px;
                height: 220px;
              }
            }

            @media (max-width: 430px) {
              .orbit-outer {
                width: 390px;
                height: 390px;
              }

              .orbit-second {
                width: 325px;
                height: 325px;
              }

              .orbit-middle {
                width: 260px;
                height: 260px;
              }

              .orbit-inner {
                width: 205px;
                height: 205px;
              }
            }
          `}
        </style>
      </section>

      {/* =====================================================
          EXISTING GET STARTED MODAL — NOT CHANGED
      ====================================================== */}
      <GetStarted
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}