const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

async function generateReactPage(prompt) {
  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const fullPrompt = `
        You are a senior frontend engineer, product designer, and UI/UX specialist.

        Your task is to generate a complete, polished, responsive React webpage as a single functional component.

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
        11. Do NOT include explanations or comments outside the code.

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

        PAGE QUALITY RULES:

        1. Generate a FULL webpage, not a tiny widget or incomplete section.
        2. The output should feel like a real usable page, not a demo fragment.
        3. Include enough sections/content to make the page feel complete.
        4. If the user request is vague, infer a sensible complete page structure.
        5. Prefer realistic UI copy and labels over placeholder lorem ipsum.
        6. The page should look portfolio-quality and production-inspired.

        FUNCTIONALITY RULES:

        1. If the requested page needs interaction, implement it properly.
        2. Buttons, forms, inputs, tabs, toggles, filters, counters, calculators, and modals should work correctly if they are part of the feature.
        3. Forms should manage state correctly.
        4. Validation should be basic but sensible where relevant.
        5. Interactive features must feel functional, not fake.
        6. If the request is mainly informational, still make the page visually rich and structured.

        FALLBACK BEHAVIOR:

        1. If the user prompt is too short or unclear, convert it into a complete webpage experience.
        2. Infer missing details intelligently while staying close to the user intent.
        3. Always generate something visually complete, responsive, and usable.
        4. Never return a nearly empty page.

        OUTPUT FORMAT (EXACTLY THIS SHAPE):

        const GeneratedPage = () => {
          // state and helper logic if needed

          return (
            <div>
              <style>{\`
                /* your css here */
              \`}</style>
              {/* full page ui */}
            </div>
          )
        }

        Feature to build:
        ${prompt}

        Generate a polished, responsive, functional webpage.
        Return ONLY valid React code.
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
