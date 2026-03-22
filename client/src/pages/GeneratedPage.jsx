import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

export default function GeneratedPage() {
  const { slug } = useParams()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const isValidCode = (value) => {
    return typeof value === "string" && value.includes("GeneratedPage")
  }

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await api.get(`/features/page/${slug}`)

        let aiCode = res.data.generatedCode || ""
        aiCode = aiCode.replace(/```[a-z]*|```/gi, "").trim()

        if (!isValidCode(aiCode)) {
          setError("This page contains invalid generated code.")
          setCode("")
          return
        }

        setCode(aiCode)
      } catch (err) {
        console.error("Live page fetch error:", err)
        setError("Page not found")
        setCode("")
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [slug])

  const iframeContent = useMemo(() => {
    if (!isValidCode(code)) return ""

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generated Page</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    html, body, #root {
      margin: 0;
      padding: 0;
      min-height: 100%;
      width: 100%;
      background: transparent;
    }

    body {
      font-family: Inter, system-ui, sans-serif;
    }

    .afb-error-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(180deg, #020617 0%, #0f172a 100%);
      box-sizing: border-box;
    }

    .afb-error-card {
      width: 100%;
      max-width: 720px;
      border-radius: 28px;
      border: 1px solid rgba(148, 163, 184, 0.16);
      background: rgba(15, 23, 42, 0.86);
      color: white;
      padding: 40px 28px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
      text-align: center;
      backdrop-filter: blur(10px);
    }

    .afb-error-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(239, 68, 68, 0.12);
      color: #fca5a5;
      border: 1px solid rgba(239, 68, 68, 0.24);
      margin-bottom: 18px;
    }

    .afb-error-title {
      margin: 0 0 10px 0;
      font-size: 30px;
      line-height: 1.2;
      font-weight: 800;
    }

    .afb-error-text {
      margin: 0 auto;
      max-width: 560px;
      font-size: 15px;
      line-height: 1.8;
      color: #94a3b8;
    }

    .afb-error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 24px;
    }

    .afb-btn {
      appearance: none;
      border: none;
      border-radius: 14px;
      padding: 12px 18px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: 0.2s ease;
    }

    .afb-btn-primary {
      background: linear-gradient(90deg, #6d5df6 0%, #8a7cff 100%);
      color: white;
      box-shadow: 0 12px 24px rgba(109, 93, 246, 0.28);
    }

    .afb-btn-secondary {
      background: rgba(148, 163, 184, 0.12);
      color: white;
      border: 1px solid rgba(148, 163, 184, 0.16);
    }

    .afb-btn:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    // Prevent accidental native form submission inside sandboxed iframe.
    // React forms with e.preventDefault() will still work normally.
    document.addEventListener(
      "submit",
      function (event) {
        if (!event.defaultPrevented) {
          event.preventDefault();
        }
      },
      true
    );

    class PreviewErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false };
      }

      static getDerivedStateFromError() {
        return { hasError: true };
      }

      componentDidCatch(error) {
        console.error("Generated page runtime error:", error);
      }

      render() {
        if (this.state.hasError) {
          return (
            <div className="afb-error-shell">
              <div className="afb-error-card">
                <div className="afb-error-badge">Runtime Error</div>
                <h1 className="afb-error-title">This generated page could not be rendered</h1>
                <p className="afb-error-text">
                  The deployed page hit a rendering issue. Please review the generated code in preview,
                  save corrections, and redeploy the page.
                </p>
                <div className="afb-error-actions">
                  <button
                    className="afb-btn afb-btn-primary"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                  <button
                    className="afb-btn afb-btn-secondary"
                    onClick={() => window.history.back()}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return this.props.children;
      }
    }

    try {
      ${code}

      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <PreviewErrorBoundary>
          <GeneratedPage />
        </PreviewErrorBoundary>
      );
    } catch (error) {
      console.error("Generated page bootstrap error:", error);

      const root = ReactDOM.createRoot(document.getElementById("root"));
      root.render(
        <div className="afb-error-shell">
          <div className="afb-error-card">
            <div className="afb-error-badge">Invalid Code</div>
            <h1 className="afb-error-title">This generated page could not start</h1>
            <p className="afb-error-text">
              The deployed page contains invalid generated code or unsupported syntax.
              Please open the preview page, update the code, and redeploy it.
            </p>
            <div className="afb-error-actions">
              <button
                className="afb-btn afb-btn-primary"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
              <button
                className="afb-btn afb-btn-secondary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
  </script>
</body>
</html>
    `.trim()
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-lg w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full border-4 border-slate-700 border-t-cyan-400 animate-spin" />
          <h1 className="text-2xl font-bold text-white mb-3">
            Webpage is getting ready
          </h1>
          <p className="text-slate-400 leading-7">
            We are preparing the deployed experience for this page.
          </p>
        </div>
      </div>
    )
  }

  if (error || !isValidCode(code)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl">
          <div className="text-6xl mb-5">🚧</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Page not available
          </h1>
          <p className="text-slate-400 leading-7">
            {error || "This page is not deployed yet or is currently under improvement."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <iframe
        title="generated-live-page"
        srcDoc={iframeContent}
        className="w-full min-h-screen border-0 bg-white"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  )
}