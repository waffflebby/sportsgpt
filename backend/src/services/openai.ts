import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function generateChatResponse(messages: ChatMessage[]): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.3,
      max_tokens: 1000
    })

    return completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
  } catch (error) {
    console.error('OpenAI API error:', error)
    throw new Error('Failed to generate AI response')
  }
}

export async function analyzeSportsData(context: string, query: string): Promise<string> {
  const systemPrompt = `You are SportsGPT, an AI assistant specialized in sports analysis. You have access to live sports data, player statistics, and game information.

Context: ${context}

Provide insightful, accurate analysis based on the available data. Be concise but informative.`

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: query }
  ]

  return await generateChatResponse(messages)
}
