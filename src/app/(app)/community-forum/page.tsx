
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MessagesSquare, MessageCircleQuestion, Share2, Megaphone, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface HighlightCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  cta?: string;
}

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
  const highlights: HighlightCardProps[] = [
    {
      title: "Discussion Boards",
      description: "Engage in topic-specific conversations on career advice, job opportunities, interview experiences, skill development, and more.",
      icon: MessagesSquare,
      cta: "Browse Boards",
    },
    {
      title: "Q&A Section",
      description: "Ask questions and get answers from experienced professionals and fellow users.",
      icon: MessageCircleQuestion,
      cta: "Ask a Question",
    },
    {
      title: "Mentorship Threads",
      description: "Connect with mentors who offer guidance, share insights, and provide feedback on your career progress.",
      icon: Users,
      cta: "Find a Mentor",
    },
    {
      title: "Resource Sharing",
      description: "Exchange study materials, recommended courses, project ideas, and industry articles.",
      icon: Share2,
      cta: "Share Resources",
    },
    {
      title: "Event Announcements",
      description: "Stay informed about upcoming webinars, workshops, and networking events.",
      icon: Megaphone,
      cta: "View Events",
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
            This forum builds a sense of community and support, helping users not only grow individually but also contribute meaningfully to others’ success.
          </p>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Key Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((highlight) => (
            <HighlightCard key={highlight.title} {...highlight} />
          ))}
        </div>
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
              Start a New Discussion
            </Button>
            <Button variant="outline">
              Introduce Yourself
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
