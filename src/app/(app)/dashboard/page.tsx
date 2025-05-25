
"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, BriefcaseBusiness, MessagesSquare, FileText, TrendingUp, BarChart3, ArrowRight, Save, Bot, HelpCircle, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
  cta: string;
}

function FeatureCard({ title, description, icon: Icon, link, cta }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col bg-card border hover:border-primary/40">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-xl text-foreground">{title}</CardTitle>
          <CardDescription className="text-sm mt-1 text-muted-foreground">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Additional content can be placed here if needed */}
      </CardContent>
      <CardFooter>
        <Link href={link} className="w-full">
          <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            {cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

const CAREER_GOALS_STORAGE_KEY = "careerCompassAI_careerGoals";

export default function DashboardPage() {
  const [careerGoals, setCareerGoals] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem(CAREER_GOALS_STORAGE_KEY);
    if (savedGoals) {
      setCareerGoals(savedGoals);
    }
  }, []);

  const handleGoalsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setCareerGoals(event.target.value);
  };

  const handleSaveGoals = () => {
    localStorage.setItem(CAREER_GOALS_STORAGE_KEY, careerGoals);
    toast({
      title: "Goals Saved!",
      description: "Your career goals have been saved locally.",
      duration: 3000,
    });
  };

  const features: FeatureCardProps[] = [
    {
      title: "Career Path Guidance",
      description: "Analyze your profile and aspirations to find optimal career paths.",
      icon: BriefcaseBusiness,
      link: "/career-path",
      cta: "Explore Paths"
    },
    {
      title: "Interview Simulator",
      description: "Practice interviews with AI and get real-time feedback.",
      icon: MessagesSquare,
      link: "/interview-simulator",
      cta: "Start Simulation"
    },
    {
      title: "Resume Builder",
      description: "Generate professional resumes tailored to your target roles.",
      icon: FileText,
      link: "/resume-builder",
      cta: "Build Resume"
    },
    {
      title: "Market Trends",
      description: "Stay updated with salary benchmarks and job market demands.",
      icon: TrendingUp,
      link: "/market-trends",
      cta: "View Trends"
    },
    {
      title: "Improvement Tracking",
      description: "Track progress and view personalized improvement plans.",
      icon: BarChart3,
      link: "/improvement-tracking",
      cta: "Track Progress"
    },
    {
      title: "AI Chatbot",
      description: "Get instant answers and guidance from your virtual career assistant.",
      icon: Bot,
      link: "/ai-chatbot",
      cta: "Chat with AI"
    },
    {
      title: "FAQ",
      description: "Find answers to common questions about CareerCompass AI.",
      icon: HelpCircle,
      link: "/faq",
      cta: "View FAQs"
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Welcome to Your Career Dashboard"
        description="Navigate your career journey with AI-powered tools and insights. Select a feature below or define your goals to get started."
        icon={LayoutDashboard}
      />
      
      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6 pb-2 border-b border-border">AI-Powered Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="mt-10">
         <Card className="shadow-lg bg-secondary/20 border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl text-foreground">
              <Target className="mr-3 h-7 w-7 text-primary" />
              Your Career Goals
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Define your aspirations to help CareerCompass AI tailor guidance for you. What are you aiming for in your career?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              placeholder="E.g., Transition to a data science role, achieve a leadership position in tech, find a remote job with work-life balance..."
              className="w-full p-3 rounded-md border border-input bg-background focus:ring-2 focus:ring-primary outline-none min-h-[100px] text-sm"
              value={careerGoals}
              onChange={handleGoalsChange}
              aria-label="Career goals input"
            />
          </CardContent>
          <CardFooter>
            <Button 
              className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md hover:shadow-lg transition-shadow"
              onClick={handleSaveGoals}
            >
              <Save className="mr-2 h-4 w-4" /> Save Goals
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
