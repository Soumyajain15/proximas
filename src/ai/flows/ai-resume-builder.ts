'use server';

/**
 * @fileOverview A resume builder AI agent.
 *
 * - generateResume - A function that handles the resume generation process.
 * - GenerateResumeInput - The input type for the generateResume function.
 * - GenerateResumeOutput - The return type for the generateResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateResumeInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The job description for the desired role.'),
  userSkills: z.array(z.string()).describe('A list of the user skills.'),
  userExperience: z.string().describe('The user experience.'),
  education: z.string().describe('The user education.'),
});
export type GenerateResumeInput = z.infer<typeof GenerateResumeInputSchema>;

const GenerateResumeOutputSchema = z.object({
  resumeContent: z.string().describe('The generated resume content.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are a professional resume writer. Use the provided job description, user skills, user experience, and education to generate a resume that is tailored to the job description.

Job Description: {{{jobDescription}}}
User Skills:
{{#each userSkills}} - {{{this}}}
{{/each}}
User Experience: {{{userExperience}}}
Education: {{{education}}}

Resume Content:`,
});

const generateResumeFlow = ai.defineFlow(
  {
    name: 'generateResumeFlow',
    inputSchema: GenerateResumeInputSchema,
    outputSchema: GenerateResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
