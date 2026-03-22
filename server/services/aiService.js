const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/* -----------------------------
   CLEAN AI OUTPUT
----------------------------- */
function sanitizeGeneratedCode(text) {
  let cleaned = text || ""

  cleaned = cleaned.replace(/```[a-z]*|```/gi, "").trim()
  cleaned = cleaned.replace(/^import .*$/gm, "")
  cleaned = cleaned.replace(/export\s+default\s+/g, "")
  cleaned = cleaned.replace(/export\s+/g, "")
  cleaned = cleaned.replace(/function\s+App\s*\([\s\S]*?\}\s*/g, "")
  cleaned = cleaned.replace(/const\s+App\s*=\s*\([\s\S]*?\}\s*;?/g, "")

  const generatedConstStart = cleaned.indexOf("const GeneratedPage")
  const generatedFnStart = cleaned.indexOf("function GeneratedPage")

  if (generatedConstStart !== -1) {
    cleaned = cleaned.slice(generatedConstStart)
  } else if (generatedFnStart !== -1) {
    cleaned = cleaned.slice(generatedFnStart)
  }

  return cleaned.trim()
}

/* -----------------------------
   VALIDATION
----------------------------- */
function isValidGeneratedCode(code) {
  return (
    !!code &&
    typeof code === "string" &&
    code.includes("GeneratedPage") &&
    code.includes("return") &&
    !code.includes("export default function App")
  )
}

/* -----------------------------
   PROMPT TYPE CHECKS
----------------------------- */
function normalizePrompt(prompt) {
  return String(prompt || "").trim()
}

function lowerPrompt(prompt) {
  return normalizePrompt(prompt).toLowerCase()
}

function isTodoLikePrompt(prompt) {
  const value = lowerPrompt(prompt)
  return (
    value.includes("todo") ||
    value.includes("to-do") ||
    value.includes("task manager") ||
    value.includes("task app") ||
    value.includes("kanban") ||
    value.includes("checklist")
  )
}

function isNotesLikePrompt(prompt) {
  const value = lowerPrompt(prompt)
  return (
    value.includes("notes") ||
    value.includes("note taking") ||
    value.includes("journal") ||
    value.includes("memo")
  )
}

function isTrackerLikePrompt(prompt) {
  const value = lowerPrompt(prompt)
  return (
    value.includes("tracker") ||
    value.includes("habit") ||
    value.includes("expense") ||
    value.includes("budget") ||
    value.includes("planner")
  )
}

function isGameLikePrompt(prompt) {
  const value = lowerPrompt(prompt)
  return (
    value.includes("game") ||
    value.includes("chess") ||
    value.includes("sudoku") ||
    value.includes("tic tac toe") ||
    value.includes("tic-tac-toe") ||
    value.includes("puzzle") ||
    value.includes("board game") ||
    value.includes("quiz") ||
    value.includes("memory game") ||
    value.includes("snake") ||
    value.includes("2048") ||
    value.includes("minesweeper")
  )
}

function isToolLikePrompt(prompt) {
  const value = lowerPrompt(prompt)
  return (
    value.includes("calculator") ||
    value.includes("converter") ||
    value.includes("dashboard") ||
    value.includes("form") ||
    value.includes("editor") ||
    value.includes("builder") ||
    value.includes("planner") ||
    value.includes("tracker") ||
    value.includes("generator") ||
    value.includes("management") ||
    value.includes("admin")
  )
}

function classifyPrompt(prompt) {
  if (isTodoLikePrompt(prompt)) return "todo"
  if (isNotesLikePrompt(prompt)) return "notes"
  if (isTrackerLikePrompt(prompt)) return "tracker"
  if (isGameLikePrompt(prompt)) return "game"
  if (isToolLikePrompt(prompt)) return "tool"
  return "page"
}

