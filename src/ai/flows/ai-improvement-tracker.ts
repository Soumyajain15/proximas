
'use server';
/**
 * @fileOverview AI-powered personalized improvement tracking.
 *
 * This file defines a Genkit flow that analyzes user-provided skills and goals
 * to generate personalized improvement advice, identify strengths, and estimate progress.
 * - getImprovementPlan - A function to trigger the improvement plan generation.
 * - ImprovementTrackingInput - The input type for the getImprovementPlan function.
 * - ImprovementTrackingOutput - The output type for the getImprovementPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const ImprovementTrackingInputSchema = z.object({
  userSkillsToImprove: z.string().describe("A comma-separated list of skills the user wants to improve or focus areas."),
  userCareerGoals: z.string().describe("The user's stated career goals or aspirations."),
});
export type ImprovementTrackingInput = z.infer<typeof ImprovementTrackingInputSchema>;

export const ImprovementTrackingOutputSchema = z.object({
  overallProgressEstimate: z.number().min(0).max(100).describe("An estimated overall skill progress percentage (0-100) based on the potential for growth given the inputs."),
  lastInterviewScoreContext: z.string().describe("A brief contextual statement about potential interview performance or general encouragement, e.g., 'Focusing on these areas can significantly boost your interview readiness.'"),
  areasToImprove: z.array(z.object({
    id: z.string().describe("A unique ID for the improvement area (e.g., 'communication-skills')."),
    name: z.string().describe("The name of the skill or area to improve."),
    progress: z.number().min(0).max(100).describe("An estimated current proficiency level (0-100) for this specific area, assuming the user is starting to focus on it."),
    iconName: z.string().describe("Name of a relevant lucide-react icon (e.g., 'MessageCircleWarning', 'Target', 'Lightbulb', 'Brain')."),
    recommendation: z.string().describe("A concise, actionable recommendation for improving this area."),
  })).describe("A list of 2-3 key areas for improvement."),
  strengths: z.array(z.object({
    id: z.string().describe("A unique ID for the strength (e.g., 'proactive-learning')."),
    name: z.string().describe("The name of the identified strength."),
    iconName: z.string().describe("Name of a relevant lucide-react icon (e.g., 'TrendingUp', 'CheckCircle', 'Award', 'Zap')."),
    note: z.string().describe("A brief note highlighting this strength."),
  })).describe("A list of 1-2 key strengths to acknowledge or leverage."),
});
export type ImprovementTrackingOutput = z.infer<typeof ImprovementTrackingOutputSchema>;

export async function getImprovementPlan(input: ImprovementTrackingInput): Promise<ImprovementTrackingOutput> {
  return improvementTrackerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvementTrackerPrompt',
  input: {schema: ImprovementTrackingInputSchema},
  output: {schema: ImprovementTrackingOutputSchema},
  prompt: `You are an AI career development coach. Based on the user's skills to improve and career goals, provide an estimated overall progress potential, actionable recommendations for 2-3 key areas to improve, and identify 1-2 existing or potential strengths.
For each area to improve, suggest a current progress level (assuming they are just starting to focus, so typically lower, e.g., 20-50%).
For each area to improve and strength, suggest a relevant lucide-react icon name. Examples for improvement areas: 'MessageCircleWarning', 'Target', 'Lightbulb', 'Code2', 'Users', 'Presentation'. Examples for strengths: 'TrendingUp', 'CheckCircle', 'Award', 'Zap', 'Sparkles'.
The overall progress estimate should reflect the potential for growth towards their goals by working on these areas.
The lastInterviewScoreContext should be an encouraging statement about how focusing on these areas can improve future interview performance or overall career readiness.

User Skills to Improve: {{{userSkillsToImprove}}}
User Career Goals: {{{userCareerGoals}}}

Generate a structured improvement plan.
Ensure iconName fields contain valid lucide-react icon names.
`,
});

const improvementTrackerFlow = ai.defineFlow(
  {
    name: 'improvementTrackerFlow',
    inputSchema: ImprovementTrackingInputSchema,
    outputSchema: ImprovementTrackingOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate an improvement plan.');
    }
    // Ensure arrays are not empty, provide defaults if necessary (though schema should guide AI)
    if (!output.areasToImprove || output.areasToImprove.length === 0) {
      output.areasToImprove = [{id: 'default-improve', name: 'Skill Development', progress: 30, iconName: 'Lightbulb', recommendation: 'Focus on targeted learning for key skills.'}];
    }
    if (!output.strengths || output.strengths.length === 0) {
      output.strengths = [{id: 'default-strength', name: 'Proactiveness', iconName: 'Zap', note: 'Taking initiative to improve is a great strength.'}];
    }
    return output;
  }
);
