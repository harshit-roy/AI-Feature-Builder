const axios = require("axios")

exports.createSandbox = async (req, res) => {

  let { code } = req.body

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      error: "Valid code is required"
    })
  }

  try {

    let cleanedCode = code

    // -----------------------------
    // CLEAN AI CODE
    // -----------------------------

    // Remove imports
    cleanedCode = cleanedCode.replace(/^import .*$/gm, "")

    // Remove exports
    cleanedCode = cleanedCode.replace(/export\s+default\s+/g, "")
    cleanedCode = cleanedCode.replace(/export\s+/g, "")

    // Remove App component if AI created one
    cleanedCode = cleanedCode.replace(/function\s+App\s*\([\s\S]*?\}\s*/g, "")
    cleanedCode = cleanedCode.replace(/const\s+App\s*=\s*\([\s\S]*?\}\s*;?/g, "")

    // Fix React.useState → useState
    cleanedCode = cleanedCode.replace(/React\.useState/g, "useState")
    cleanedCode = cleanedCode.replace(/React\.useEffect/g, "useEffect")

    cleanedCode = cleanedCode.trim()

    // -----------------------------
    // BUILD FINAL APP FILE
    // -----------------------------

    const finalAppCode = `
import React, { useState, useEffect } from "react"
import "./index.css"

${cleanedCode}

export default function App() {
  return <GeneratedPage />
}
`

    // -----------------------------
    // CREATE SANDBOX
    // -----------------------------

    const response = await axios.post(
      "https://api.github.com/gists",
      {
        description: "AI Generated React Page",
        public: true,
        files: {

          "package.json": {
            content: JSON.stringify({
              name: "ai-react-page",
              private: true,
              type: "module",
              scripts: {
                dev: "vite",
                build: "vite build",
                preview: "vite preview"
              },
              dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0"
              },
              devDependencies: {
                vite: "^5.0.0",
                "@vitejs/plugin-react": "^4.0.0"
              }
            }, null, 2)
          },

          "vite.config.js": {
            content: `
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()]
})
`
          },

          // --------------------------------
          // TAILWIND CSS (GUARANTEED LOAD)
          // --------------------------------

          "index.css": {
            content: `
@tailwind base;
@tailwind components;
@tailwind utilities;
`
          },

          "tailwind.config.js": {
            content: `
export default {
  content: ["./index.html", "./**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
          },

          "postcss.config.js": {
            content: `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
          },

          // --------------------------------
          // INDEX HTML
          // --------------------------------

          "index.html": {
            content: `
<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AI Generated Page</title>
</head>

<body>

<div id="root"></div>

<script type="module" src="/main.jsx"></script>

</body>

</html>
`
          },

          // --------------------------------
          // MAIN REACT ENTRY
          // --------------------------------

          "main.jsx": {
            content: `
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
`
          },

          // --------------------------------
          // APP FILE
          // --------------------------------

          "App.jsx": {
            content: finalAppCode
          }

        }
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          "User-Agent": "ai-feature-builder",
          Accept: "application/vnd.github+json"
        }
      }
    )

    const gistId = response.data.id

    res.json({
      sandboxUrl: `https://stackblitz.com/edit/github-gist-${gistId}`
    })

  } catch (err) {

    console.error("Sandbox error:", err.response?.data || err.message)

    res.status(500).json({
      error: "Sandbox creation failed"
    })

  }

}
