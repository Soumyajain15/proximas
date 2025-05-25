
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessagesSquare, MessageCircleQuestion, Share2, Megaphone, ArrowRight, Lightbulb, Briefcase, HelpCircle, Goal, TrendingUp, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getCommunitySuggestions, type CommunitySuggestionItem } from "@/ai/flows/ai-community-suggestions";
import { useToast } from "@/hooks/use-toast";

interface HighlightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  cta?: string;
}

const iconMap: Record<string, LucideIcon> = {
  MessagesSquare,
  Lightbulb,
  Users,
  Briefcase,
  HelpCircle,
  Share2,
  Megaphone,
  Goal,
  TrendingUp,
};


function HighlightCard({ title, description, icon: Icon, cta }: HighlightCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{description}</p>
        {cta && (
          <Button variant="outline" size="sm" className="mt-2 border-accent text-accent hover:bg-accent/10">
            {cta} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function CommunityForumPage() {
  const { toast } = useToast();
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [suggestions, setSuggestions] = useState<CommunitySuggestionItem[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      setIsLoadingSuggestions(true);
      try {
        const result = await getCommunitySuggestions();
        console.log("AI Community Suggestions Received:", result); // Log raw result
        if (result && Array.isArray(result.suggestions)) {
          setSuggestions(result.suggestions);
        } else {
          // This case should ideally be handled by the flow's fallback
          console.error("Unexpected result structure from getCommunitySuggestions:", result);
          setSuggestions([]);
           toast({
            title: "Content Format Error",
            description: "Received unexpected data for community suggestions.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching community suggestions:", error);
        toast({
          title: "Error Fetching Suggestions",
          description: `Could not load AI topics: ${error.message || "Please try refreshing."}`,
          variant: "destructive",
        });
        setSuggestions([]); 
      } finally {
        setIsLoadingSuggestions(false);
      }
    }
    fetchSuggestions();
  }, [toast]);

  const highlights: HighlightCardProps[] = [
    {
      title: "Discussion Boards",
      description: "Engage in topic-specific conversations on career advice, job opportunities, interview experiences, skill development, and more.",
      icon: MessagesSquare,
      cta: "Browse Boards (Feature)",
    },
    {
      title: "Q&A Section",
      description: "Ask questions and get answers from experienced professionals and fellow users.",
      icon: MessageCircleQuestion,
      cta: "Ask a Question (Feature)",
    },
    {
      title: "Mentorship Threads",
      description: "Connect with mentors who offer guidance, share insights, and provide feedback on your career progress.",
      icon: Users,
      cta: "Find a Mentor (Feature)",
    },
    {
      title: "Resource Sharing",
      description: "Exchange study materials, recommended courses, project ideas, and industry articles.",
      icon: Share2,
      cta: "Share Resources (Feature)",
    },
    {
      title: "Event Announcements",
      description: "Stay informed about upcoming webinars, workshops, and networking events.",
      icon: Megaphone,
      cta: "View Events (Feature)",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Community Forum"
        description="Connect, Learn, and Grow Together. Your space for collaborative learning and peer support."
        icon={Users}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Welcome to the Community!</CardTitle>
          <CardDescription>
            The Community Forum is an interactive space within the platform where users can connect with peers, industry professionals, and mentors. 
            It fosters collaborative learning, knowledge sharing, and peer support across a wide range of career-related topics.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This forum builds a sense of community and support, helping users not only grow individually but also contribute meaningfully to others’ success. (Note: This page currently showcases AI-suggested topics; full interactivity is a future feature.)
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Forum Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <HighlightCard key={highlight.title} {...highlight} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6">AI-Suggested Discussion Starters</h2>
        {isLoadingSuggestions ? (
           <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Loading AI suggestions...</p>
          </div>
        ) : suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suggestions.map((suggestion) => {
              const Icon = iconMap[suggestion.iconName] || HelpCircle;
              return (
                <Card key={suggestion.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card">
                  <CardHeader className="flex flex-row items-center gap-3 pb-2">
                    <div className="p-2.5 rounded-full bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-md">{suggestion.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                    <Button variant="outline" size="sm">
                      Join Discussion <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="shadow-md">
            <CardContent className="pt-6 text-center">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">No AI suggestions available at the moment.</p>
              <p className="text-sm text-muted-foreground/80">This could be a temporary issue, or the AI might not have suggestions for this topic right now. Please try refreshing the page later.</p>
            </CardContent>
          </Card>
        )}
      </section>

      <Card className="shadow-lg mt-8">
        <CardHeader>
          <CardTitle>Get Involved!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Start exploring the discussion boards, ask your pressing career questions, or share your expertise to help others.
            Your participation makes our community stronger!
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Start a New Discussion (Feature)
            </Button>
            <Button variant="outline">
              Introduce Yourself (Feature)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

