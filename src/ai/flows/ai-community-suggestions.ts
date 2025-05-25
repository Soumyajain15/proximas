
'use server';
/**
 * @fileOverview AI-powered community content suggestion flow.
 *
 * This file defines a Genkit flow that generates engaging discussion topics
 * or questions for a career development community forum.
 * - getCommunitySuggestions - A function to trigger the suggestion generation.
 * - CommunitySuggestionsOutput - The output type for the getCommunitySuggestions function.
 * - CommunitySuggestionItem - The type for an individual community suggestion.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CommunitySuggestionItemSchema = z.object({
  id: z.string().describe("A unique ID for the suggestion (e.g., 'ask-me-anything')."),
  title: z.string().describe("The title of the discussion topic or question."),
  description: z.string().describe("A brief description or prompt for the discussion (1-2 sentences)."),
  iconName: z.string().describe("Name of a relevant lucide-react icon (e.g., 'MessagesSquare', 'Lightbulb', 'Users', 'Briefcase', 'HelpCircle')."),
});
export type CommunitySuggestionItem = z.infer<typeof CommunitySuggestionItemSchema>;

const CommunitySuggestionsOutputSchema = z.object({
  suggestions: z.array(CommunitySuggestionItemSchema).min(3).max(5).describe("A list of 3-5 AI-generated community discussion suggestions."),
});
export type CommunitySuggestionsOutput = z.infer<typeof CommunitySuggestionsOutputSchema>;

export async function getCommunitySuggestions(): Promise<CommunitySuggestionsOutput> {
  return communitySuggestionsFlow();
}

const prompt = ai.definePrompt({
  name: 'communitySuggestionsPrompt',
  output: {schema: CommunitySuggestionsOutputSchema},
  prompt: `You are a helpful community engagement AI. Your task is to generate 3-5 engaging discussion topics or questions for a career development community forum.
For each suggestion, provide:
- A unique ID (e.g., 'career-pivot-advice', 'interview-tips-share', 'skill-gap-analysis').
- A compelling title for the discussion.
- A brief description or prompt (1-2 sentences) to kickstart the conversation.
- A relevant lucide-react icon name (choose from: 'MessagesSquare', 'Lightbulb', 'Users', 'Briefcase', 'HelpCircle', 'Share2', 'TrendingUp', 'Goal', 'Megaphone').

Focus on topics that would encourage interaction, knowledge sharing, and peer support related to career growth, job searching, skill development, and workplace challenges.
Ensure iconName fields contain valid lucide-react icon names from the provided list.
`,
});

const communitySuggestionsFlow = ai.defineFlow(
  {
    name: 'communitySuggestionsFlow',
    outputSchema: CommunitySuggestionsOutputSchema,
  },
  async () => {
    const {output} = await prompt({}); // No input needed for this version
    if (!output || !output.suggestions || output.suggestions.length === 0) {
      // Provide a default fallback if AI fails to generate suggestions
      return {
        suggestions: [
          {
            id: 'default-topic-1',
            title: 'Share Your Best Interview Tip!',
            description: 'What is one piece of advice that significantly helped you in job interviews? Let\'s learn from each other.',
            iconName: 'Lightbulb',
          },
          {
            id: 'default-topic-2',
            title: 'Navigating Career Changes: Experiences & Advice',
            description: 'Thinking about a career pivot or recently made one? Share your journey, challenges, and insights.',
            iconName: 'Briefcase',
          },
          {
            id: 'default-topic-3',
            title: 'AMA: Ask a Senior Developer Anything',
            description: 'Hypothetical AMA thread: What questions would you ask a seasoned software developer about their career?',
            iconName: 'MessagesSquare', // Corrected from MessageSquare
          },
        ],
      };
    }
    return output;
  }
);

