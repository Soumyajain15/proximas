
'use server';
/**
 * @fileOverview AI-powered market trend analysis.
 *
 * This file defines a Genkit flow that analyzes a user's area of interest
 * to generate relevant job market trends, including salary insights, skill demands, and geographic hotspots.
 * - getMarketTrends - A function to trigger the market trend generation.
 * - MarketTrendsInput - The input type for the getMarketTrends function.
 * - MarketTrendsOutput - The output type for the getMarketTrends function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const MarketTrendsInputSchema = z.object({
  interestArea: z.string().describe("User's primary area of interest for market trends (e.g., 'Software Engineering salaries in US', 'remote work future', 'AI skill demand', 'Cybersecurity job market')."),
});
export type MarketTrendsInput = z.infer<typeof MarketTrendsInputSchema>;

export const MarketTrendItemSchema = z.object({
  id: z.string().describe("A unique ID for the trend (e.g., 'avg-salary-swe')."),
  title: z.string().describe("The title of the market trend (e.g., 'Average Software Engineer Salary (US)')."),
  value: z.string().describe("A key value or statement for the trend (e.g., '$125,000 annually', 'Significant Growth', 'High Demand')."),
  iconName: z.string().describe("Name of a relevant lucide-react icon (e.g., 'DollarSign', 'MapPin', 'Briefcase', 'TrendingUp', 'ShieldCheck', 'Laptop')."),
  description: z.string().describe("A brief description of the trend and its implications."),
  trendDirection: z.string().optional().describe("Optional: The direction of the trend - 'up', 'down', or 'stable'."),
});

export const MarketTrendsOutputSchema = z.object({
  trends: z.array(MarketTrendItemSchema).min(3).max(4).describe("A list of 3-4 current and relevant market trends based on the user's area of interest."),
});
export type MarketTrendsOutput = z.infer<typeof MarketTrendsOutputSchema>;

export async function getMarketTrends(input: MarketTrendsInput): Promise<MarketTrendsOutput> {
  return marketTrendsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'marketTrendsPrompt',
  input: {schema: MarketTrendsInputSchema},
  output: {schema: MarketTrendsOutputSchema},
  prompt: `You are an AI market analyst. Based on the user's area of interest, provide 3-4 current and relevant market trends.
Each trend should include a title, a key value/statement, a brief description, a suggested lucide-react icon name, and optionally a trend direction ('up', 'down', or 'stable').
Focus on providing actionable insights and realistic data where possible.
Ensure iconName fields contain valid lucide-react icon names. Examples: 'DollarSign', 'MapPin', 'Briefcase', 'TrendingUp', 'Activity', 'BarChart', 'Users', 'Cpu', 'ShieldCheck', 'Network', 'Cloud'.

User's Area of Interest: {{{interestArea}}}

Generate structured market trend data.
`,
});

const marketTrendsFlow = ai.defineFlow(
  {
    name: 'marketTrendsFlow',
    inputSchema: MarketTrendsInputSchema,
    outputSchema: MarketTrendsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output || !output.trends || output.trends.length === 0) {
      // Provide a default fallback if AI fails to generate trends
      return {
        trends: [
          {
            id: 'default-trend-1',
            title: 'AI Skills in Demand',
            value: 'Rapidly Increasing',
            iconName: 'Brain',
            description: 'Proficiency in AI and Machine Learning is highly sought after across industries.',
            trendDirection: 'up',
          },
          {
            id: 'default-trend-2',
            title: 'Remote Work Options',
            value: 'Widely Available',
            iconName: 'Laptop',
            description: 'Many companies continue to offer remote or hybrid work arrangements.',
            trendDirection: 'stable',
          },
           {
            id: 'default-trend-3',
            title: 'Cybersecurity Importance',
            value: 'Critical',
            iconName: 'ShieldCheck',
            description: 'Demand for cybersecurity professionals is at an all-time high due to increasing digital threats.',
            trendDirection: 'up',
          },
        ],
      };
    }
    return output;
  }
);
