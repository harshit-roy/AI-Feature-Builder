import { useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Sandpack } from "@codesandbox/sandpack-react"
import {
  FaSpinner,
  FaDownload,
  FaRocket,
  FaFloppyDisk,
  FaArrowUpRightFromSquare,
  FaCode,
  FaEye,
  FaWandMagicSparkles
} from "react-icons/fa6"

function PreviewPage() {
  const { slug } = useParams()

  const [editorCode, setEditorCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  let savedUser = null
  try {
    savedUser = JSON.parse(localStorage.getItem("user") || "null")
  } catch {
    savedUser = null
  }

  const token = savedUser?.token
  const isAdmin = savedUser?.role === "admin"

  const isValidCode = (code) => {
    return !!(code && typeof code === "string" && code.includes("GeneratedPage"))
  }

  useEffect(() => {
    document.title = "Preview • AI Feature Builder"
  }, [])

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        setError("")
        setMessage("")

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/features/preview/${slug}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        )

        let aiCode = res.data.generatedCode || ""
        aiCode = aiCode.replace(/```[a-z]*|```/gi, "").trim()

        if (!isValidCode(aiCode)) {
          setError("Generated code is invalid. Please edit and save a valid GeneratedPage component.")
        }

        setEditorCode(aiCode)
      } catch (err) {
        console.error("Preview fetch error:", err)
        setError("Unable to load preview")
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [slug, token])

  const wrappedCode = useMemo(() => {
    if (!isValidCode(editorCode)) return ""

    return `
import React, { useState, useEffect } from "react"

${editorCode}

export default function App() {
  return <GeneratedPage />
}
`.trim()
  }, [editorCode])

  const downloadCode = () => {
    if (!editorCode?.trim()) return

    const blob = new Blob([editorCode], { type: "text/javascript;charset=utf-8" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.download = `${slug}.jsx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  const openPublicPage = () => {
    window.open(`${window.location.origin}/live/${slug}`, "_blank")
  }

  const saveCode = async () => {
    if (!isAdmin) return

    if (!isValidCode(editorCode)) {
      setError("Code must contain a valid GeneratedPage component before saving.")
      setMessage("")
      return
    }

    try {
      setSaving(true)
      setMessage("")
      setError("")

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/features/update-code/${slug}`,
        { code: editorCode },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setMessage("Code saved successfully to the database.")
    } catch (err) {
      console.error("Save code error:", err)
      setError(err.response?.data?.message || "Failed to save code")
    } finally {
      setSaving(false)
    }
  }

  const deployPage = async () => {
    if (!isAdmin) return

    if (!isValidCode(editorCode)) {
      setError("Fix code before deploying.")
      setMessage("")
      return
    }

    try {
      setDeploying(true)
      setMessage("")
      setError("")

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/features/update-code/${slug}`,
        { code: editorCode },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/features/deploy/${slug}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      setMessage("Page deployed successfully.")
    } catch (err) {
      console.error("Deploy error:", err)
      setError(err.response?.data?.message || "Failed to deploy page")
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#EEF2FB] text-[#1F2A44]">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[280px] w-[280px] rounded-full bg-[#8A7CFF]/18 blur-3xl" />
        <div className="absolute top-1/3 -right-16 h-[260px] w-[260px] rounded-full bg-[#F472B6]/12 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {(message || error) && (
          <div
            className={`mt-6 rounded-[24px] border px-5 py-4 text-sm font-medium shadow-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-600"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {error || message}
          </div>
        )}

        <section className="mt-6 rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D5DF6]">
                Actions
              </p>
              <h2 className="mt-2 text-2xl font-bold">Manage this generated page</h2>
              <p className="mt-2 text-sm leading-7 text-[#64748B]">
                Download the code, preview the public page, or save and deploy changes as admin.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadCode}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE4F3] bg-[#F9FBFF] px-4 py-3 text-sm font-semibold text-[#1F2A44] transition hover:border-[#C9D6EE] hover:bg-white"
              >
                <FaDownload className="text-[#6D5DF6]" />
                Download Code
              </button>

              <button
                type="button"
                onClick={openPublicPage}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#DCE4F3] bg-[#F9FBFF] px-4 py-3 text-sm font-semibold text-[#1F2A44] transition hover:border-[#C9D6EE] hover:bg-white"
              >
                <FaArrowUpRightFromSquare className="text-[#6D5DF6]" />
                Open Public Page
              </button>

              {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={saveCode}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-2xl bg-[#F59E0B] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaFloppyDisk />}
                    {saving ? "Saving..." : "Save Code"}
                  </button>

                  <button
                    type="button"
                    onClick={deployPage}
                    disabled={deploying}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6D5DF6] to-[#8A7CFF] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(109,93,246,0.22)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {deploying ? <FaSpinner className="animate-spin" /> : <FaRocket />}
                    {deploying ? "Deploying..." : "Deploy"}
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D5DF6]">
                  Code Editor
                </p>
                <h3 className="mt-2 text-xl font-bold">Edit generated component</h3>
              </div>

              <div className="rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#6D5DF6]">
                {isAdmin ? "Editable" : "Read only"}
              </div>
            </div>

            <p className="mb-4 text-sm leading-7 text-[#64748B]">
              Edit the generated JSX below. Save will update the code directly in the database.
              Deploy will save the current code first, then make it live.
            </p>

            <div className="overflow-hidden rounded-[24px] border border-[#DDE5F2] bg-[#0F172A] shadow-inner">
              <textarea
                value={editorCode}
                onChange={(e) => {
                  setEditorCode(e.target.value)
                  if (message) setMessage("")
                  if (error) setError("")
                }}
                readOnly={!isAdmin}
                spellCheck={false}
                className="min-h-[720px] w-full resize-y border-0 bg-[#0F172A] p-5 font-mono text-[13px] leading-6 text-[#E2E8F0] outline-none placeholder:text-slate-500"
                placeholder="Generated code will appear here..."
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_20px_50px_rgba(31,42,68,0.06)] sm:p-6">
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6D5DF6]">
                Live Preview
              </p>
              <h3 className="mt-2 text-xl font-bold">See your changes instantly</h3>
              <p className="mt-2 text-sm leading-7 text-[#64748B]">
                The preview updates from the code editor above. Invalid code will block rendering until fixed.
              </p>
            </div>

            <div className="overflow-hidden rounded-[24px] border border-[#DDE5F2] bg-white shadow-sm">
              {loading ? (
                <div className="flex min-h-[720px] items-center justify-center px-6">
                  <div className="inline-flex items-center gap-3 rounded-2xl border border-[#E6EBF5] bg-white px-5 py-4 text-[#64748B] shadow-sm">
                    <FaSpinner className="animate-spin text-[#6D5DF6]" />
                    Loading preview...
                  </div>
                </div>
              ) : !isValidCode(editorCode) ? (
                <div className="flex min-h-[720px] items-center justify-center px-6">
                  <div className="max-w-lg rounded-[24px] border border-red-200 bg-red-50 p-8 text-center shadow-sm">
                    <div className="mb-3 text-4xl">⚠️</div>
                    <h4 className="text-xl font-bold text-[#1F2A44]">Invalid generated code</h4>
                    <p className="mt-3 text-sm leading-7 text-[#64748B]">
                      The preview requires a valid <code className="rounded bg-white px-1.5 py-0.5 text-[#1F2A44]">GeneratedPage</code> component.
                      Fix the code in the editor, then save or deploy again.
                    </p>
                  </div>
                </div>
              ) : (
                <Sandpack
                  template="react"
                  files={{
                    "/App.js": wrappedCode
                  }}
                  options={{
                    showConsole: true,
                    showNavigator: false,
                    showTabs: false,
                    showLineNumbers: true,
                    editorHeight: 720,
                    editorWidthPercentage: 0,
                    wrapContent: true
                  }}
                  customSetup={{
                    dependencies: {
                      react: "^18.2.0",
                      "react-dom": "^18.2.0"
                    }
                  }}
                />
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default PreviewPage