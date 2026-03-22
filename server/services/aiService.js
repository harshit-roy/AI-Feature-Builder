const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

function sanitizeGeneratedCode(text) {
  let cleaned = text || ""

  cleaned = cleaned.replace(/```[a-z]*|```/gi, "").trim()
  cleaned = cleaned.replace(/^import .*$/gm, "")
  cleaned = cleaned.replace(/export\s+default\s+/g, "")
  cleaned = cleaned.replace(/export\s+/g, "")
  cleaned = cleaned.replace(/function\s+App\s*\([\s\S]*?\}\s*/g, "")
  cleaned = cleaned.replace(/const\s+App\s*=\s*\([\s\S]*?\}\s*;?/g, "")

  const componentStart = cleaned.indexOf("const GeneratedPage")
  if (componentStart !== -1) {
    cleaned = cleaned.slice(componentStart)
  }

  return cleaned.trim()
}

function isTodoLikePrompt(prompt) {
  const value = String(prompt || "").toLowerCase()
  return (
    value.includes("todo") ||
    value.includes("to-do") ||
    value.includes("task manager") ||
    value.includes("task app") ||
    value.includes("kanban")
  )
}

function buildTodoTemplate(prompt) {
  const title = /kanban/i.test(prompt) ? "Kanban Todo Board" : "Todo App"

  return `
const GeneratedPage = () => {
  const STORAGE_KEY = "afb_page_todo_app"

  const [todos, setTodos] = React.useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [newTodoText, setNewTodoText] = React.useState("")
  const [draggedItemId, setDraggedItemId] = React.useState(null)

  React.useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch {}
  }, [todos])

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!newTodoText.trim()) return

    const newTodo = {
      id: String(Date.now()),
      text: newTodoText.trim(),
      status: "todo"
    }

    setTodos((prev) => [...prev, newTodo])
    setNewTodoText("")
  }

  const handleDeleteTodo = (idToDelete) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== idToDelete))
  }

  const handleDragStart = (e, id) => {
    setDraggedItemId(id)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()

    if (!draggedItemId) return

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === draggedItemId ? { ...todo, status: newStatus } : todo
      )
    )

    setDraggedItemId(null)
  }

  const handleDragEnd = () => {
    setDraggedItemId(null)
  }

  const getTodosByStatus = (status) =>
    todos.filter((todo) => todo.status === status)

  const columnStatuses = [
    { key: "todo", title: "To Do", color: "#6d5df6" },
    { key: "in-progress", title: "In Progress", color: "#06b6d4" },
    { key: "done", title: "Done", color: "#22c55e" }
  ]

  return (
    <div className="generated-page-container">
      <style>{\`
        :root {
          --color-primary: #6d5df6;
          --color-primary-light: #8a7cff;
          --color-secondary: #06b6d4;
          --color-success: #22c55e;
          --color-background-light: #f4f7fb;
          --color-background-dark: #e8edf5;
          --color-text-dark: #1f2a44;
          --color-text-light: #64748b;
          --color-white: #ffffff;
          --color-border-light: #dbe3f0;
          --color-shadow-light: rgba(31, 42, 68, 0.08);
          --color-shadow-medium: rgba(31, 42, 68, 0.14);
          --color-danger: #ef4444;

          --radius-small: 8px;
          --radius-medium: 18px;
          --spacing-xs: 8px;
          --spacing-sm: 12px;
          --spacing-md: 20px;
          --spacing-lg: 32px;
          --spacing-xl: 48px;

          --font-family-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: var(--font-family-sans);
          line-height: 1.6;
          color: var(--color-text-dark);
          background: linear-gradient(180deg, #eef2fb 0%, #f8faff 100%);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .generated-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .header {
          width: 100%;
          background-color: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px);
          padding: var(--spacing-md) var(--spacing-lg);
          box-shadow: 0 2px 10px var(--color-shadow-light);
          text-align: center;
          border-bottom: 1px solid #e6ebf5;
        }

        .header h1 {
          font-size: 2.1em;
          color: var(--color-primary);
          font-weight: 800;
        }

        .header p {
          margin-top: 6px;
          color: var(--color-text-light);
          font-size: 0.98em;
        }

        .main-content {
          flex-grow: 1;
          width: 100%;
          max-width: 1400px;
          padding: var(--spacing-lg);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        @media (min-width: 768px) {
          .main-content {
            display: grid;
            grid-template-columns: 320px 1fr;
            gap: var(--spacing-xl);
          }
        }

        .add-todo-section {
          background-color: var(--color-white);
          padding: var(--spacing-md);
          border-radius: 24px;
          box-shadow: 0 16px 40px var(--color-shadow-light);
          border: 1px solid #e6ebf5;
          width: 100%;
        }

        @media (min-width: 768px) {
          .add-todo-section {
            grid-column: 1 / 2;
            align-self: flex-start;
            position: sticky;
            top: 24px;
          }
        }

        .add-todo-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .add-todo-form label {
          font-weight: 700;
          color: var(--color-text-dark);
          font-size: 1.05em;
          margin-bottom: 2px;
          display: block;
        }

        .helper-text {
          color: var(--color-text-light);
          font-size: 0.92em;
          margin-bottom: 10px;
        }

        .add-todo-form input[type="text"] {
          width: 100%;
          padding: 14px 16px;
          border: 1px solid var(--color-border-light);
          border-radius: 14px;
          font-size: 1em;
          transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          color: var(--color-text-dark);
          outline: none;
        }

        .add-todo-form input[type="text"]:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(109, 93, 246, 0.14);
        }

        .add-todo-form button {
          background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
          color: var(--color-white);
          border: none;
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 1em;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
          margin-top: 4px;
          box-shadow: 0 14px 28px rgba(109, 93, 246, 0.18);
        }

        .add-todo-form button:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .todo-columns-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          width: 100%;
        }

        @media (min-width: 768px) {
          .todo-columns-wrapper {
            grid-column: 2 / 3;
            flex-direction: row;
            align-items: flex-start;
            flex-wrap: wrap;
          }
        }

        @media (min-width: 1024px) {
          .todo-columns-wrapper {
            flex-wrap: nowrap;
          }
        }

        .todo-column {
          background-color: var(--color-background-dark);
          border-radius: 24px;
          padding: var(--spacing-md);
          box-shadow: 0 14px 34px rgba(31,42,68,0.06);
          min-height: 220px;
          flex: 1;
          display: flex;
          flex-direction: column;
          border: 1px solid #e6ebf5;
          transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          min-width: 280px;
        }

        .todo-column.drag-over {
          border-color: var(--color-primary);
          background-color: #f8faff;
          box-shadow: 0 0 0 4px rgba(109, 93, 246, 0.14), 0 10px 30px rgba(31,42,68,0.10);
        }

        .column-header {
          display: flex;
          align-items: center;
          margin-bottom: var(--spacing-md);
          padding-bottom: var(--spacing-xs);
          border-bottom: 1px solid #dbe3f0;
        }

        .column-header h2 {
          font-size: 1.25em;
          font-weight: 800;
          margin-right: var(--spacing-sm);
        }

        .column-header h2.todo-color { color: var(--color-primary); }
        .column-header h2.in-progress-color { color: var(--color-secondary); }
        .column-header h2.done-color { color: var(--color-success); }

        .todo-count {
          color: var(--color-white);
          font-size: 0.9em;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 999px;
          min-width: 32px;
          text-align: center;
        }

        .todo-column[data-status="todo"] .todo-count { background-color: var(--color-primary); }
        .todo-column[data-status="in-progress"] .todo-count { background-color: var(--color-secondary); }
        .todo-column[data-status="done"] .todo-count { background-color: var(--color-success); }

        .todo-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          flex-grow: 1;
        }

        .empty-column-message {
          color: var(--color-text-light);
          font-size: 0.92em;
          text-align: center;
          padding: var(--spacing-md) 0;
          background-color: rgba(255,255,255,0.65);
          border-radius: 14px;
          border: 1px dashed #d7deee;
          margin: var(--spacing-sm) 0;
        }

        .todo-item {
          background-color: var(--color-white);
          padding: 14px 16px;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(31,42,68,0.06);
          cursor: grab;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: transform 0.1s ease-in-out, box-shadow 0.1s ease-in-out, opacity 0.1s ease-in-out;
          border: 1px solid #e6ebf5;
        }

        .todo-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 24px rgba(31,42,68,0.10);
        }

        .todo-item.dragging {
          opacity: 0.65;
          box-shadow: 0 12px 28px rgba(31,42,68,0.14);
          transform: scale(1.02);
        }

        .todo-item-text {
          flex-grow: 1;
          font-size: 0.98em;
          color: var(--color-text-dark);
          word-break: break-word;
          padding-right: var(--spacing-xs);
        }

        .delete-button {
          background: none;
          border: none;
          color: var(--color-danger);
          font-size: 1.1em;
          cursor: pointer;
          margin-left: var(--spacing-sm);
          opacity: 0.75;
          transition: opacity 0.2s ease-in-out, transform 0.2s ease-in-out;
          padding: 0 4px;
        }

        .delete-button:hover {
          opacity: 1;
          transform: scale(1.08);
        }

        .footer {
          width: 100%;
          padding: var(--spacing-md);
          background-color: #1f2a44;
          color: var(--color-white);
          text-align: center;
          margin-top: var(--spacing-xl);
          font-size: 0.9em;
        }

        .footer p {
          margin: 0;
        }

        @media (max-width: 767px) {
          .main-content {
            padding: 18px;
          }

          .header h1 {
            font-size: 1.8em;
          }
        }
      \`}</style>

      <header className="header">
        <h1>${title}</h1>
        <p>Add, move, and remove tasks. Your tasks stay saved after refresh and reopen.</p>
      </header>

      <div className="main-content">
        <div className="add-todo-section">
          <form onSubmit={handleAddTodo} className="add-todo-form">
            <label htmlFor="new-todo-input">Add New Task</label>
            <p className="helper-text">
              Use this board to manage your tasks across To Do, In Progress, and Done.
            </p>
            <input
              id="new-todo-input"
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="e.g., Prepare sprint planning notes"
              aria-label="New task description"
            />
            <button type="submit">Add Task</button>
          </form>
        </div>

        <div className="todo-columns-wrapper">
          {columnStatuses.map((column) => (
            <div
              key={column.key}
              className="todo-column"
              data-status={column.key}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.key)}
              onDragEnter={(e) => e.currentTarget.classList.add("drag-over")}
              onDragLeave={(e) => e.currentTarget.classList.remove("drag-over")}
            >
              <div className="column-header">
                <h2 className={\`\${column.key}-color\`}>{column.title}</h2>
                <span className="todo-count">
                  {getTodosByStatus(column.key).length}
                </span>
              </div>

              <div className="todo-list">
                {getTodosByStatus(column.key).length === 0 && (
                  <p className="empty-column-message">
                    No tasks here yet.
                  </p>
                )}

                {getTodosByStatus(column.key).map((todo) => (
                  <div
                    key={todo.id}
                    className={\`todo-item \${todo.id === draggedItemId ? "dragging" : ""}\`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                    onDragEnd={handleDragEnd}
                    aria-grabbed={todo.id === draggedItemId ? "true" : "false"}
                    tabIndex="0"
                  >
                    <span className="todo-item-text">{todo.text}</span>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label={\`Delete task: \${todo.text}\`}
                      title={\`Delete task: \${todo.text}\`}
                    >
                      &#x2715;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} ${title}. All rights reserved.</p>
      </footer>
    </div>
  )
}
  `.trim()
}

