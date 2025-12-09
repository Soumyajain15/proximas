import { GoogleGenerativeAI } from '@google/generative-ai';

// Simple shared Gemini client for server-side usage
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  // Log once during module init; the UI will surface a friendlier error.
  console.error(
    '[Gemini] GEMINI_API_KEY is not set. Add it to your environment (.env, hosting env vars).'
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Default model for Proxima conversational/chat use-cases.
const DEFAULT_MODEL = 'gemini-2.0-flash';

export type GeminiHistoryMessage = {
  role: 'user' | 'model';
  parts: { text: string }[];
};

export async function generateChatCompletion(options: {
  userInput: string;
  history?: GeminiHistoryMessage[];
  systemInstruction?: string;
  temperature?: number;
}): Promise<string> {
  if (!genAI) {
    throw new Error(
      'GEMINI_API_KEY is not configured on the server. Please set it in your environment.'
    );
  }

  const { userInput, history = [], systemInstruction, temperature = 0.6 } = options;

  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction,
  });

  const contents = [
    // Optional conversation history
    ...history.map((msg) => ({
      role: msg.role,
      parts: msg.parts.map((p) => ({ text: p.text })),
    })),
    // Latest user turn
    {
      role: 'user' as const,
      parts: [{ text: userInput }],
    },
  ];

  const result = await model.generateContent({
    contents,
    generationConfig: {
      temperature,
    },
    // Safety config can be expanded as needed; keeping defaults for now.
  });

  const text = result.response.text();
  if (!text) {
    throw new Error('Gemini SDK returned an empty response.');
  }

  return text;
}


