
'use server';
/**
 * @fileOverview AI-powered career path guidance flow.
 *
 * This file defines a Genkit flow that analyzes user profiles, skills, and aspirations to recommend optimal career paths.
 * It includes:
 * - `recommendCareerPaths` - A function to trigger the career path recommendation flow.
 * - `CareerPathInput` - The input type for the `recommendCareerPaths` function.
 * - `CareerPathOutput` - The output type for the `recommendCareerPaths` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerPathInputSchema = z.object({
  profile: z
    .string()
    .describe('Summary of the user professional profile, skills and experience.'),
  aspirations: z.string().describe('The career aspirations of the user.'),
  interests: z.string().describe('The interests of the user.'),
});
export type CareerPathInput = z.infer<typeof CareerPathInputSchema>;

const CareerPathOutputSchema = z.object({
  recommendedPaths: z
    .string()
    .describe('A list of recommended career paths based on the user profile, aspirations and interests.'),
  reasoning: z.string().describe('The reasoning behind the career path recommendations.'),
});
export type CareerPathOutput = z.infer<typeof CareerPathOutputSchema>;

export async function recommendCareerPaths(input: CareerPathInput): Promise<CareerPathOutput> {
  return recommendCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerPathPrompt',
  input: {schema: CareerPathInputSchema},
  output: {schema: CareerPathOutputSchema},
  prompt: `You are a career coach expert. Your goal is to analyze the user's profile, aspirations, and interests to recommend optimal career paths.

  Profile: {{{profile}}}
  Aspirations: {{{aspirations}}}
  Interests: {{{interests}}}

  Based on the above information, recommend a few career paths and explain your reasoning.
  Please format the career paths as a list.
  `,
});

const recommendCareerPathsFlow = ai.defineFlow(
  {
    name: 'recommendCareerPathsFlow',
    inputSchema: CareerPathInputSchema,
    outputSchema: CareerPathOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

