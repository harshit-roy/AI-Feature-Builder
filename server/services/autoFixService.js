function autoFixCode(code) {
  let fixed = String(code || "")

  /*
   * Remove imports
   */
  fixed = fixed.replace(
    /^import\s.+$/gm,
    ""
  )

  /*
   * Remove exports
   */
  fixed = fixed.replace(
    /^export\s.+$/gm,
    ""
  )

  /*
   * Common AI spread mistakes
   */

  fixed = fixed.replace(
    /setTodos\(\(prev\)\s*=>\s*\[\.prev,/g,
    "setTodos((prev) => [...prev,"
  )

  fixed = fixed.replace(
    /\{\s*\.([a-zA-Z0-9_]+)\s*,/g,
    "{ ...$1,"
  )

  /*
   * Escape script tags
   */

  fixed = fixed.replace(
    /<\/script>/gi,
    "<\\/script>"
  )

  /*
   * Remove markdown fences
   */

  fixed = fixed.replace(
    /```[a-z]*|```/gi,
    ""
  )

  /*
   * Remove accidental App wrapper
   */

  fixed = fixed.replace(
    /^function\s+App\s*\([\s\S]*?\}\s*$/gm,
    ""
  )

  fixed = fixed.replace(
    /^const\s+App\s*=\s*\([\s\S]*?\}\s*;?$/gm,
    ""
  )

  /*
   * Remove duplicate blank lines
   */

  fixed = fixed.replace(
    /\n{3,}/g,
    "\n\n"
  )

  return fixed.trim()
}

module.exports = {
  autoFixCode
}