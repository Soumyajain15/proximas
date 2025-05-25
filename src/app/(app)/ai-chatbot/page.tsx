
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, HelpCircle, MessageSquare, FileText, Navigation, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Capability {
  title: string;
  description: string;
  icon: LucideIcon;
}

const capabilities: Capability[] = [
  {
    title: "Instant Career Queries",
    description: "Ask questions about job roles, required skills, career paths, certifications, and more—and get precise, AI-powered responses in real-time.",
    icon: HelpCircle,
  },
  {
    title: "Interview Practice Bot",
    description: "Engage in simulated mock interviews with the chatbot and receive feedback on your answers, tone, and structure.",
    icon: MessageSquare,
  },
  {
    title: "Resume and Profile Support",
    description: "Get tips on optimizing your resume, LinkedIn profile, and portfolio for better visibility and impact.",
    icon: FileText,
  },
  {
    title: "Platform Navigation Help",
    description: "Easily explore CareerCompass AI’s features with chatbot assistance guiding you through career tools, resources, and community features.",
    icon: Navigation,
  },
  {
    title: "Learning Recommendations",
    description: "Based on your profile and career goals, the chatbot suggests relevant courses, articles, and tutorials to help you upskill.",
    icon: BookOpen,
  },
];

export default function AIChatbotPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Chatbot – Your 24/7 Virtual Career Assistant"
        description="An intelligent virtual assistant integrated into the platform to provide instant, personalized support around the clock. It helps users navigate their career journey with ease, offering timely answers, guidance, and actionable suggestions."
        icon={Bot}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Key Capabilities</CardTitle>
          <CardDescription>
            Built with natural language processing (NLP), the chatbot ensures seamless, human-like interaction, offering a smart and responsive user experience to make career development more accessible and efficient.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {capabilities.map((capability, index) => (
            <Card key={index} className="bg-background/50">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                <div className="p-2.5 rounded-full bg-primary/10 text-primary shrink-0">
                  <capability.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>Interact with the Chatbot (Coming Soon)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            A dedicated chat interface will be available here soon, allowing you to directly interact with the AI Career Assistant.
          </p>
          <div className="h-64 w-full bg-muted rounded-md flex items-center justify-center text-muted-foreground/70">
            Chat Interface Placeholder
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
