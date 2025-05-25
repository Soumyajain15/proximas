
"use client";

import { PageHeader } from "@/components/page-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqData = [
  {
    id: "faq-1",
    question: "What is CareerCompass AI?",
    answer: "CareerCompass AI is an innovative platform designed to assist users in navigating their career paths using artificial intelligence. It offers tools for career path guidance, interview simulation, resume building, market trend analysis, and personalized improvement tracking.",
  },
  {
    id: "faq-2",
    question: "How does the AI Career Path Guidance work?",
    answer: "Our AI analyzes your professional profile, skills, aspirations, and interests to recommend optimal career paths. You provide your information, and the AI generates tailored suggestions and reasoning.",
  },
  {
    id: "faq-3",
    question: "Is my data secure?",
    answer: "We take data security seriously. All personal information and inputs are handled with strict confidentiality and processed securely. We do not share your data with third parties without your consent.",
  },
  {
    id: "faq-4",
    question: "How can the Interview Simulator help me?",
    answer: "The AI Interview Simulator allows you to practice job interviews in a realistic setting. You can input a job description and your resume, and the AI will simulate an interview, providing feedback on your communication and knowledge.",
  },
  {
    id: "faq-5",
    question: "What kind of market trends can I find?",
    answer: "You can get insights into salary benchmarks, in-demand skills, geographic hotspots for jobs, and general industry trends based on your area of interest. This helps you stay informed about the current job market.",
  },
  {
    id: "faq-6",
    question: "How do I get started?",
    answer: "Simply navigate to the dashboard and choose from the available AI-powered tools. Each tool will guide you through the necessary inputs to get started.",
  }
];

export default function FAQPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Frequently Asked Questions"
        description="Find answers to common questions about CareerCompass AI and its features."
        icon={HelpCircle}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Common Questions</CardTitle>
          <CardDescription>
            If you don&apos;t find your answer here, feel free to reach out to our support.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqData.map((item) => (
              <AccordionItem value={item.id} key={item.id}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>Still have questions?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            If your question isn&apos;t answered above, please don&apos;t hesitate to contact our support team.
            We&apos;re here to help you make the most of CareerCompass AI. (Contact method placeholder)
          </p>
          {/* Placeholder for contact form or email link */}
        </CardContent>
      </Card>
    </div>
  );
}
