import Anthropic from "@anthropic-ai/sdk"

export const isClaudeConfigured = (): boolean => {
  const key = process.env.ANTHROPIC_API_KEY
  return Boolean(key && key.startsWith("sk-ant-") && key !== "sk-ant-xxx")
}

export const claude = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "sk-ant-demo-placeholder",
})

export async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  if (!isClaudeConfigured()) {
    throw new Error("CLAUDE_NOT_CONFIGURED")
  }
  const response = await claude.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: userMessage }],
    system: systemPrompt,
  })
  const firstBlock = response.content[0]
  return firstBlock && firstBlock.type === "text" ? firstBlock.text : ""
}
