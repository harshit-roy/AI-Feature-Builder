const parser = require("@babel/parser")

function validateReactCode(code) {
  const result = {
    success: false,
    syntaxValid: false,
    jsxValid: false,
    componentFound: false,
    importsValid: true,
    exportsValid: true,
    errors: [],
    warnings: []
  }

  if (!code || typeof code !== "string") {
    result.errors.push("Generated code is empty")
    return result
  }

  try {
    parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx"]
    })

    result.syntaxValid = true
    result.jsxValid = true
  } catch (err) {
    result.errors.push(`Syntax Error: ${err.message}`)
  }

  const hasGeneratedPage =
    code.includes("const GeneratedPage") ||
    code.includes("function GeneratedPage")

  if (hasGeneratedPage) {
    result.componentFound = true
  } else {
    result.errors.push("GeneratedPage component not found")
  }

  const imports = code.match(/^import\s.+$/gm) || []

  if (imports.length > 0) {
    result.importsValid = false

    result.warnings.push(
      `${imports.length} import statement(s) detected`
    )
  }

  const exports = code.match(/^export\s.+$/gm) || []

  if (exports.length > 0) {
    result.exportsValid = false

    result.warnings.push(
      `${exports.length} export statement(s) detected`
    )
  }

  result.success =
    result.syntaxValid &&
    result.jsxValid &&
    result.componentFound

  return result
}

module.exports = {
  validateReactCode
}