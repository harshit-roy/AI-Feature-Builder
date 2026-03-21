import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import {
  FaRocket,
  FaCode,
  FaLayerGroup,
  FaShield,
  FaArrowRight,
  FaLaptopCode,
  FaUserCheck,
  FaEye,
  FaRotate,
  FaStar,
  FaRegLightbulb,
  FaWandMagicSparkles
} from "react-icons/fa6"

const steps = [
  {
    icon: <FaWandMagicSparkles />,
    title: "Submit Prompt",
    desc: "Describe the feature you want to build in simple language."
  },
  {
    icon: <FaUserCheck />,
    title: "Admin Review",
    desc: "Requests are reviewed before moving to the generation stage."
  },
  {
    icon: <FaCode />,
    title: "AI Generates UI",
    desc: "The platform creates React-based feature pages automatically."
  },
  {
    icon: <FaEye />,
    title: "Preview & Edit",
    desc: "Admins can preview, refine, and improve the generated output."
  },
  {
    icon: <FaRocket />,
    title: "Deploy Live",
    desc: "The final page is deployed and made available through the main site."
  }
]

const features = [
  {
    icon: <FaLayerGroup />,
    title: "AI Feature Generation",
    desc: "Convert prompts into ready-to-review feature pages."
  },
  {
    icon: <FaLaptopCode />,
    title: "Live Preview System",
    desc: "Inspect generated pages before making them public."
  },
  {
    icon: <FaRotate />,
    title: "Edit & Re-Deploy",
    desc: "Refine code, save updates, and redeploy improved versions."
  },
  {
    icon: <FaShield />,
    title: "Admin Controlled Workflow",
    desc: "Keep deployment safe with approval and rollback support."
  }
]

const demoPages = [
  "Modern Calculator",
  "Tic Tac Toe Game",
  "Interactive Contact Section",
  "Product Showcase UI",
  "Dynamic Landing Block",
  "Feature Preview Module"
]

const stats = [
  { value: "AI", label: "Prompt Driven" },
  { value: "Live", label: "Preview Ready" },
  { value: "Admin", label: "Controlled Flow" },
  { value: "Safe", label: "Rollback Support" }
]

