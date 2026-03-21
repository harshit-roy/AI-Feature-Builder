const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function generateReactPage(prompt) {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const fullPrompt = `
    You are a senior frontend engineer and UI designer.

Generate a modern React functional component.

STRICT RULES:

1. Create ONLY one component named GeneratedPage.
2. Do NOT create any other components.
3. Do NOT write import statements.
4. Do NOT write export statements.
5. Do NOT create an App component.
8. Output must be valid JSX that compiles in a React environment.
9. All UI must be contained inside the GeneratedPage component.
10. The component must return a single root <div>.

STYLING:

- DO NOT use Tailwind CSS.

  Instead use:
  - inline styles
  - or a <style> block inside the component.
- The preview environment does not support Tailwind.
- Use modern colors, spacing, rounded corners and shadows manually.

FUNCTIONALITY:

• If the feature requires interaction, implement it fully.
• Buttons, forms, calculators, toggles, and inputs must work correctly.
• Manage state properly with React hooks.

OUTPUT FORMAT (EXACTLY):

const GeneratedPage = () => {
  return (
    <div>
      Your UI here
    </div>
  )
}

Feature to build:
${prompt}

Return ONLY valid React code.
No explanations.
No markdown.
`

    const result = await model.generateContent(fullPrompt)

    const response = await result.response
    let text = response.text()

    // Remove markdown
    text = text.replace(/```[a-z]*|```/gi, "").trim()

    // Remove imports if AI still adds them
    text = text.replace(/^import .*$/gm, "")

    // Remove export statements
    text = text.replace(/export\s+default\s+/g, "")
    text = text.replace(/export\s+/g, "")

    return text

  } catch (err) {

    console.error("Gemini error:", err)

    throw new Error("AI generation failed")

  }
}

module.exports = generateReactPage
