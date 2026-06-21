function detectTemplate(prompt) {
  const value = String(prompt || "")
    .toLowerCase()
    .trim()

  // games
  if (value.includes("chess")) {
    return "chess"
  }

  if (value.includes("ludo")) {
    return "ludo"
  }

  if (
    value.includes("tic tac toe") ||
    value.includes("tic-tac-toe")
  ) {
    return "tic-tac-toe"
  }

  if (value.includes("snake game")) {
    return "snake"
  }

  if (value.includes("2048")) {
    return "2048"
  }

  // productivity
  if (
    value.includes("todo") ||
    value.includes("task manager")
  ) {
    return "todo"
  }

  if (
    value.includes("notes") ||
    value.includes("note taking")
  ) {
    return "notes"
  }

  if (
    value.includes("expense tracker") ||
    value.includes("budget tracker")
  ) {
    return "expense-tracker"
  }

  if (
    value.includes("kanban")
  ) {
    return "kanban"
  }

  // dashboards
  if (
    value.includes("admin dashboard")
  ) {
    return "admin-dashboard"
  }

  if (
    value.includes("crm")
  ) {
    return "crm-dashboard"
  }

  // tools
  if (
    value.includes("text compare") ||
    value.includes("text comparison")
  ) {
    return "text-compare"
  }

  if (
    value.includes("password generator")
  ) {
    return "password-generator"
  }

  if (
    value.includes("calculator")
  ) {
    return "calculator"
  }

  return null
}

function hasTemplate(prompt) {
  return detectTemplate(prompt) !== null
}

module.exports = {
  detectTemplate,
  hasTemplate
}