/* -----------------------------
   HELPERS
----------------------------- */
function escapeForTemplateLiteral(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${")
}

function buildStorageBridgeHelpers(storageKey, defaultDataExpression) {
  return `
  const STORAGE_KEY = "${storageKey}"

  const readStoredData = () => {
    try {
      if (window.afbStorage && typeof window.afbStorage.getItem === "function") {
        const saved = window.afbStorage.getItem(STORAGE_KEY)
        return saved ? JSON.parse(saved) : ${defaultDataExpression}
      }

      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : ${defaultDataExpression}
    } catch {
      return ${defaultDataExpression}
    }
  }

  const writeStoredData = (value) => {
    try {
      const serialized = JSON.stringify(value)

      if (window.afbStorage && typeof window.afbStorage.setItem === "function") {
        window.afbStorage.setItem(STORAGE_KEY, serialized)
        return
      }

      localStorage.setItem(STORAGE_KEY, serialized)
    } catch {}
  }
`
}

/* -----------------------------
   TODO TEMPLATE
----------------------------- */
function buildTodoTemplate(prompt) {
  const title = /kanban/i.test(prompt) ? "Kanban Todo Board" : "Todo App"

  return `
const GeneratedPage = () => {
${buildStorageBridgeHelpers("afb_page_todo_app", "[]")}

  const [todos, setTodos] = React.useState(() => readStoredData())
  const [newTodoText, setNewTodoText] = React.useState("")
  const [draggedItemId, setDraggedItemId] = React.useState(null)

  React.useEffect(() => {
    writeStoredData(todos)
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
    { key: "todo", title: "To Do" },
    { key: "in-progress", title: "In Progress" },
    { key: "done", title: "Done" }
  ]

  return (
    <div className="generated-page-container">
      <style>{\`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          background: linear-gradient(180deg, #eef2fb 0%, #f8faff 100%);
          color: #1f2a44;
        }
        .generated-page-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          padding: 24px 20px;
          background: rgba(255,255,255,0.85);
          border-bottom: 1px solid #e6ebf5;
          text-align: center;
          backdrop-filter: blur(10px);
        }
        .header h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 800;
          color: #6d5df6;
        }
        .header p {
          margin: 8px 0 0;
          color: #64748b;
        }
        .main-content {
          flex: 1;
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 28px 20px;
          display: grid;
          gap: 24px;
        }
        @media (min-width: 900px) {
          .main-content {
            grid-template-columns: 320px 1fr;
          }
        }
        .panel, .column {
          background: #ffffff;
          border: 1px solid #e6ebf5;
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(31,42,68,0.07);
        }
        .panel {
          padding: 20px;
          align-self: start;
        }
        @media (min-width: 900px) {
          .panel {
            position: sticky;
            top: 24px;
          }
        }
        .panel h2 {
          margin: 0 0 8px;
          font-size: 1.1rem;
        }
        .helper {
          margin: 0 0 16px;
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.7;
        }
        .panel form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .panel input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          border: 1px solid #dbe3f0;
          outline: none;
          font-size: 1rem;
        }
        .panel input:focus {
          border-color: #6d5df6;
          box-shadow: 0 0 0 3px rgba(109,93,246,0.12);
        }
        .panel button {
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          background: linear-gradient(90deg, #6d5df6 0%, #8a7cff 100%);
          color: white;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 14px 28px rgba(109,93,246,0.18);
        }
        .board {
          display: grid;
          gap: 18px;
        }
        @media (min-width: 900px) {
          .board {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        .column {
          padding: 18px;
          background: #f9fbff;
        }
        .column-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .column-header h3 {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 800;
        }
        .count {
          min-width: 32px;
          text-align: center;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 0.85rem;
          font-weight: 700;
          color: white;
          background: #6d5df6;
        }
        .list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-height: 120px;
        }
        .empty {
          text-align: center;
          color: #64748b;
          padding: 16px;
          border: 1px dashed #d7deee;
          border-radius: 14px;
          background: rgba(255,255,255,0.7);
          font-size: 0.92rem;
        }
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid #e6ebf5;
          background: #ffffff;
          box-shadow: 0 8px 20px rgba(31,42,68,0.06);
          cursor: grab;
        }
        .todo-item-text {
          flex: 1;
          word-break: break-word;
        }
        .delete-button {
          border: none;
          background: transparent;
          color: #ef4444;
          cursor: pointer;
          font-size: 1.05rem;
          font-weight: 700;
        }
        .footer {
          padding: 18px;
          text-align: center;
          background: #1f2a44;
          color: white;
          font-size: 0.92rem;
          margin-top: 24px;
        }
      \`}</style>

      <header className="header">
        <h1>${escapeForTemplateLiteral(title)}</h1>
        <p>Add, move, and remove tasks. Your tasks stay saved after refresh and reopen.</p>
      </header>

      <div className="main-content">
        <div className="panel">
          <h2>Add New Task</h2>
          <p className="helper">
            Create and manage tasks across To Do, In Progress, and Done.
          </p>

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="e.g., Prepare sprint planning notes"
              aria-label="New task description"
            />
            <button type="submit">Add Task</button>
          </form>
        </div>

        <div className="board">
          {columnStatuses.map((column) => (
            <div
              key={column.key}
              className="column"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.key)}
            >
              <div className="column-header">
                <h3>{column.title}</h3>
                <span className="count">{getTodosByStatus(column.key).length}</span>
              </div>

              <div className="list">
                {getTodosByStatus(column.key).length === 0 && (
                  <div className="empty">No tasks here yet.</div>
                )}

                {getTodosByStatus(column.key).map((todo) => (
                  <div
                    key={todo.id}
                    className="todo-item"
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, todo.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <span className="todo-item-text">{todo.text}</span>
                    <button
                      className="delete-button"
                      type="button"
                      onClick={() => handleDeleteTodo(todo.id)}
                      aria-label={\`Delete task: \${todo.text}\`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">
        <p>Saved automatically for your next session.</p>
      </footer>
    </div>
  )
}
  `.trim()
}

/* -----------------------------
   NOTES TEMPLATE
----------------------------- */
function buildNotesTemplate() {
  return `
const GeneratedPage = () => {
${buildStorageBridgeHelpers("afb_page_notes_workspace", "{ notes: [] }")}

  const [state, setState] = React.useState(() => readStoredData())
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")

  const notes = Array.isArray(state?.notes) ? state.notes : []

  React.useEffect(() => {
    writeStoredData({ notes })
  }, [notes])

  const addNote = (e) => {
    e.preventDefault()
    if (!title.trim() && !content.trim()) return

    const newNote = {
      id: String(Date.now()),
      title: title.trim() || "Untitled note",
      content: content.trim(),
      createdAt: new Date().toLocaleString()
    }

    setState({ notes: [newNote, ...notes] })
    setTitle("")
    setContent("")
  }

  const deleteNote = (id) => {
    setState({ notes: notes.filter((note) => note.id !== id) })
  }

  return (
    <div className="notes-page">
      <style>{\`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
          background: linear-gradient(180deg, #eef2fb 0%, #f8faff 100%);
          color: #1f2a44;
        }
        .notes-page { min-height: 100vh; }
        .hero {
          padding: 28px 20px;
          text-align: center;
          background: rgba(255,255,255,0.82);
          border-bottom: 1px solid #e6ebf5;
          backdrop-filter: blur(10px);
        }
        .hero h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 800;
          color: #6d5df6;
        }
        .hero p {
          margin: 8px auto 0;
          max-width: 720px;
          color: #64748b;
          line-height: 1.7;
        }
        .wrap {
          max-width: 1280px;
          margin: 0 auto;
          padding: 28px 20px;
          display: grid;
          gap: 24px;
        }
        @media (min-width: 900px) {
          .wrap {
            grid-template-columns: 360px 1fr;
          }
        }
        .composer, .notes-grid {
          background: #ffffff;
          border: 1px solid #e6ebf5;
          border-radius: 24px;
          box-shadow: 0 18px 40px rgba(31,42,68,0.07);
        }
        .composer {
          padding: 20px;
          align-self: start;
        }
        .composer h2 {
          margin: 0 0 10px;
          font-size: 1.1rem;
        }
        .composer p {
          margin: 0 0 16px;
          color: #64748b;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        .composer form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .composer input,
        .composer textarea {
          width: 100%;
          border: 1px solid #dbe3f0;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 1rem;
          outline: none;
        }
        .composer textarea {
          min-height: 180px;
          resize: vertical;
        }
        .composer input:focus,
        .composer textarea:focus {
          border-color: #6d5df6;
          box-shadow: 0 0 0 3px rgba(109,93,246,0.12);
        }
        .composer button {
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          background: linear-gradient(90deg, #6d5df6 0%, #8a7cff 100%);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
        .notes-grid {
          padding: 20px;
          background: #f9fbff;
        }
        .notes-grid h2 {
          margin: 0 0 16px;
          font-size: 1.2rem;
        }
        .grid {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        }
        .note-card {
          background: white;
          border: 1px solid #e6ebf5;
          border-radius: 18px;
          padding: 16px;
          box-shadow: 0 10px 24px rgba(31,42,68,0.06);
        }
        .note-card h3 {
          margin: 0 0 8px;
          font-size: 1rem;
        }
        .meta {
          color: #94a3b8;
          font-size: 0.8rem;
          margin-bottom: 10px;
        }
        .body {
          color: #475569;
          line-height: 1.7;
          white-space: pre-wrap;
          word-break: break-word;
        }
        .empty {
          text-align: center;
          padding: 24px;
          color: #64748b;
          border: 1px dashed #d7deee;
          border-radius: 16px;
          background: rgba(255,255,255,0.7);
        }
        .row {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }
        .delete-btn {
          border: none;
          background: #fee2e2;
          color: #b91c1c;
          border-radius: 12px;
          padding: 10px 12px;
          cursor: pointer;
          font-weight: 700;
        }
      \`}</style>

      <div className="hero">
        <h1>Notes Workspace</h1>
        <p>Capture ideas, keep drafts, and return to your notes anytime with saved progress.</p>
      </div>

      <div className="wrap">
        <div className="composer">
          <h2>Create a note</h2>
          <p>Write a title and note content below. Your notes are saved automatically.</p>

          <form onSubmit={addNote}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note here..."
            />
            <button type="submit">Save Note</button>
          </form>
        </div>

        <div className="notes-grid">
          <h2>Your notes</h2>

          {notes.length === 0 ? (
            <div className="empty">No notes yet. Create your first note from the panel.</div>
          ) : (
            <div className="grid">
              {notes.map((note) => (
                <div className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <div className="meta">{note.createdAt}</div>
                  <div className="body">{note.content || "No content"}</div>
                  <div className="row">
                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
  `.trim()
}

/* -----------------------------
   TRACKER TEMPLATE
----------------------------- */
function buildTrackerTemplate() {
  return `
const GeneratedPage = () => {
${buildStorageBridgeHelpers("afb_page_tracker", "{ items: [] }")}

  const [state, setState] = React.useState(() => readStoredData())
  const [label, setLabel] = React.useState("")

  const items = Array.isArray(state?.items) ? state.items : []

  React.useEffect(() => {
    writeStoredData({ items })
  }, [items])

  const addItem = (e) => {
    e.preventDefault()
    if (!label.trim()) return

    const newItem = {
      id: String(Date.now()),
      label: label.trim(),
      done: false
    }

    setState({ items: [...items, newItem] })
    setLabel("")
  }

  const toggleItem = (id) => {
    setState({
      items: items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    })
  }

  const clearCompleted = () => {
    setState({ items: items.filter((item) => !item.done) })
  }

  const completedCount = items.filter((item) => item.done).length

  return (
    <div className="tracker-page">
      <style>{\`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
          background: linear-gradient(180deg, #eef2fb 0%, #f8faff 100%);
          color: #1f2a44;
        }
        .tracker-page {
          min-height: 100vh;
          padding: 24px;
        }
        .shell {
          max-width: 980px;
          margin: 0 auto;
        }
        .hero {
          background: linear-gradient(135deg, #6d5df6 0%, #8a7cff 100%);
          color: white;
          border-radius: 28px;
          padding: 28px;
          box-shadow: 0 22px 50px rgba(109,93,246,0.25);
        }
        .hero h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 800;
        }
        .hero p {
          margin: 10px 0 0;
          color: rgba(255,255,255,0.85);
          line-height: 1.7;
        }
        .grid {
          display: grid;
          gap: 20px;
          margin-top: 24px;
        }
        @media (min-width: 900px) {
          .grid {
            grid-template-columns: 320px 1fr;
          }
        }
        .card {
          background: white;
          border-radius: 24px;
          border: 1px solid #e6ebf5;
          box-shadow: 0 18px 40px rgba(31,42,68,0.07);
          padding: 20px;
        }
        .card h2 {
          margin: 0 0 10px;
          font-size: 1.15rem;
        }
        .helper {
          margin: 0 0 14px;
          color: #64748b;
          line-height: 1.7;
          font-size: 0.95rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        input {
          width: 100%;
          border: 1px solid #dbe3f0;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 1rem;
          outline: none;
        }
        input:focus {
          border-color: #6d5df6;
          box-shadow: 0 0 0 3px rgba(109,93,246,0.12);
        }
        button.primary {
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          background: linear-gradient(90deg, #6d5df6 0%, #8a7cff 100%);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }
        .stat {
          background: #f9fbff;
          border: 1px solid #e6ebf5;
          border-radius: 18px;
          padding: 16px;
          text-align: center;
        }
        .stat strong {
          display: block;
          font-size: 1.5rem;
        }
        .stat span {
          color: #64748b;
          font-size: 0.9rem;
        }
        .list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 16px;
          border: 1px solid #e6ebf5;
          background: #ffffff;
        }
        .item-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }
        .item-text {
          word-break: break-word;
        }
        .item-text.done {
          text-decoration: line-through;
          color: #94a3b8;
        }
        .empty {
          text-align: center;
          padding: 24px;
          color: #64748b;
          border: 1px dashed #d7deee;
          border-radius: 16px;
          background: rgba(255,255,255,0.7);
        }
        .toolbar {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
        }
        .clear-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 12px;
          background: #fee2e2;
          color: #b91c1c;
          font-weight: 700;
          cursor: pointer;
        }
      \`}</style>

      <div className="shell">
        <div className="hero">
          <h1>Progress Tracker</h1>
          <p>Track goals, habits, or checklist progress. Your progress is saved automatically.</p>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Add an item</h2>
            <p className="helper">Create a trackable item and manage it from your dashboard.</p>

            <form onSubmit={addItem}>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g., Complete design review"
              />
              <button className="primary" type="submit">Add Item</button>
            </form>
          </div>

          <div className="card">
            <div className="stats">
              <div className="stat">
                <strong>{items.length}</strong>
                <span>Total</span>
              </div>
              <div className="stat">
                <strong>{completedCount}</strong>
                <span>Done</span>
              </div>
              <div className="stat">
                <strong>{items.length - completedCount}</strong>
                <span>Remaining</span>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="empty">No items yet. Add one to start tracking progress.</div>
            ) : (
              <>
                <div className="list">
                  {items.map((item) => (
                    <div className="item" key={item.id}>
                      <div className="item-left">
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={() => toggleItem(item.id)}
                        />
                        <span className={\`item-text \${item.done ? "done" : ""}\`}>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="toolbar">
                  <button className="clear-btn" type="button" onClick={clearCompleted}>
                    Clear Completed
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
  `.trim()
}

/* -----------------------------
   GENERIC FALLBACK
----------------------------- */
function buildFallbackPage(prompt) {
  const safePrompt = escapeForTemplateLiteral(prompt || "Generated experience")

  return `
const GeneratedPage = () => {
${buildStorageBridgeHelpers("afb_page_generic_fallback", "{ notes: {}, inputs: {} }")}

  const [state, setState] = React.useState(() => readStoredData())

  React.useEffect(() => {
    writeStoredData(state)
  }, [state])

  const title = "${safePrompt}".length > 64 ? "${safePrompt}".slice(0, 64) + "..." : "${safePrompt}"

  return (
    <div className="fallback-page">
      <style>{\`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
          background: linear-gradient(180deg, #eef2fb 0%, #f8faff 100%);
          color: #1f2a44;
        }
        .fallback-page {
          min-height: 100vh;
          padding: 24px;
        }
        .shell {
          max-width: 1180px;
          margin: 0 auto;
        }
        .hero {
          border-radius: 30px;
          padding: 30px;
          background: linear-gradient(135deg, #6d5df6 0%, #8a7cff 55%, #f472b6 100%);
          color: white;
          box-shadow: 0 24px 60px rgba(109,93,246,0.24);
        }
        .badge {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .hero h1 {
          margin: 16px 0 0;
          font-size: 2.2rem;
          line-height: 1.15;
          font-weight: 800;
        }
        .hero p {
          margin: 12px 0 0;
          max-width: 760px;
          line-height: 1.8;
          color: rgba(255,255,255,0.88);
        }
        .grid {
          display: grid;
          gap: 20px;
          margin-top: 24px;
        }
        @media (min-width: 920px) {
          .grid {
            grid-template-columns: 1.1fr 0.9fr;
          }
        }
        .card {
          background: white;
          border: 1px solid #e6ebf5;
          border-radius: 24px;
          padding: 22px;
          box-shadow: 0 18px 40px rgba(31,42,68,0.07);
        }
        .card h2 {
          margin: 0 0 10px;
          font-size: 1.15rem;
        }
        .muted {
          color: #64748b;
          line-height: 1.8;
        }
        .list {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }
        .list-item {
          padding: 14px 16px;
          border: 1px solid #e6ebf5;
          border-radius: 16px;
          background: #f9fbff;
        }
        .composer {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 14px;
        }
        .composer textarea {
          width: 100%;
          min-height: 180px;
          resize: vertical;
          border: 1px solid #dbe3f0;
          border-radius: 16px;
          padding: 16px;
          font-size: 1rem;
          outline: none;
        }
        .composer textarea:focus {
          border-color: #6d5df6;
          box-shadow: 0 0 0 3px rgba(109,93,246,0.12);
        }
        .note-toolbar {
          display: flex;
          justify-content: flex-end;
        }
        .primary-btn {
          border: none;
          border-radius: 14px;
          padding: 12px 16px;
          background: linear-gradient(90deg, #6d5df6 0%, #8a7cff 100%);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
      \`}</style>

      <div className="shell">
        <div className="hero">
          <div className="badge">AI Generated Experience</div>
          <h1>{title}</h1>
          <p>
            This prompt has been converted into a polished fallback experience so your request always
            results in a usable page. You can still refine the prompt and regenerate from the admin flow
            for a more specialized output.
          </p>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Overview</h2>
            <p className="muted">
              Your prompt was interpreted into a clean, production-inspired layout. This fallback keeps
              the experience useful even when the AI output is not strong enough to safely render the
              intended feature in its original form.
            </p>

            <div className="list">
              <div className="list-item">
                <strong>Prompt goal</strong>
                <div className="muted" style={{ marginTop: 6 }}>
                  ${safePrompt}
                </div>
              </div>

              <div className="list-item">
                <strong>Safe rendering</strong>
                <div className="muted" style={{ marginTop: 6 }}>
                  The system returned a stable fallback so the request can still move through preview and review.
                </div>
              </div>

              <div className="list-item">
                <strong>Recommended next step</strong>
                <div className="muted" style={{ marginTop: 6 }}>
                  Edit the prompt with more detail or regenerate the page from admin controls.
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Scratchpad</h2>
            <p className="muted">
              Use this saved notes area to capture ideas or refinements for the next regenerate pass.
            </p>

            <div className="composer">
              <textarea
                value={state?.notes?.draft || ""}
                onChange={(e) =>
                  setState((prev) => ({
                    ...prev,
                    notes: {
                      ...(prev?.notes || {}),
                      draft: e.target.value
                    }
                  }))
                }
                placeholder="Write improvement notes for this generated page..."
              />
              <div className="note-toolbar">
                <button type="button" className="primary-btn">
                  Saved automatically
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
  `.trim()
}

/* -----------------------------
   PROMPT BUILDERS
----------------------------- */
function buildCommonRules() {
  return `
STRICT OUTPUT RULES:

1. Create ONLY one top-level component named GeneratedPage.
2. Do NOT write import statements.
3. Do NOT write export statements.
4. Do NOT create an App component.
5. Output must be valid JSX that compiles in a React environment.
6. All UI and logic must stay inside the GeneratedPage component scope.
7. The component must return a single root <div>.
8. Return ONLY React code.
9. Do NOT include markdown fences.
10. Do NOT include explanations or prose outside the code.
11. Do NOT use TypeScript.
12. Do NOT use external APIs, remote assets, or external libraries.

REACT RULES:

1. Use React.useState and React.useEffect when needed.
2. Helper functions inside GeneratedPage are allowed and encouraged.
3. Complex internal logic is allowed.
4. Nested render helpers inside GeneratedPage are allowed.
5. Avoid native form submission navigation. Use e.preventDefault() where needed.
6. The code must not crash if rendered directly.

PERSISTENCE RULES:

1. If the page contains user-created state, progress, drafts, tasks, notes, tracker items, game progress, form values, or interactive session state, you MUST persist it.
2. Prefer window.afbStorage.getItem(key) and window.afbStorage.setItem(key, value) if available.
3. If unavailable, fall back to localStorage.
4. Use React.useState lazy initialization and React.useEffect for syncing persisted state.
5. Wrap parsing in try/catch and use safe defaults.

STYLING RULES:

1. Do NOT use Tailwind CSS.
2. Do NOT use external CSS files.
3. Use inline styles and/or a <style>{\`...\`}</style> block inside the component.
4. Create a premium, modern, responsive UI.
5. Strong spacing, rounded corners, shadows, and clear typography are required.
`
}

function buildPagePrompt(userPrompt) {
  return `
You are a senior frontend engineer and UI/UX designer.
Generate a polished, production-inspired responsive webpage for the following request.

${buildCommonRules()}

PAGE QUALITY RULES:

1. Prioritize visual quality, hierarchy, layout completeness, and responsive structure.
2. If the prompt is vague, infer a sensible complete page structure.
3. Include multiple meaningful sections where appropriate.
4. Prefer realistic labels and content over placeholder text.

Feature to build:
${userPrompt}

Return ONLY valid React code.
`
}

function buildToolPrompt(userPrompt) {
  return `
You are a senior frontend engineer building an interactive mini-application or business tool.

${buildCommonRules()}

TOOL QUALITY RULES:

1. Prioritize functionality and usability first, while keeping the UI polished.
2. Interactive logic must work correctly.
3. Validation should be sensible and lightweight.
4. The result should feel like a usable app, not a static mockup.

Feature to build:
${userPrompt}

Return ONLY valid React code.
`
}

function buildGamePrompt(userPrompt) {
  return `
You are a senior frontend engineer building a browser-based interactive game or puzzle.

${buildCommonRules()}

GAME QUALITY RULES:

1. Prioritize working game logic over visual ornamentation.
2. Internal helper functions and structured logic inside GeneratedPage are strongly encouraged.
3. Use clear state modeling.
4. The result must be actually playable, not just themed UI.
5. Persist game progress, board state, score, history, or session progress when relevant.
6. Avoid oversimplifying the logic into a static placeholder.
7. Keep the UI visually polished, but do not sacrifice functionality.

Feature to build:
${userPrompt}

Return ONLY valid React code.
`
}

function buildRepairPrompt(badCode, originalPrompt, mode) {
  return `
Rewrite the following into a valid single-component React output while preserving the original feature intent.

MODE:
${mode}

ORIGINAL FEATURE:
${originalPrompt}

RULES:
1. Component name must be GeneratedPage.
2. No imports.
3. No exports.
4. No App component.
5. Return ONLY valid React code.
6. Keep logic functional.
7. Keep all helpers inside GeneratedPage.
8. Keep persistence for interactive state if relevant.
9. Do not simplify complex logic into a fake static UI unless the code is completely unusable.

BROKEN OR NON-COMPLIANT CODE:
${badCode}
`
}

/* -----------------------------
   GEMINI CALL
----------------------------- */
async function callGemini(promptText) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
  })

  const result = await model.generateContent(promptText)
  const response = await result.response
  return response.text()
}

