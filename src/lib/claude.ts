import Groq from 'groq-sdk';

export const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

export function isClaudeConfigured() {
  return Boolean(process.env.GROQ_API_KEY)
}

export async function callClaude(systemPrompt: string, userMessage: string) {
  if (!groq) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  const response = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });
  return response.choices[0]?.message?.content ?? '';
}