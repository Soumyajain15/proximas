"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendCareerPaths, type CareerPathInput, type CareerPathOutput } from "@/ai/flows/ai-career-path-guidance";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BriefcaseBusiness, Lightbulb, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  profile: z.string().min(50, "Profile summary should be at least 50 characters."),
  aspirations: z.string().min(20, "Aspirations should be at least 20 characters."),
  interests: z.string().min(20, "Interests should be at least 20 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function CareerPathPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CareerPathOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile: "",
      aspirations: "",
      interests: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiInput: CareerPathInput = data;
      const aiResult = await recommendCareerPaths(aiInput);
      setResult(aiResult);
      toast({
        title: "Career Paths Recommended!",
        description: "AI has generated potential career paths for you.",
      });
    } catch (error) {
      console.error("Error generating career paths:", error);
      toast({
        title: "Error",
        description: "Failed to generate career paths. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Career Path Guidance"
        description="Discover optimal career paths tailored to your profile, aspirations, and interests."
        icon={BriefcaseBusiness}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Find Your Path</CardTitle>
          <CardDescription>Provide your details below, and our AI will suggest suitable career directions for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Professional Profile</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Summarize your skills, experience, and educational background." {...field} className="min-h-[120px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aspirations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Career Aspirations</FormLabel>
                    <FormControl>
                      <Input placeholder="What are your long-term career goals?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests</FormLabel>
                    <FormControl>
                      <Input placeholder="What are your personal or professional interests?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Recommendations
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
            <p className="mt-4 text-muted-foreground">AI is analyzing your input and crafting recommendations...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="shadow-lg mt-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-primary">
              <Sparkles className="h-6 w-6" />
              AI Recommended Career Paths
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Recommended Paths:</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert rounded-md border border-border bg-background/50 p-4">
                {/* Assuming recommendedPaths might be a list or string with newlines */}
                {result.recommendedPaths.split('\n').map((path, index) => (
                  <p key={index} className="mb-1">{path.startsWith('- ') ? path : `- ${path}`}</p>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Reasoning:</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert rounded-md border border-border bg-background/50 p-4">
                <p>{result.reasoning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
