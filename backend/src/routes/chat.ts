import { Elysia, t } from 'elysia'
import { statements } from '../database/init'
import { generateChatResponse } from '../services/openai'

export const chatRoutes = new Elysia({ prefix: '/chat' })
  .post('/send', async ({ body }) => {
    const { conversation_id, message } = body as { conversation_id?: number; message: string }

    try {
      let conversationId = conversation_id

      // Create new conversation if none provided
      if (!conversationId) {
        const result = statements.insertConversation.run(message.substring(0, 50) + (message.length > 50 ? '...' : ''))
        conversationId = result.lastInsertRowid as number
      }

      // Save user message
      statements.insertMessage.run(conversationId, 'user', message)

      // Get conversation history
      const messages = statements.getMessagesByConversation.all(conversationId) as any[]

      // Convert to OpenAI format
      const chatMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      // Generate AI response
      const aiResponse = await generateChatResponse(chatMessages)

      // Save AI response
      statements.insertMessage.run(conversationId, 'assistant', aiResponse)

      // Update conversation timestamp
      statements.updateConversation.run(
        `${message.substring(0, 30)}${message.length > 30 ? '...' : ''}`,
        conversationId
      )

      return {
        response: aiResponse,
        conversation_id: conversationId
      }
    } catch (error) {
      console.error('Chat error:', error)
      return {
        error: 'Failed to process chat message',
        conversation_id: conversationId || null
      }
    }
  }, {
    body: t.Object({
      conversation_id: t.Optional(t.Number()),
      message: t.String()
    })
  })
