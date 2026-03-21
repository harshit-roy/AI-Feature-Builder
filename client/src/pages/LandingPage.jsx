import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FaMagic,
  FaRocket,
  FaCode,
  FaCheckCircle,
  FaLayerGroup,
  FaShieldAlt,
  FaArrowRight,
  FaLaptopCode,
  FaUserCheck,
  FaEye,
  FaSyncAlt
} from "react-icons/fa"

const steps = [
  {
    icon: <FaMagic />,
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
    icon: <FaSyncAlt />,
    title: "Edit & Re-Deploy",
    desc: "Refine code, save updates, and redeploy improved versions."
  },
  {
    icon: <FaShieldAlt />,
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#07111f] text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] bg-sky-500/10 blur-3xl rounded-full" />
        <div className="absolute top-24 right-0 h-[450px] w-[450px] bg-fuchsia-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_35%)]" />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-400/20 bg-sky-400/10 text-sky-300 text-sm font-medium mb-6">
              <FaMagic />
              AI Powered Feature Workflow
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Build feature pages with
              <span className="block bg-gradient-to-r from-sky-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                AI, review, and deploy
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-300 leading-8 max-w-2xl">
              A modern workflow where feature requests move from prompt to AI generation,
              admin review, live preview, editing, deployment, and rollback — all inside one platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold shadow-lg shadow-sky-500/20 transition"
              >
                Get Started
                <FaArrowRight />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition"
              >
                Login
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                ["Prompt Based", "Generation"],
                ["Preview", "Before Deploy"],
                ["Admin", "Approval Flow"],
                ["Rollback", "Support"]
              ].map(([top, bottom]) => (
                <div
                  key={top}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md"
                >
                  <div className="text-lg font-bold text-white">{top}</div>
                  <div className="text-sm text-slate-400">{bottom}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative"
          >
            <div className="rounded-[28px] border border-white/10 bg-[#0b1729]/80 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10 bg-[#0a1424]/80">
                <span className="h-3 w-3 rounded-full bg-rose-400" />
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-sm text-slate-400">
                  Workflow Overview
                </span>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid gap-4">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.08 }}
                      className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white shadow-lg">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{step.title}</h3>
                        <p className="text-sm text-slate-400 mt-1 leading-6">
                          {step.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -right-6 hidden md:block rounded-2xl border border-sky-400/20 bg-sky-400/10 px-5 py-4 backdrop-blur-xl shadow-xl">
              <div className="text-sky-300 font-semibold">End-to-End Flow</div>
              <div className="text-sm text-slate-300 mt-1">
                Request → Review → Preview → Deploy
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-sky-300 font-semibold uppercase tracking-[0.2em] text-sm">
            Platform Capabilities
          </p>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">
            Built for practical AI-assisted product development
          </h2>
          <p className="mt-5 text-slate-400 text-lg leading-8">
            This platform is not just a generator. It includes governance, review,
            iteration, deployment, and rollback — making it closer to a real product workflow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl hover:-translate-y-1 transition"
            >
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center text-white text-xl shadow-lg">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-slate-400 leading-7">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Showcase */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-sky-500/10 via-[#091423] to-violet-500/10 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.12),transparent_35%)]" />

          <div className="relative z-10">
            <p className="text-sky-300 font-semibold uppercase tracking-[0.2em] text-sm">
              Example Outputs
            </p>
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold">
              Example pages this workflow can produce
            </h2>
            <p className="mt-5 text-slate-300 text-lg leading-8 max-w-3xl">
              The system can create interactive feature blocks, small product experiences,
              and reusable pages that go through review before becoming public.
            </p>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {demoPages.map((page, idx) => (
                <motion.div
                  key={page}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="rounded-2xl border border-white/10 bg-[#07111f]/80 backdrop-blur-md p-5 hover:border-sky-400/30 transition"
                >
                  <div className="text-sky-300 text-sm font-semibold mb-2">
                    Generated Output
                  </div>
                  <div className="text-white font-semibold text-lg">{page}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 md:p-14 text-center shadow-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Explore the full workflow
          </h2>
          <p className="mt-5 text-slate-400 text-lg max-w-2xl mx-auto leading-8">
            Create a request, review generated output, and see how the system moves
            features from idea to live experience.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 font-bold transition shadow-lg shadow-sky-500/20"
            >
              Create Account
              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}