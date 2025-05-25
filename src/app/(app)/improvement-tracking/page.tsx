
"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getImprovementPlan, type ImprovementTrackingInput, type ImprovementTrackingOutput } from "@/ai/flows/ai-improvement-tracker";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, CheckCircle, Target, TrendingUp, MessageCircleWarning, Repeat, Loader2, Lightbulb, Brain, Award, Zap, Sparkles, Code2, Users, Presentation, HelpCircle } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  CheckCircle,
  Target,
  TrendingUp,
  MessageCircleWarning,
  Lightbulb,
  Brain,
  Award,
  Zap,
  Sparkles,
  Code2,
  Users,
  Presentation,
  HelpCircle, // Default/fallback icon
};

const formSchema = z.object({
  userSkillsToImprove: z.string().min(10, "Please list some skills or areas you want to improve (at least 10 characters)."),
  userCareerGoals: z.string().min(10, "Please describe your career goals (at least 10 characters)."),
});

type FormData = z.infer<typeof formSchema>;

export default function ImprovementTrackingPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ImprovementTrackingOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userSkillsToImprove: "",
      userCareerGoals: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiInput: ImprovementTrackingInput = data;
      const aiResult = await getImprovementPlan(aiInput);
      setResult(aiResult);
      toast({
        title: "Improvement Plan Generated!",
        description: "AI has crafted a personalized improvement plan for you.",
      });
    } catch (error) {
      console.error("Error generating improvement plan:", error);
      toast({
        title: "Error",
        description: "Failed to generate improvement plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personalized Improvement Tracking"
        description="Visually track your progress and review personalized improvement plans derived from your goals and focus areas."
        icon={BarChart3}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Generate Your Improvement Plan</CardTitle>
          <CardDescription>Tell us what skills you want to improve and your career goals, and AI will generate a tailored plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="userSkillsToImprove"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills/Areas to Improve</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Python, public speaking, project management" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userCareerGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Goals</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Become a senior software engineer, lead a team, improve presentation skills" {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Plan...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get My Plan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="shadow-md mt-6">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">AI is analyzing your input and crafting your plan...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <Card className="shadow-lg mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Sparkles className="h-6 w-6 text-primary"/>
                Your AI-Generated Improvement Plan
              </CardTitle>
              <CardDescription>
                {result.lastInterviewScoreContext}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Overall Estimated Progress Potential</Label>
                <Progress value={result.overallProgressEstimate} className="w-full h-3 mt-1 mb-2" />
                <p className="text-xs text-muted-foreground text-right">{result.overallProgressEstimate}% towards your goals</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href="/interview-simulator">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">
                  <Repeat className="mr-2 h-4 w-4" />
                  Practice with an Interview Simulation
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="text-destructive h-6 w-6" /> Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.areasToImprove.map((area) => {
                  const IconComponent = iconMap[area.iconName] || HelpCircle;
                  return (
                    <div key={area.id}>
                      <div className="flex justify-between items-center mb-1">
                        <Label className="text-sm font-medium flex items-center">
                          <IconComponent className={`mr-2 h-4 w-4 ${area.progress < 50 ? 'text-destructive' : 'text-yellow-500'}`} />
                          {area.name}
                        </Label>
                        <span className="text-xs text-muted-foreground">{area.progress}%</span>
                      </div>
                      <Progress value={area.progress} className="h-2" indicatorClassName={area.progress < 50 ? 'bg-destructive' : 'bg-yellow-500'} />
                      <p className="text-xs text-muted-foreground mt-1">{area.recommendation}</p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="text-green-600 h-6 w-6" /> Highlighted Strengths
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.strengths.map((strength) => {
                   const IconComponent = iconMap[strength.iconName] || HelpCircle;
                  return (
                  <div key={strength.id} className="flex items-start gap-3 p-3 bg-green-500/10 rounded-md">
                    <IconComponent className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-700">{strength.name}</p>
                      <p className="text-xs text-muted-foreground">{strength.note}</p>
                    </div>
                  </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      <Card className="shadow-lg mt-8">
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

// For Link component usage
import Link from "next/link";