/* -----------------------------
   MAIN GENERATOR
----------------------------- */
async function generateReactPage(prompt) {
  const safePrompt = normalizePrompt(prompt)
  const mode = classifyPrompt(safePrompt)

  try {
    if (mode === "todo") {
      return buildTodoTemplate(safePrompt)
    }

    if (mode === "notes") {
      return buildNotesTemplate()
    }

    if (mode === "tracker") {
      return buildTrackerTemplate()
    }

    let primaryPrompt = buildPagePrompt(safePrompt)

    if (mode === "tool") {
      primaryPrompt = buildToolPrompt(safePrompt)
    }

    if (mode === "game") {
      primaryPrompt = buildGamePrompt(safePrompt)
    }

    // Primary generation
    const primaryText = await callGemini(primaryPrompt)
    let cleaned = sanitizeGeneratedCode(primaryText)

    if (isValidGeneratedCode(cleaned)) {
      return cleaned
    }

    console.log(`⚠️ Primary generation invalid for mode "${mode}", trying repair pass...`)

    // Repair pass
    const repairedText = await callGemini(
      buildRepairPrompt(cleaned || primaryText, safePrompt, mode)
    )
    cleaned = sanitizeGeneratedCode(repairedText)

    if (isValidGeneratedCode(cleaned)) {
      return cleaned
    }

    console.log(`⚠️ Repair pass invalid for mode "${mode}", using fallback...`)

    // Universal fallback
    return buildFallbackPage(safePrompt)
  } catch (err) {
    console.error("Gemini error:", err)
    return buildFallbackPage(safePrompt)
  }
}

module.exports = generateReactPage