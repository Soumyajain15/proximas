
'use server';
/**
 * @fileOverview A conversational AI chat flow.
 *
 * - chatWithAI - Handles a conversational turn with the AI.
 * - ChatInput - The input type for the chatWithAI function.
 * - ChatOutput - The return type for the chatWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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

const conversationalChatFlow = ai.defineFlow(
  {
    name: 'conversationalChatFlow',
    inputSchema: ChatInputSchemaInternal,
    outputSchema: ChatOutputSchemaInternal,
  },
  async (input) => {
    const { userInput, history } = input;

    const systemInstruction = `You are Proxima AI, a friendly and helpful virtual career assistant.
    Your primary goal is to provide concise and accurate information and guidance related to careers, job searching, skill development, resume building, interview preparation, and platform navigation.
    Be supportive, empathetic, and encouraging.
    If you don't know an answer to a specific factual question, it's better to say you don't know than to invent information.
    Keep your responses helpful and to the point, but feel free to elaborate if the user asks for more details.
    You can ask clarifying questions if the user's query is ambiguous.`;

    // The 'history' array is already in the correct format for the `history` parameter of ai.generate().
    // The 'userInput' string is for the `prompt` parameter.

    const response = await ai.generate({
      prompt: userInput, // Pass the current user's text input directly
      history: history,  // Pass the conversation history array
      system: systemInstruction,
      config: {
        temperature: 0.6, // Slightly lower temperature for more focused career advice
         safetySettings: [ // Adjust safety settings as needed
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      }
    });

    const aiResponseText = response.text;
    if (!aiResponseText) {
      // Fallback response if AI doesn't provide text
      return { aiResponse: "I'm sorry, I couldn't process that request. Could you try rephrasing?" };
    }

    return { aiResponse: aiResponseText };
  }
);


