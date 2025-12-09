
'use server';
/**
 * @fileOverview A conversational AI chat flow.
 *
 * - chatWithAI - Handles a conversational turn with the AI.
 * - ChatInput - The input type for the chatWithAI function.
 * - ChatOutput - The return type for the chatWithAI function.
 */

import { z } from 'genkit';
import {
  generateChatCompletion,
  type GeminiHistoryMessage,
} from '@/ai/gemini-client';

// Define the structure for a single message part (as Genkit/Gemini expects)
const MessagePartSchema = z.object({
  text: z.string(),
});

// Define the structure for a single message in the history
const HistoryMessageSchema = z.object({
  role: z.enum(['user', 'model']), // Gemini uses 'model' for AI responses
  parts: z.array(MessagePartSchema),
});

// Internal Zod schema - not exported
const ChatInputSchemaInternal = z.object({
  userInput: z.string().describe('The latest message from the user.'),
  history: z.array(HistoryMessageSchema).optional().describe('The conversation history up to this point.'),
});
export type ChatInput = z.infer<typeof ChatInputSchemaInternal>;

// Internal Zod schema - not exported
const ChatOutputSchemaInternal = z.object({
  aiResponse: z.string().describe('The AI\'s response to the user.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchemaInternal>;

export async function chatWithAI(input: ChatInput): Promise<ChatOutput> {
  return conversationalChatFlow(input);
}

const conversationalChatFlow = async (
  input: z.infer<typeof ChatInputSchemaInternal>
): Promise<ChatOutput> => {
  const { userInput, history } = input;

  const systemInstruction = `You are Proxima AI, a friendly and helpful virtual career assistant.
Your primary goal is to provide concise and accurate information and guidance related to careers, job searching, skill development, resume building, interview preparation, and platform navigation.
Be supportive, empathetic, and encouraging.
If you don't know an answer to a specific factual question, it's better to say you don't know than to invent information.
Keep your responses helpful and to the point, but feel free to elaborate if the user asks for more details.
You can ask clarifying questions if the user's query is ambiguous.`;

  const sdkHistory: GeminiHistoryMessage[] | undefined = history?.map((msg) => ({
    role: msg.role,
    parts: msg.parts.map((p) => ({ text: p.text })),
  }));

  const aiResponseText = await generateChatCompletion({
    userInput,
    history: sdkHistory,
    systemInstruction,
    temperature: 0.6,
  });

  return {
    aiResponse:
      aiResponseText ||
      "I'm sorry, I couldn't process that request. Could you try rephrasing?",
  };
};


