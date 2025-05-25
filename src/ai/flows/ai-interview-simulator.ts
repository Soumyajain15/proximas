
// src/ai/flows/ai-interview-simulator.ts
'use server';

/**
 * @fileOverview AI Interview Simulator flow.
 *
 * This flow simulates job interviews and provides real-time feedback on communication and knowledge.
 * - simulateInterview - Simulates a job interview and returns feedback.
 * - SimulateInterviewInput - The input type for the simulateInterview function.
 * - SimulateInterviewOutput - The return type for the simulateInterview function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateInterviewInputSchema = z.object({
  jobDescription: z.string().describe('The description of the job for which the user is being interviewed.'),
  userResume: z.string().describe('The user resume.'),
  userSkills: z.string().describe('A list of skills the user possesses.'),
});
export type SimulateInterviewInput = z.infer<typeof SimulateInterviewInputSchema>;

const SimulateInterviewOutputSchema = z.object({
  feedback: z.string().describe('Feedback on the user interview performance, including communication and knowledge.'),
  score: z.number().describe('The score of the interview'),
});
export type SimulateInterviewOutput = z.infer<typeof SimulateInterviewOutputSchema>;

export async function simulateInterview(input: SimulateInterviewInput): Promise<SimulateInterviewOutput> {
  return simulateInterviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'simulateInterviewPrompt',
  input: {schema: SimulateInterviewInputSchema},
  output: {schema: SimulateInterviewOutputSchema},
  prompt: `You are an AI interview simulator. Given the job description, the user's resume and a list of their skills, simulate a job interview. Provide feedback on the user interview performance, including communication and knowledge. Also, provide a score between 0 and 100.

Job Description: {{{jobDescription}}}
User Resume: {{{userResume}}}
User Skills: {{{userSkills}}}`,
});

const simulateInterviewFlow = ai.defineFlow(
  {
    name: 'simulateInterviewFlow',
    inputSchema: SimulateInterviewInputSchema,
    outputSchema: SimulateInterviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

