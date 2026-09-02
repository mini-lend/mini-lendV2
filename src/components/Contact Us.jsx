import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  FiArrowRight,
  FiMail,
  FiMessageCircle,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiShield,
} from "react-icons/fi";

export default function ContactUs() {
  const form = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.subject.trim() ||
      !formData.message.trim()
    ) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    if (!form.current) {
      alert("Form is not ready. Please refresh the page and try again.");
      return;
    }

    setSending(true);

    try {
      // =====================================================
      // CREATE CURRENT DATE + TIME
      // =====================================================
      const currentTime = new Date().toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      // =====================================================
      // PUT TIME INTO THE HIDDEN FORM FIELD
      // =====================================================
      const timeField = form.current.querySelector('input[name="time"]');

      if (timeField) {
        timeField.value = currentTime;
      }

      // =====================================================
      // 1. SEND USER MESSAGE TO MINILEND
      // =====================================================
      await emailjs.sendForm(
        "service_yidtfre",
        "template_td89fpt",
        form.current,
        "yMoZdut8T1FiKdGgv",
      );

      // =====================================================
      // 2. SEND ONE AUTO-REPLY TO THE USER
      // =====================================================
      await emailjs.send(
        "service_yidtfre",
        "template_2h3ntgz",
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        "yMoZdut8T1FiKdGgv",
      );

      // =====================================================
      // 3. SHOW SUCCESS MESSAGE
      // =====================================================
      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS Error:", error);

      alert(
        error?.text ||
          "Sorry, your message could not be sent. Please check your EmailJS configuration and try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#080908] py-24 text-white"
    >
      {/* =====================================================
          BACKGROUND GLOW
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute left-[5%] top-[20%]
            h-[300px] w-[300px]
            rounded-full
            bg-[#6DD054]/[0.06]
            blur-[120px]
          "
        />

        <div
          className="
            absolute bottom-[10%] right-[5%]
            h-[350px] w-[350px]
            rounded-full
            bg-[#6DD054]/[0.05]
            blur-[130px]
          "
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              border border-[#6DD054]/20
              bg-[#6DD054]/[0.05]
              px-4 py-2
              text-xs font-medium
              text-[#6DD054]
            "
          >
            <FiMessageCircle />
            Contact MiniLend
          </div>

          <h2
            className="
              logo mt-6
              text-3xl font-semibold leading-tight
              sm:text-4xl md:text-5xl
            "
          >
            We're here to help you
            <span className="text-[#6DD054]"> move forward.</span>
          </h2>

          <p
            className="
              logo mt-5
              text-sm leading-7 text-white/45
              sm:text-base
            "
          >
            Have a question about MiniLend, your lending position, supported
            assets, or the protocol? Send us a message and our team will get
            back to you.
          </p>
        </div>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          {/* ===================================================
              LEFT SIDE
          =================================================== */}
          <div className="flex flex-col gap-5">
            {/* GET IN TOUCH */}
            <div
              className="
                rounded-3xl
                border border-white/[0.08]
                bg-white/[0.02]
                p-6 sm:p-7
              "
            >
              <p className="logo text-xs uppercase tracking-[0.2em] text-[#6DD054]">
                Get in touch
              </p>

              <h3 className="logo mt-3 text-2xl font-semibold text-white">
                Let's talk.
              </h3>

              <p className="logo mt-3 text-sm leading-6 text-white/40">
                Whether you're experiencing an issue or simply want to learn
                more about MiniLend, we're happy to hear from you.
              </p>

              {/* EMAIL */}
              <div
                className="
                  mt-7 flex items-center gap-4
                  rounded-2xl
                  border border-white/[0.07]
                  bg-black/10
                  p-4
                "
              >
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[#6DD054]/10
                    text-[#6DD054]
                  "
                >
                  <FiMail />
                </div>

                <div>
                  <p className="logo text-[10px] uppercase tracking-wider text-white/30">
                    Email
                  </p>

                  <a
                    href="mailto:minilend9@gmail.com"
                    className="
                      logo mt-1 block text-sm font-medium
                      text-white/80 transition
                      hover:text-[#6DD054]
                    "
                  >
                    minilend9@gmail.com
                  </a>
                </div>
              </div>

              {/* RESPONSE TIME */}
              <div
                className="
                  mt-3 flex items-center gap-4
                  rounded-2xl
                  border border-white/[0.07]
                  bg-black/10
                  p-4
                "
              >
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[#6DD054]/10
                    text-[#6DD054]
                  "
                >
                  <FiClock />
                </div>

                <div>
                  <p className="logo text-[10px] uppercase tracking-wider text-white/30">
                    Response time
                  </p>

                  <p className="logo mt-1 text-sm font-medium text-white/80">
                    Usually within 24 hours
                  </p>
                </div>
              </div>
            </div>

            {/* PRIVACY */}
            <div
              className="
                rounded-3xl
                border border-[#6DD054]/15
                bg-[#6DD054]/[0.04]
                p-6 sm:p-7
              "
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-[#6DD054]/10
                    text-[#6DD054]
                  "
                >
                  <FiShield />
                </div>

                <div>
                  <h3 className="logo text-sm font-semibold text-white">
                    Your privacy matters
                  </h3>

                  <p className="logo mt-2 text-xs leading-6 text-white/40">
                    Please never share your private keys, recovery phrases, or
                    sensitive wallet credentials with anyone claiming to provide
                    MiniLend support.
                  </p>
                </div>
              </div>
            </div>

            {/* BEFORE CONTACTING */}
            <div
              className="
                rounded-3xl
                border border-white/[0.08]
                bg-white/[0.02]
                p-6
              "
            >
              <p className="logo text-xs uppercase tracking-[0.2em] text-white/30">
                Before contacting us
              </p>

              <div className="mt-4 space-y-3">
                <a
                  href="#faq"
                  className="
                    group flex items-center justify-between
                    rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.015]
                    px-4 py-3
                    transition
                    hover:border-[#6DD054]/20
                    hover:bg-[#6DD054]/[0.04]
                  "
                >
                  <span className="logo text-xs text-white/60">
                    Check Frequently Asked Questions
                  </span>

                  <FiArrowRight
                    className="
                      text-white/25 transition
                      group-hover:translate-x-1
                      group-hover:text-[#6DD054]
                    "
                  />
                </a>

                <a
                  href="#how-it-works"
                  className="
                    group flex items-center justify-between
                    rounded-xl
                    border border-white/[0.06]
                    bg-white/[0.015]
                    px-4 py-3
                    transition
                    hover:border-[#6DD054]/20
                    hover:bg-[#6DD054]/[0.04]
                  "
                >
                  <span className="logo text-xs text-white/60">
                    Learn how MiniLend works
                  </span>

                  <FiArrowRight
                    className="
                      text-white/25 transition
                      group-hover:translate-x-1
                      group-hover:text-[#6DD054]
                    "
                  />
                </a>
              </div>
            </div>
          </div>

          {/* ===================================================
              RIGHT SIDE - FORM
          =================================================== */}
          <div
            className="
              relative rounded-3xl
              border border-white/[0.08]
              bg-white/[0.025]
              p-6
              shadow-[0_30px_100px_rgba(0,0,0,0.25)]
              sm:p-8 lg:p-10
            "
          >
            <div className="mb-7">
              <p className="logo text-xs uppercase tracking-[0.2em] text-[#6DD054]">
                Send a message
              </p>

              <h3 className="logo mt-3 text-2xl font-semibold">
                How can we help?
              </h3>

              <p className="logo mt-2 text-sm text-white/35">
                Fill out the form below and we'll get back to you.
              </p>
            </div>

            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}
            {submitted ? (
              <div
                className="
                  flex min-h-[400px]
                  flex-col items-center justify-center
                  text-center
                "
              >
                <div
                  className="
                    flex h-16 w-16
                    items-center justify-center
                    rounded-2xl
                    bg-[#6DD054]/10
                  "
                >
                  <FiCheckCircle className="text-3xl text-[#6DD054]" />
                </div>

                <h3 className="logo mt-6 text-2xl font-semibold text-white">
                  Message sent successfully
                </h3>

                <p className="logo mt-3 max-w-sm text-sm leading-6 text-white/40">
                  Thank you for contacting MiniLend. Our team will review your
                  message and get back to you shortly.
                  <br />
                  <br />
                  You should also receive a confirmation email.
                </p>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="
                    logo mt-7 flex items-center gap-2
                    rounded-xl
                    border border-[#6DD054]/30
                    px-5 py-3
                    text-xs font-semibold
                    text-[#6DD054]
                    transition
                    hover:bg-[#6DD054]
                    hover:text-black
                  "
                >
                  Send another message
                  <FiArrowRight />
                </button>
              </div>
            ) : (
              <form ref={form} onSubmit={handleSubmit}>
                {/* =================================================
                    HIDDEN TIME FIELD
                ================================================= */}
                <input type="hidden" name="time" value="" readOnly />

                {/* =================================================
                    NAME + EMAIL
                ================================================= */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="logo mb-2 block text-xs font-medium text-white/55"
                    >
                      Full name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      autoComplete="name"
                      className="
                        logo h-12 w-full rounded-xl
                        border border-white/[0.09]
                        bg-black/20
                        px-4
                        text-sm text-white
                        outline-none
                        placeholder:text-white/20
                        transition
                        focus:border-[#6DD054]/40
                        focus:bg-[#6DD054]/[0.025]
                      "
                    />
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="logo mb-2 block text-xs font-medium text-white/55"
                    >
                      Email address
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="
                        logo h-12 w-full rounded-xl
                        border border-white/[0.09]
                        bg-black/20
                        px-4
                        text-sm text-white
                        outline-none
                        placeholder:text-white/20
                        transition
                        focus:border-[#6DD054]/40
                        focus:bg-[#6DD054]/[0.025]
                      "
                    />
                  </div>
                </div>

                {/* =================================================
                    SUBJECT / TOPIC
                ================================================= */}
                <div className="mt-5">
                  <label
                    htmlFor="subject"
                    className="logo mb-2 block text-xs font-medium text-white/55"
                  >
                    Subject / Topic
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="
                      logo h-12 w-full rounded-xl
                      border border-white/[0.09]
                      bg-[#101210]
                      px-4
                      text-sm text-white/70
                      outline-none
                      transition
                      focus:border-[#6DD054]/40
                    "
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>

                    <option value="General question">General question</option>

                    <option value="Wallet / connection issue">
                      Wallet / connection issue
                    </option>

                    <option value="Borrowing">Borrowing</option>

                    <option value="Repayment">Repayment</option>

                    <option value="Supported assets">Supported assets</option>

                    <option value="Technical issue">Technical issue</option>

                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* =================================================
                    MESSAGE
                ================================================= */}
                <div className="mt-5">
                  <label
                    htmlFor="message"
                    className="logo mb-2 block text-xs font-medium text-white/55"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    required
                    rows={6}
                    className="
                      logo w-full resize-none rounded-xl
                      border border-white/[0.09]
                      bg-black/20
                      px-4 py-4
                      text-sm leading-6 text-white
                      outline-none
                      placeholder:text-white/20
                      transition
                      focus:border-[#6DD054]/40
                      focus:bg-[#6DD054]/[0.025]
                    "
                  />
                </div>

                {/* =================================================
                    SUBMIT BUTTON
                ================================================= */}
                <button
                  type="submit"
                  disabled={sending}
                  className="
                    group logo mt-6
                    flex h-12 w-full
                    items-center justify-center gap-2.5
                    rounded-xl
                    bg-[#6DD054]
                    text-sm font-bold
                    text-[#0b1609]
                    shadow-[0_10px_35px_rgba(109,208,84,0.12)]
                    transition-all duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#7ae360]
                    hover:shadow-[0_14px_40px_rgba(109,208,84,0.22)]
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <FiSend
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                          group-hover:-translate-y-0.5
                        "
                      />
                    </>
                  )}
                </button>

                <p className="logo mt-4 text-center text-[10px] leading-5 text-white/25">
                  We will only use your information to respond to your request.
                  Never share your private keys or recovery phrase.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* =====================================================
            BOTTOM CTA
        ===================================================== */}
        <div
          className="
            mt-16 overflow-hidden rounded-3xl
            border border-[#6DD054]/15
            bg-[#6DD054]/[0.035]
            p-7 text-center
            sm:p-10
          "
        >
          <div className="mx-auto max-w-2xl">
            <p className="logo text-xs uppercase tracking-[0.2em] text-[#6DD054]">
              Need help getting started?
            </p>

            <h3 className="logo mt-3 text-2xl font-semibold sm:text-3xl">
              Your liquidity journey starts here.
            </h3>

            <p className="logo mt-3 text-sm leading-6 text-white/40">
              Explore MiniLend, connect your wallet, and discover a simpler way
              to access liquidity.
            </p>

            <a
              href="#home"
              className="
                group logo mt-6 inline-flex
                items-center gap-2
                rounded-xl
                border border-[#6DD054]/40
                px-6 py-3
                text-xs font-semibold
                text-[#6DD054]
                transition-all duration-300
                hover:bg-[#6DD054]
                hover:text-black
              "
            >
              Explore MiniLend
              <FiArrowRight
                className="
                  transition-transform duration-300
                  group-hover:translate-x-1
                "
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