export default function LandingPage() {
  useEffect(() => {
    document.title = "AI Feature Builder"
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#EEF2FB] text-[#1F2A44]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-80px] h-[300px] w-[300px] rounded-full bg-[#8A7CFF]/20 blur-3xl" />
        <div className="absolute top-20 right-[-80px] h-[320px] w-[320px] rounded-full bg-[#F472B6]/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[260px] w-[260px] rounded-full bg-[#6D5DF6]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(138,124,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.10),transparent_24%)]" />
      </div>

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-14 lg:pb-24">
        <div className="overflow-hidden rounded-[32px] border border-white/70 bg-white/80 shadow-[0_30px_80px_rgba(109,93,246,0.10)] backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] items-center gap-10 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className=""
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D7DDF3] bg-[#F8FAFF] px-4 py-2 text-sm font-semibold text-[#6D5DF6] shadow-sm">
                <FaWandMagicSparkles />
                AI Powered Feature Workflow
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Turn prompts into{" "}
                <span className="bg-gradient-to-r from-[#6D5DF6] via-[#8A7CFF] to-[#F472B6] bg-clip-text text-transparent">
                  polished feature pages
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-[#64748B] sm:text-lg sm:leading-8">
                A premium workflow where users submit ideas, AI generates React UI,
                admins review and refine it, and approved pages go live through one
                smooth platform.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-6 py-3.5 font-semibold text-white shadow-[0_14px_28px_rgba(109,93,246,0.28)] transition hover:translate-y-[-1px]"
                >
                  Get Started
                  <FaArrowRight className="text-sm" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D7DDF3] bg-white px-6 py-3.5 font-semibold text-[#1F2A44] shadow-sm transition hover:bg-[#F7F9FE]"
                >
                  Login
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#E6EBF7] bg-[#F9FBFF] px-4 py-4 shadow-sm"
                  >
                    <div className="text-lg font-bold text-[#1F2A44]">{item.value}</div>
                    <div className="mt-1 text-sm text-[#64748B]">{item.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.08 }}
              className=""
            >
              <div className="relative rounded-[30px] border border-[#E2E8F4] bg-[#F5F7FD] p-4 shadow-[0_20px_50px_rgba(31,42,68,0.08)] sm:p-5">
                <div className="rounded-[24px] border border-white bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEF2F8] pb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-[#FCA5A5]" />
                      <span className="h-3 w-3 rounded-full bg-[#FCD34D]" />
                      <span className="h-3 w-3 rounded-full bg-[#86EFAC]" />
                    </div>
                    <div className="rounded-full bg-[#F6F7FC] px-3 py-1 text-xs font-medium text-[#64748B]">
                      AI Feature Pipeline
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {steps.map((step, index) => (
                      <motion.div
                        key={step.title}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + index * 0.08 }}
                        className="group flex items-start gap-4 rounded-2xl border border-[#EBF0F8] bg-[#FBFCFF] p-4 transition hover:border-[#D8DFF3] hover:bg-white"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#8A7CFF] text-white shadow-md">
                          {step.icon}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-[#1F2A44]">
                            {step.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-[#64748B]">
                            {step.desc}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-5 py-4 text-white shadow-md">
                    <div className="flex items-center gap-2 text-sm font-semibold opacity-95">
                      <FaStar />
                      End-to-End Flow
                    </div>
                    <p className="mt-2 text-sm text-white/90">
                      Request → Review → Preview → Deploy
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EBF7] bg-white px-5 py-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2A44]">
                      <FaRegLightbulb className="text-[#F472B6]" />
                      Production Mindset
                    </div>
                    <p className="mt-2 text-sm text-[#64748B]">
                      Review, edit, and rollback support before pages go live.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6D5DF6]">
            Platform Capabilities
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Built for real AI-assisted workflow, not just one-click generation
          </h2>
          <p className="mt-5 text-base leading-7 text-[#64748B] sm:text-lg sm:leading-8">
            Your app already has the right core idea. This section presents it in a more
            premium SaaS style while keeping all existing functionality untouched.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="rounded-[28px] border border-white/80 bg-white/85 p-6 shadow-[0_18px_40px_rgba(31,42,68,0.06)] backdrop-blur-sm transition hover:-translate-y-1"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#8A7CFF] text-xl text-white shadow-md">
                {feature.icon}
              </div>

              <h3 className="mt-5 text-xl font-semibold text-[#1F2A44]">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#64748B] sm:text-base">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="overflow-hidden rounded-[32px] border border-white/80 bg-gradient-to-br from-[#EDEBFF] via-[#F9FAFF] to-[#FDF4FB] p-6 shadow-[0_24px_60px_rgba(109,93,246,0.10)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#6D5DF6]">
                Example Outputs
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Example pages this workflow can produce
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#64748B] sm:text-lg sm:leading-8">
                Presenting generated pages as clean premium cards makes the landing page
                feel much closer to a modern product showcase.
              </p>

              <div className="mt-8 rounded-[28px] border border-white/70 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#6D5DF6]">Workflow Snapshot</p>
                    <h3 className="mt-1 text-xl font-bold text-[#1F2A44]">
                      Prompt to Live Page
                    </h3>
                  </div>
                  <div className="rounded-full bg-[#EEF2FB] px-3 py-1 text-xs font-medium text-[#64748B]">
                    Responsive UI
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {["Submit", "Generate", "Review", "Preview", "Deploy"].map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-[#F8FAFF] px-4 py-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6D5DF6] text-sm font-bold text-white">
                        {i + 1}
                      </div>
                      <span className="font-medium text-[#1F2A44]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {demoPages.map((page, idx) => (
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-[28px] border border-white/80 bg-white/85 p-5 shadow-[0_18px_38px_rgba(31,42,68,0.06)]"
                >
                  <div className="rounded-2xl bg-gradient-to-br from-[#6D5DF6] to-[#8A7CFF] p-[1px]">
                    <div className="rounded-2xl bg-[#F7F8FE] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#6D5DF6] shadow-sm">
                          Generated Output
                        </span>
                        <span className="h-2.5 w-2.5 rounded-full bg-[#86EFAC]" />
                      </div>

                      <div className="mt-5 h-28 rounded-2xl bg-gradient-to-br from-[#E9ECF8] via-[#F5F7FB] to-[#FDF4FB]" />

                      <div className="mt-4 text-lg font-semibold text-[#1F2A44]">
                        {page}
                      </div>
                      <p className="mt-1 text-sm text-[#64748B]">
                        Preview-ready AI generated feature block.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-7xl px-4 pb-2 pt-2 sm:px-6 lg:px-8 lg:pb-4">
        <div className="rounded-[32px] border border-white/80 bg-white/85 p-6 text-center shadow-[0_24px_60px_rgba(31,42,68,0.08)] backdrop-blur-sm sm:p-8 lg:p-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Explore the full workflow
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#64748B] sm:text-lg sm:leading-8">
            Create a request, review generated output, and move features from idea
            to live experience with a premium admin-driven process.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-6 py-3.5 font-semibold text-white shadow-[0_14px_28px_rgba(109,93,246,0.28)] transition hover:translate-y-[-1px]"
            >
              Create Account
              <FaArrowRight className="text-sm" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D7DDF3] bg-[#F8FAFF] px-6 py-3.5 font-semibold text-[#1F2A44] transition hover:bg-white"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-[28px] border border-white/80 bg-white/80 backdrop-blur-sm shadow-[0_20px_50px_rgba(31,42,68,0.06)] px-6 py-6 sm:px-8 sm:py-8">
          
          {/* Top Row */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            
            {/* Left */}
            <div>
              <h3 className="text-lg font-bold text-[#1F2A44]">
                AI Feature Builder
              </h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Build, review, and deploy AI-generated features with a modern workflow.
              </p>
            </div>

            {/* Right */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#64748B]">
              <a href="#" className="hover:text-[#6D5DF6] transition">Home</a>
              <a href="#" className="hover:text-[#6D5DF6] transition">Features</a>
              <a href="#" className="hover:text-[#6D5DF6] transition">Explore</a>
              <a href="#" className="hover:text-[#6D5DF6] transition">Contact</a>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-[#E2E8F4] to-transparent" />

          {/* Bottom Row */}
          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">
            
            <p className="text-sm text-[#64748B]">
              © {new Date().getFullYear()} AI Feature Builder. All rights reserved.
            </p>

            <p className="text-sm font-medium text-[#1F2A44]">
              Made with ❤️ by{" "}
              <span className="bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] bg-clip-text text-transparent font-semibold">
                Harshit Roy
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}