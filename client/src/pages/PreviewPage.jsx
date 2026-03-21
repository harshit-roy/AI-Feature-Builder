import { useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { Sandpack } from "@codesandbox/sandpack-react"

function PreviewPage() {
  const { slug } = useParams()

  const [editorCode, setEditorCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const savedUser = JSON.parse(localStorage.getItem("user") || "null")
  const token = savedUser?.token
  const isAdmin = savedUser?.role === "admin"

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        setError("")
        setMessage("")

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/features/preview/${slug}`,
          {
            headers: token
              ? { Authorization: `Bearer ${token}` }
              : {}
          }
        )

        let aiCode = res.data.generatedCode || ""
        aiCode = aiCode.replace(/```[a-z]*|```/gi, "").trim()

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
    return `
import React, { useState, useEffect } from "react"

${editorCode}

export default function App() {
  return <GeneratedPage />
}
`.trim()
  }, [editorCode])

  const downloadCode = () => {
    const blob = new Blob([editorCode], { type: "text/javascript" })
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

      setMessage("Code saved successfully")
    } catch (err) {
      console.error("Save code error:", err)
      setError("Failed to save code")
    } finally {
      setSaving(false)
    }
  }

  const deployPage = async () => {
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

      setMessage("Page deployed successfully")
    } catch (err) {
      console.error("Deploy error:", err)
      setError("Failed to deploy page")
    } finally {
      setDeploying(false)
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #020617 100%)",
        padding: "20px",
        fontFamily: "Inter, system-ui, sans-serif"
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto"
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h1
            style={{
              color: "#ffffff",
              fontSize: "28px",
              fontWeight: "700",
              marginBottom: "6px"
            }}
          >
            AI Feature Preview
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              margin: 0
            }}
          >
            Review, edit, save and deploy the generated feature
          </p>
        </div>

        {(message || error) && (
          <div
            style={{
              marginBottom: "16px",
              padding: "12px 14px",
              borderRadius: "10px",
              background: error ? "rgba(239,68,68,0.12)" : "rgba(34,197,94,0.12)",
              color: error ? "#fca5a5" : "#86efac",
              border: error ? "1px solid rgba(239,68,68,0.35)" : "1px solid rgba(34,197,94,0.35)"
            }}
          >
            {error || message}
          </div>
        )}

        <div
          style={{
            background: "#020617",
            border: "1px solid #1e293b",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.35)"
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              padding: "14px 16px",
              borderBottom: "1px solid #1e293b",
              background: "rgba(15,23,42,0.9)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap"
              }}
            >
              <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#ef4444" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#f59e0b" }} />
              <span style={{ width: "10px", height: "10px", borderRadius: "999px", background: "#22c55e" }} />
              <span
                style={{
                  color: "#cbd5e1",
                  fontSize: "13px",
                  marginLeft: "8px"
                }}
              >
                sandbox-preview / {slug}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px"
              }}
            >
              <button
                onClick={downloadCode}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Download Code
              </button>

              <button
                onClick={openPublicPage}
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background: "#16a34a",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: "600"
                }}
              >
                Open Public Page
              </button>

              {isAdmin && (
                <>
                  <button
                    onClick={saveCode}
                    disabled={saving}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "none",
                      background: saving ? "#94a3b8" : "#f59e0b",
                      color: "#fff",
                      cursor: saving ? "not-allowed" : "pointer",
                      fontWeight: "600"
                    }}
                  >
                    {saving ? "Saving..." : "Save Code"}
                  </button>

                  <button
                    onClick={deployPage}
                    disabled={deploying}
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      border: "none",
                      background: deploying ? "#94a3b8" : "#7c3aed",
                      color: "#fff",
                      cursor: deploying ? "not-allowed" : "pointer",
                      fontWeight: "600"
                    }}
                  >
                    {deploying ? "Deploying..." : "Deploy"}
                  </button>
                </>
              )}
            </div>
          </div>

          <div style={{ minHeight: "680px" }}>
            {loading ? (
              <div
                style={{
                  minHeight: "680px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "14px",
                  color: "#cbd5e1",
                  padding: "30px"
                }}
              >
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    border: "6px solid rgba(148,163,184,0.25)",
                    borderTopColor: "#38bdf8",
                    animation: "spin 1s linear infinite"
                  }}
                />
                <h2 style={{ margin: 0, fontSize: "20px", color: "#fff" }}>
                  Loading preview...
                </h2>
                <p style={{ margin: 0, color: "#94a3b8", textAlign: "center", maxWidth: "420px" }}>
                  Preparing your AI generated page. If the component has an issue, you can still edit and save it before deployment.
                </p>
                <style>
                  {`
                    @keyframes spin {
                      from { transform: rotate(0deg); }
                      to { transform: rotate(360deg); }
                    }
                  `}
                </style>
              </div>
            ) : (
              <Sandpack
                template="react"
                files={{
                  "/App.js": wrappedCode
                }}
                options={{
                  showConsole: true,
                  showLineNumbers: true,
                  showTabs: false,
                  editorHeight: 680,
                  editorWidthPercentage: 55,
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
      </div>
    </div>
  )
}

export default PreviewPage