const esbuild = require("esbuild")

async function compileReactCode(code) {

  console.log("================================")
  console.log("COMPILER CALLED")
  console.log(code.substring(0, 200))
  console.log("================================")

  const wrappedCode = `
${code}

window.GeneratedPage = GeneratedPage;
`

  const result = await esbuild.transform(
    wrappedCode,
    {
      loader: "jsx",
      format: "iife",
      target: "es2020",
      jsx: "transform",
      minify: false
    }
  )

  console.log("OUTPUT LENGTH:", result.code.length)

  return result.code
}

module.exports = {
  compileReactCode
}