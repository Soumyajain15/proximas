"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { simulateInterview, type SimulateInterviewInput, type SimulateInterviewOutput } from "@/ai/flows/ai-interview-simulator";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MessagesSquare, Loader2, CheckCircle, Award } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  jobDescription: z.string().min(50, "Job description should be at least 50 characters."),
  userResume: z.string().min(100, "Resume content should be at least 100 characters."),
  userSkills: z.string().min(20, "Please list some of your key skills."),
});

type FormData = z.infer<typeof formSchema>;

export default function InterviewSimulatorPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulateInterviewOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      userResume: "",
      userSkills: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiInput: SimulateInterviewInput = data;
      const aiResult = await simulateInterview(aiInput);
      setResult(aiResult);
      toast({
        title: "Interview Simulation Complete!",
        description: "AI has provided feedback on your simulated interview.",
      });
    } catch (error) {
      console.error("Error simulating interview:", error);
      toast({
        title: "Error",
        description: "Failed to simulate interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Interview Simulator"
        description="Prepare for your interviews with realistic AI-driven simulations and get instant feedback."
        icon={MessagesSquare}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Start Your Simulation</CardTitle>
          <CardDescription>Enter the job details and your information to begin the AI-powered interview simulation.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the job description for the role you're targeting." {...field} className="min-h-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userResume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste your resume content here." {...field} className="min-h-[200px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Key Skills</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List your key skills relevant to the job (e.g., Python, Project Management, Communication)." {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <MessagesSquare className="mr-2 h-4 w-4" />
                    Start Interview Simulation
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card className="shadow-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">AI is preparing your interview simulation and feedback...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="shadow-lg mt-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              <CheckCircle className="h-6 w-6" />
              Interview Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Overall Score: {result.score}/100
              </h3>
              <Progress value={result.score} className="w-full h-3 mb-4" />
              <div className="prose prose-sm max-w-none dark:prose-invert rounded-md border border-border bg-background/50 p-4">
                 <p>{result.feedback}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
