import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect } from "react"
import {
  FaCode,
  FaLayerGroup,
  FaShield,
  FaArrowRight,
  FaLaptopCode,
  FaRotate,
} from "react-icons/fa6"

/* ============================================================================
   AI Feature Builder — Landing Page
   Formal / editorial direction. White base, one accent (indigo), no
   gradients, no blob backgrounds, no card-chrome on non-interactive
   content. Only real links and buttons get button styling — everything
   else (stats, steps, feature items) sits flat on the page as content.
============================================================================ */

const steps = [
  {
    title: "Submit a prompt",
    desc: "Describe the feature you want in plain language.",
  },
  {
    title: "Admin review",
    desc: "Requests are reviewed before moving to generation.",
  },
  {
    title: "AI generates the UI",
    desc: "The platform builds a React-based feature page automatically.",
  },
  {
    title: "Preview & refine",
    desc: "Admins preview, edit, and improve the generated output.",
  },
  {
    title: "Deploy live",
    desc: "The finished page is deployed and made available on the main site.",
  },
]

const features = [
  {
    icon: FaLayerGroup,
    title: "AI feature generation",
    desc: "Converts prompts into ready-to-review feature pages.",
  },
  {
    icon: FaLaptopCode,
    title: "Live preview system",
    desc: "Inspect generated pages before making them public.",
  },
  {
    icon: FaRotate,
    title: "Edit & redeploy",
    desc: "Refine code, save updates, and redeploy improved versions.",
  },
  {
    icon: FaShield,
    title: "Admin-controlled workflow",
    desc: "Approval and rollback support keep deployment safe.",
  },
]

const demoPages = [
  "Modern Calculator",
  "Tic Tac Toe Game",
  "Interactive Contact Section",
  "Product Showcase UI",
  "Dynamic Landing Block",
  "Feature Preview Module",
]

const stats = [
  { value: "Prompt", label: "Driven" },
  { value: "Live", label: "Preview" },
  { value: "Admin", label: "Controlled" },
  { value: "Safe", label: "Rollback" },
]

export default function LandingPage() {
  useEffect(() => {
    document.title = "AI Feature Builder"
  }, [])

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#4F46E5]">
              AI-powered feature workflow
            </p>

            <h1 className="mt-4 max-w-xl text-[40px] font-semibold leading-[1.1] tracking-tight sm:text-[48px]">
              Turn prompts into production-ready feature pages.
            </h1>

            <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-[#6B7280] sm:text-[17px]">
              Users submit ideas, AI generates the React UI, admins review and
              refine it, and approved pages go live — one connected workflow
              from request to deployment.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[#1F2937]"
              >
                Get started
                <FaArrowRight className="text-[12px]" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-5 py-2.5 text-[14.5px] font-medium text-[#111827] transition-colors hover:border-[#D1D5DB] hover:bg-[#FAFAF9]"
              >
                Log in
              </Link>
            </div>

            {/* Stats — flat inline strip, not 4 separate tiles */}
            <div className="mt-12 flex max-w-lg flex-wrap divide-x divide-[#E5E7EB] border-t border-[#E5E7EB] pt-6">
              {stats.map((item) => (
                <div key={item.label} className="flex-1 px-5 first:pl-0">
                  <div className="text-[15px] font-semibold text-[#111827]">
                    {item.value}
                  </div>
                  <div className="mt-0.5 text-[12.5px] text-[#9CA3AF]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Pipeline — vertical connected timeline, single accent line */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:pt-1"
          >
            <div className="rounded-xl border border-[#E5E7EB] bg-[#FAFAF9] p-6 sm:p-7">
              <p className="text-[12.5px] font-medium uppercase tracking-[0.1em] text-[#9CA3AF]">
                How it works
              </p>

              <div className="relative mt-5">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[#E5E7EB]" />
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={step.title} className="relative flex gap-4 pl-0">
                      <div className="relative z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border-2 border-[#4F46E5] bg-white text-[11px] font-semibold text-[#4F46E5]">
                        {index + 1}
                      </div>
                      <div className="-mt-0.5">
                        <h3 className="text-[14.5px] font-semibold text-[#111827]">
                          {step.title}
                        </h3>
                        <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#6B7280]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#E5E7EB] bg-[#FAFAF9]">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
          <div className="max-w-xl">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#4F46E5]">
              Platform capabilities
            </p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[32px]">
              Built for a real review workflow, not one-click generation
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="border-t border-[#E5E7EB] pt-5">
                  <Icon className="text-[18px] text-[#4F46E5]" />
                  <h3 className="mt-4 text-[15px] font-semibold text-[#111827]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[#6B7280]">
                    {feature.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Example outputs */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-[#4F46E5]">
              Example outputs
            </p>
            <h2 className="mt-3 text-[28px] font-semibold tracking-tight sm:text-[32px]">
              What this workflow can produce
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#6B7280]">
              A sample of the kinds of feature pages users have generated and
              shipped through the platform.
            </p>
          </div>

          <div className="border-t border-[#E5E7EB]">
            {demoPages.map((page, i) => (
              <div
                key={page}
                className="flex items-center justify-between border-b border-[#E5E7EB] py-4"
              >
                <span className="text-[14.5px] text-[#111827]">{page}</span>
                <span className="font-mono text-[12px] text-[#9CA3AF]">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">
            Explore the full workflow
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-[#6B7280]">
            Create a request, review the generated output, and move features
            from idea to live experience.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-[#111827] px-5 py-2.5 text-[14.5px] font-medium text-white transition-colors hover:bg-[#1F2937]"
            >
              Create account
              <FaArrowRight className="text-[12px]" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-5 py-2.5 text-[14.5px] font-medium text-[#111827] transition-colors hover:border-[#D1D5DB] hover:bg-[#FAFAF9]"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB]">
        <div className="mx-auto max-w-6xl px-6 py-10 sm:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-[15px] font-semibold text-[#111827]">
                AI Feature Builder
              </h3>
              <p className="mt-1 text-[13.5px] text-[#6B7280]">
                Build, review, and deploy AI-generated features.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 text-[13.5px] font-medium text-[#6B7280]">
              <a href="#" className="hover:text-[#111827]">Home</a>
              <a href="#" className="hover:text-[#111827]">Features</a>
              <a href="#" className="hover:text-[#111827]">Explore</a>
              <a href="#" className="hover:text-[#111827]">Contact</a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-[#E5E7EB] pt-6 text-[13px] text-[#9CA3AF] sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} AI Feature Builder. All rights reserved.</p>
            <p>
              Built by <span className="font-medium text-[#111827]">Harshit Roy</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
