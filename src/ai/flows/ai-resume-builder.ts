
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
  resumeContentMarkdown: z.string().describe('The generated resume content in well-formatted Markdown. This should include sections like Summary, Experience, Education, and Skills, using Markdown for headings, lists, and emphasis.'),
});
export type GenerateResumeOutput = z.infer<typeof GenerateResumeOutputSchema>;

export async function generateResume(input: GenerateResumeInput): Promise<GenerateResumeOutput> {
  return generateResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateResumePrompt',
  input: {schema: GenerateResumeInputSchema},
  output: {schema: GenerateResumeOutputSchema},
  prompt: `You are a professional resume writer. Your task is to generate comprehensive resume content in **Markdown format**. The resume should be tailored to the provided job description, user skills, user experience, and education.

Structure the resume with clear sections. Common sections include:
- **Summary/Objective**: A brief, impactful overview.
- **Experience**: Detail roles, responsibilities, and achievements. Use bullet points for accomplishments.
- **Education**: List degrees, institutions, and graduation dates.
- **Skills**: Categorize skills if appropriate (e.g., Technical Skills, Soft Skills).

Use Markdown effectively:
- Headings for sections (e.g., \`## Summary\`, \`### Job Title\`).
- Bullet points (\`-\` or \`*\`) for lists.
- Bold (\`**text**\`) for emphasis on titles or key achievements.
- Italic (\`*text*\`) if needed.

Job Description: {{{jobDescription}}}
User Skills:
{{#each userSkills}} - {{{this}}}
{{/each}}
User Experience: {{{userExperience}}}
Education: {{{education}}}

Provide the full resume content in Markdown format below.
Resume Markdown Content:`,
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
