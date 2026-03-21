import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

export default function GeneratedPage() {
  const { slug } = useParams()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchCode = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await api.get(`/features/page/${slug}`)

        let aiCode = res.data.generatedCode || ""
        aiCode = aiCode.replace(/```[a-z]*|```/gi, "").trim()

        setCode(aiCode)
      } catch (err) {
        console.error("Live page fetch error:", err)
        setError("Page not found")
      } finally {
        setLoading(false)
      }
    }

    fetchCode()
  }, [slug])

  const iframeContent = useMemo(() => {
    if (!code) return ""

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Generated Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
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
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    ${code}

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<GeneratedPage />);
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

  if (error || !code) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="max-w-xl w-full rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center shadow-2xl">
          <div className="text-6xl mb-5">🚧</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Page not available
          </h1>
          <p className="text-slate-400 leading-7">
            This page is not deployed yet or is currently under improvement.
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
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  )
}