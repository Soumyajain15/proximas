import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { BarChart3, CheckCircle, Target, TrendingUp, MessageCircleWarning, Repeat } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";

const placeholderImprovementData = {
  overallProgress: 65,
  lastInterviewScore: 75,
  areasToImprove: [
    { id: "clarity", name: "Clarity in Responses", progress: 40, icon: MessageCircleWarning, recommendation: "Practice structuring answers with STAR method." },
    { id: "confidence", name: "Confidence", progress: 60, icon: Target, recommendation: "Record yourself and review body language." },
    { id: "tech-knowledge", name: "Technical Knowledge (Specific Area)", progress: 70, icon: CheckCircle, recommendation: "Review core concepts of [Specific Tech]." },
  ],
  strengths: [
    { id: "communication", name: "Enthusiasm & Communication", icon: TrendingUp, note: "Positive attitude and clear initial communication noted." },
    { id: "problem-solving", name: "Problem Solving Approach", icon: CheckCircle, note: "Logical approach to hypothetical questions." },
  ],
};

export default function ImprovementTrackingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Personalized Improvement Tracking"
        description="Visually track your progress and review personalized improvement plans derived from interview simulations."
        icon={BarChart3}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Progress Overview</CardTitle>
          <CardDescription>
            This section displays mock data. Dynamic tracking will be available as you complete interview simulations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Overall Interview Skill Progress</Label>
            <Progress value={placeholderImprovementData.overallProgress} className="w-full h-3 mt-1 mb-2" />
            <p className="text-xs text-muted-foreground text-right">{placeholderImprovementData.overallProgress}% proficiency</p>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg">
            <p className="text-sm text-primary">
              Your last interview simulation score was <strong className="font-semibold">{placeholderImprovementData.lastInterviewScore}/100</strong>.
              Keep practicing to improve!
            </p>
          </div>
        </CardContent>
         <CardFooter className="flex justify-end">
          <Link href="/interview-simulator">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
              <Repeat className="mr-2 h-4 w-4" />
              Take Another Simulation
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="text-destructive h-6 w-6" /> Areas for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {placeholderImprovementData.areasToImprove.map((area) => (
              <div key={area.id}>
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-sm font-medium flex items-center">
                    <area.icon className={`mr-2 h-4 w-4 ${area.progress < 50 ? 'text-destructive' : 'text-yellow-500'}`} />
                    {area.name}
                  </Label>
                  <span className="text-xs text-muted-foreground">{area.progress}%</span>
                </div>
                <Progress value={area.progress} className="h-2" indicatorClassName={area.progress < 50 ? 'bg-destructive' : 'bg-yellow-500'} />
                <p className="text-xs text-muted-foreground mt-1">{area.recommendation}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="text-green-600 h-6 w-6" /> Highlighted Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {placeholderImprovementData.strengths.map((strength) => (
              <div key={strength.id} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-md">
                <strength.icon className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-700">{strength.name}</p>
                  <p className="text-xs text-muted-foreground">{strength.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Progress Over Time (Example)</CardTitle>
            <CardDescription>Illustrative chart showing skill improvement. (Placeholder image)</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-4 bg-muted/30 rounded-md">
            <Image 
                src="https://placehold.co/600x300.png" 
                alt="Progress Chart Placeholder" 
                width={600} 
                height={300}
                data-ai-hint="line graph analytics"
                className="rounded-md shadow-md"
            />
        </CardContent>
      </Card>

    </div>
  );
}

// Label component if not globally available from shadcn/ui (it is, but for completeness if needed standalone)
// const Label = ({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
//   <label className={cn("block text-sm font-medium text-gray-700", className)} {...props}>
//     {children}
//   </label>
// );

