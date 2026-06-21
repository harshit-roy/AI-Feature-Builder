import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/axios"

export default function GeneratedPage() {
  const { slug } = useParams()

  const [compiledCode, setCompiledCode] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true)
        setError("")

        const res = await api.get(
          `/features/page/${slug}`
        )

        if (!res.data.compiledCode) {
          setError(
            "Compiled deployment not found."
          )
          return
        }

        setCompiledCode(
          res.data.compiledCode
        )
      } catch (err) {
        console.error(
          "Live page fetch error:",
          err
        )

        setError("Page not found")
      } finally {
        setLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  const iframeContent = useMemo(() => {
    if (!compiledCode) return ""

    const encodedCompiledCode =
      JSON.stringify(compiledCode)

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<script
  crossorigin
  src="https://unpkg.com/react@18/umd/react.development.js">
</script>

<script
  crossorigin
  src="https://unpkg.com/react-dom@18/umd/react-dom.development.js">
</script>

<style>
html,
body,
#root{
  margin:0;
  padding:0;
  width:100%;
  min-height:100%;
}

body{
  background:white;
}
</style>
</head>

<body>

<div id="root"></div>

<script>
window.__AFB_COMPILED_CODE__ =
${encodedCompiledCode};
</script>

<script>

class RuntimeErrorBoundary
extends React.Component {

  constructor(props){
    super(props)

    this.state = {
      hasError:false
    }
  }

  static getDerivedStateFromError(){
    return {
      hasError:true
    }
  }

  componentDidCatch(error){
    console.error(
      "Runtime Error:",
      error
    )
  }

  render(){

    if(this.state.hasError){

      return React.createElement(
        "div",
        {
          style:{
            minHeight:"100vh",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            fontFamily:"sans-serif"
          }
        },
        React.createElement(
          "h2",
          null,
          "Generated page crashed"
        )
      )
    }

    return this.props.children
  }
}

try {

  eval(
    window.__AFB_COMPILED_CODE__
  )

  if(
    typeof window.GeneratedPage !==
    "function"
  ){
    throw new Error(
      "GeneratedPage component not found"
    )
  }

  const root =
    ReactDOM.createRoot(
      document.getElementById("root")
    )

  root.render(
    React.createElement(
      RuntimeErrorBoundary,
      null,
      React.createElement(
        window.GeneratedPage
      )
    )
  )

}
catch(error){

  console.error(
    "Bootstrap Error:",
    error
  )

  document.getElementById(
    "root"
  ).innerHTML = \`
    <div
      style="
        min-height:100vh;
        display:flex;
        align-items:center;
        justify-content:center;
        font-family:sans-serif;
        padding:24px;
      "
    >
      <div>
        <h2>
          Deployment Failed
        </h2>

        <pre
          style="
            white-space:pre-wrap;
            max-width:900px;
          "
        >\${error}</pre>
      </div>
    </div>
  \`
}

</script>

</body>
</html>
`
  }, [compiledCode])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading deployment...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {error}
      </div>
    )
  }

  return (
    <iframe
      title="generated-live-page"
      srcDoc={iframeContent}
      className="w-full min-h-screen border-0"
      sandbox="
        allow-scripts
        allow-same-origin
        allow-forms
      "
    />
  )
}