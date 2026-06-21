function enhancePrompt(userPrompt) {
  const prompt = String(userPrompt || "").trim()

  const lower = prompt.toLowerCase()

  let categoryRules = ""

  if (lower.includes("chess")) {
    categoryRules = `
CHESS REQUIREMENTS

- Fully playable chess game
- Legal move validation
- Turn management
- Piece capture logic
- Check detection
- Checkmate detection
- Restart game
- Highlight selected piece
- Highlight legal moves
- Highlight last move
- Responsive board
- Persist game state

VISUAL REQUIREMENTS

- Premium modern chess UI
- White pieces clearly visible
- Black pieces clearly visible
- Strong contrast between pieces and board
- Elegant board colors
- Modern game controls
`
  }

  else if (lower.includes("ludo")) {
    categoryRules = `
LUDO REQUIREMENTS

- Dice roll logic
- Player turns
- Token movement
- Home path logic
- Win condition
- Restart game
- Persist game progress

VISUAL REQUIREMENTS

- Beautiful game board
- Modern game aesthetics
- Clear token visibility
`
  }

  else if (
    lower.includes("todo") ||
    lower.includes("task")
  ) {
    categoryRules = `
TODO REQUIREMENTS

- Add task
- Edit task
- Delete task
- Mark complete
- Filter tasks
- Search tasks
- Empty state
- Persist tasks

VISUAL REQUIREMENTS

- Modern productivity app design
- Beautiful task cards
- Smooth interactions
`
  }

  else if (
    lower.includes("dashboard") ||
    lower.includes("admin")
  ) {
    categoryRules = `
DASHBOARD REQUIREMENTS

- Statistics cards
- Search
- Filters
- CRUD operations
- Forms
- Tables
- Responsive layout
- Persist user data

VISUAL REQUIREMENTS

- Linear-inspired dashboard
- Premium SaaS appearance
- Professional analytics UI
`
  }

  else if (
    lower.includes("expense")
  ) {
    categoryRules = `
EXPENSE TRACKER REQUIREMENTS

- Add transaction
- Delete transaction
- Categories
- Summary cards
- Charts
- Persist data

VISUAL REQUIREMENTS

- Modern fintech appearance
- Clean analytics design
`
  }

  else if (
    lower.includes("notes")
  ) {
    categoryRules = `
NOTES APP REQUIREMENTS

- Create note
- Edit note
- Delete note
- Search notes
- Persist notes

VISUAL REQUIREMENTS

- Modern knowledge-management UI
- Notion-inspired experience
`
  }

  else if (
    lower.includes("text compare")
  ) {
    categoryRules = `
TEXT COMPARE REQUIREMENTS

- Compare text
- Highlight differences
- Character count
- Word count
- Copy buttons

VISUAL REQUIREMENTS

- Developer-tool quality UI
- Modern editor experience
`
  }

  return `
USER REQUEST

${prompt}

IMPORTANT

Preserve the user's request exactly.

Do not change functionality.

Do not replace the requested application with another application.

--------------------------------------------------

DESIGN SYSTEM REQUIREMENTS

The UI should feel comparable in quality to:

- Linear
- Vercel
- Stripe
- Framer
- Notion
- Arc Browser
- Raycast
- Clerk
- Resend

Do NOT create:

- Generic Bootstrap layouts
- Basic admin templates
- Outdated SaaS dashboards
- Boring card grids
- Plain white pages

Use:

- Premium spacing
- Strong visual hierarchy
- Modern typography
- Beautiful gradients
- Layered surfaces
- Subtle shadows
- Interactive hover states
- Elegant transitions
- Modern layouts
- High-end startup design quality

--------------------------------------------------

COLOR SYSTEM RULES

- Maintain strong contrast
- Never place dark content on dark backgrounds
- Never place light content on light backgrounds
- Buttons must always remain readable
- Text must always remain readable
- Icons must remain visible
- Chess pieces must remain visible
- Game elements must remain visible

Use a cohesive color palette.

Avoid random colors.

--------------------------------------------------

UX REQUIREMENTS

Every application should include:

- Loading state
- Empty state
- Error state
- Success state
- Hover state
- Active state
- Disabled state

The application should feel complete.

--------------------------------------------------

RESPONSIVE DESIGN

Support:

- Mobile
- Tablet
- Desktop

Use modern responsive layouts.

--------------------------------------------------

PERSISTENCE

If users create data:

Use:

window.afbStorage

Fallback:

localStorage

Restore data after refresh.

--------------------------------------------------

FUNCTIONALITY

Every button must work.

Every form must work.

Every interaction must work.

Do not generate fake functionality.

Do not generate placeholder actions.

--------------------------------------------------

${categoryRules}

--------------------------------------------------

OUTPUT REQUIREMENTS

- React component name must be GeneratedPage
- No imports
- No exports
- Return only React code
`
}

module.exports = {
  enhancePrompt
}