async function generateReactPage(prompt) {
  try {
    const safePrompt = String(prompt || "").trim()

    if (isTodoLikePrompt(safePrompt)) {
      return buildTodoTemplate(safePrompt)
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const fullPrompt = `
You are a senior frontend engineer, product designer, and UI/UX specialist.

Your task is to generate a complete, polished, responsive React webpage or mini-application as a single functional component.

STRICT OUTPUT RULES:

1. Create ONLY one component named GeneratedPage.
2. Do NOT create any other components.
3. Do NOT write any import statements.
4. Do NOT write any export statements.
5. Do NOT create an App component.
6. Output must be valid JSX that compiles in a React environment.
7. All UI and logic must be contained inside the GeneratedPage component.
8. The component must return a single root <div>.
9. Return ONLY React code.
10. Do NOT include markdown fences.
11. Do NOT include explanations, notes, or prose outside the code.
12. Do NOT use TypeScript.
13. Do NOT use JSX comments in the output.
14. The code must be directly usable in a runtime that already has React available.

REACT RULES:

1. If state is needed, use React.useState.
2. If effects are needed, use React.useEffect.
3. Do NOT assume external libraries are available.
4. Use only standard React and browser APIs.
5. Code must not crash if rendered directly.
6. Avoid complex unsupported APIs.
7. Do NOT use dangerouslySetInnerHTML.
8. Do NOT fetch external APIs, external images, or remote assets.
9. Keep all data self-contained inside the component.
10. Do NOT depend on router, context, npm packages, or environment variables.
11. Prefer clear helper functions inside the component when needed.

STYLING RULES:

1. DO NOT use Tailwind CSS.
2. DO NOT use external CSS files.
3. Use inline styles and/or a <style>{\`...\`}</style> block inside the component.
4. Create a premium modern UI using:
   - clean spacing
   - visual hierarchy
   - rounded corners
   - soft shadows
   - responsive layout
   - strong typography
   - accessible contrast
5. The page must be fully responsive for mobile, tablet, and desktop.
6. Use a professional color palette.
7. Avoid ugly default browser styling.
8. Make the design feel complete and visually balanced.

PAGE QUALITY RULES:

1. Generate a FULL webpage or mini-application, not a tiny widget or incomplete fragment.
2. The output should feel like a real usable page, not a demo fragment.
3. Include enough sections/content to make the page feel complete.
4. If the user request is vague, infer a sensible complete structure while staying aligned with the request.
5. Prefer realistic UI copy and labels over placeholder lorem ipsum.
6. The page should look portfolio-quality and production-inspired.

FUNCTIONALITY RULES:

1. If the requested page needs interaction, implement it properly.
2. Buttons, forms, inputs, tabs, toggles, filters, counters, calculators, modals, and lists must work correctly if relevant.
3. Forms should manage state correctly.
4. Validation should be basic but sensible where relevant.
5. Interactive features must feel functional, not fake.
6. If the request is mainly informational, still make the page visually rich and structured.
7. If the request includes user-created data such as tasks, notes, lists, trackers, preferences, drafts, entries, bookmarks, or editable items, you MUST persist that data using localStorage.
8. Do NOT use sessionStorage.
9. Never seed fake default demo items for persisted apps unless the user explicitly asks for sample data.

PERSISTENCE RULES (MANDATORY FOR TODO / NOTES / TRACKERS / CHECKLISTS / APP-LIKE PAGES):

1. Define a storage key starting with "afb_page_".
2. Restore state from localStorage using React.useState lazy initialization.
3. Save state to localStorage using React.useEffect.
4. Wrap JSON parsing in try/catch.
5. Never skip persistence for app-like requests.
6. Avoid native form submission navigation. Use e.preventDefault().

Feature to build:
${safePrompt}

Generate a polished, responsive, functional webpage or mini-application.
Return ONLY valid React code.
`

    const result = await model.generateContent(fullPrompt)
    const response = await result.response
    const text = response.text()

    const cleaned = sanitizeGeneratedCode(text)

    if (!cleaned.includes("const GeneratedPage")) {
      throw new Error("Generated code missing GeneratedPage component")
    }

    return cleaned
  } catch (err) {
    console.error("Gemini error:", err)
    throw new Error("AI generation failed")
  }
}

module.exports = generateReactPage