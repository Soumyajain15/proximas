
'use server';
/**
 * @fileOverview AI-powered ATS (Applicant Tracking System) Score Checker.
 *
 * This file defines a Genkit flow that analyzes a resume against a job description
 * to provide an estimated ATS score and actionable feedback.
 * - checkAtsScore - A function to trigger the ATS score checking flow.
 * - AtsCheckerInput - The input type for the checkAtsScore function.
 * - AtsCheckerOutput - The output type for the checkAtsScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AtsCheckerInputSchema = z.object({
  resumeText: z.string().min(100, "Resume text should be at least 100 characters.").describe('The full text content of the user\'s resume.'),
  jobDescription: z.string().describe('The full text content of the target job description.'),
});
export type AtsCheckerInput = z.infer<typeof AtsCheckerInputSchema>;

const AtsCheckerOutputSchema = z.object({
  atsScore: z.number().min(0).max(100).describe('An estimated ATS score for the resume against the job description, on a scale of 0 to 100.'),
  feedback: z.string().describe('Detailed feedback explaining the score, highlighting keyword matches/misses, and suggesting improvements for ATS optimization.'),
  positivePoints: z.array(z.string()).describe('A list of specific strengths or well-matched elements found in the resume.'),
  areasForImprovement: z.array(z.string()).describe('A list of specific areas where the resume could be improved for better ATS compatibility.'),
});
export type AtsCheckerOutput = z.infer<typeof AtsCheckerOutputSchema>;

export async function checkAtsScore(input: AtsCheckerInput): Promise<AtsCheckerOutput> {
  return atsCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'atsCheckerPrompt',
  input: {schema: AtsCheckerInputSchema},
  output: {schema: AtsCheckerOutputSchema},
  prompt: `You are an advanced Applicant Tracking System (ATS) simulator. Your task is to analyze the provided resume text against the given job description.
Provide an ATS score between 0 and 100.
Offer detailed feedback explaining the score. This feedback should include:
- How well the resume keywords match the job description.
- Comments on the resume's structure and clarity from an ATS perspective.
- Actionable suggestions for improvement.

Also, provide a list of specific positive points and a list of specific areas for improvement.

Job Description:
{{{jobDescription}}}

Resume Text:
{{{resumeText}}}

Analyze the resume based on the job description and generate the score, feedback, positive points, and areas for improvement.
Focus on keyword density, relevance of experience and skills to the job description, and ATS-friendly formatting cues (even though you only see text).
`,
});

const atsCheckerFlow = ai.defineFlow(
  {
    name: 'atsCheckerFlow',
    inputSchema: AtsCheckerInputSchema,
    outputSchema: AtsCheckerOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate ATS score and feedback.');
    }
    // Ensure arrays are present, even if empty
    if (!output.positivePoints) output.positivePoints = [];
    if (!output.areasForImprovement) output.areasForImprovement = [];
    return output;
  }
);
