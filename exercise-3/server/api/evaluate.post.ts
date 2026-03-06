import OpenAI from 'openai'
import type { IEvaluationRequest, IEvaluationResult } from '~/types'

const MAX_IDEA_LENGTH = 2000

const SYSTEM_PROMPT = `You are a business idea evaluator. The user will describe a business idea.
You must analyze it and return ONLY a valid JSON object with this exact structure:
{"score": <number from 0 to 10>, "reasoning": "<one or two sentences explaining the score>"}

Rules:
- score must be an integer between 0 and 10
- reasoning must be concise (max 2 sentences)
- Do NOT include any text outside the JSON object
- Do NOT wrap the JSON in markdown code blocks`

export default defineEventHandler(async (event) => {
  const { idea } = await readBody<IEvaluationRequest>(event)

  if (!idea || typeof idea !== 'string' || idea.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Missing or empty idea' })
  }

  if (idea.length > MAX_IDEA_LENGTH) {
    throw createError({ statusCode: 400, statusMessage: `Idea must be ${MAX_IDEA_LENGTH} characters or less` })
  }

  const config = useRuntimeConfig()

  if (!config.openaiApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'OpenAI API key not configured' })
  }

  const openai = new OpenAI({ apiKey: config.openaiApiKey })

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: idea },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 200,
    })

    const raw = completion.choices[0]?.message?.content?.trim()

    if (!raw) {
      throw new Error('Empty response from OpenAI')
    }

    const parsed: IEvaluationResult = JSON.parse(raw)

    if (typeof parsed.score !== 'number' || parsed.score < 0 || parsed.score > 10) {
      throw new Error('Invalid score from OpenAI')
    }

    if (typeof parsed.reasoning !== 'string') {
      throw new Error('Invalid reasoning from OpenAI')
    }

    return {
      score: Math.round(parsed.score),
      reasoning: parsed.reasoning,
    }
  }
  catch (error: unknown) {
    if (error instanceof OpenAI.APIError) {
      const status = error.status || 500
      const message = error.status === 429
        ? 'Rate limit exceeded. Please try again later.'
        : error.status === 401
          ? 'Invalid OpenAI API key.'
          : `OpenAI error: ${error.message}`
      throw createError({ statusCode: status, statusMessage: message })
    }

    if (error instanceof SyntaxError) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to parse OpenAI response' })
    }

    const message = error instanceof Error ? error.message : 'Unknown error'
    throw createError({ statusCode: 500, statusMessage: message })
  }
})
