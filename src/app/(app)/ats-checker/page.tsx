
"use client";

import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { checkAtsScore, type AtsCheckerInput, type AtsCheckerOutput } from "@/ai/flows/ai-ats-checker";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; // Added for file input
import { ScanSearch, Loader2, CheckCircle, AlertTriangle, Sparkles, ThumbsUp, Edit, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  resumeText: z.string().min(100, "Resume text should be at least 100 characters."),
  jobDescription: z.string().min(50, "Job description should be at least 50 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function AtsCheckerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AtsCheckerOutput | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumeText: "",
      jobDescription: "",
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === 'string') {
            form.setValue("resumeText", text, { shouldValidate: true });
            setSelectedFileName(file.name);
            toast({
              title: "File Uploaded",
              description: `${file.name} content loaded into resume text area.`,
            });
          } else {
            toast({
              title: "File Read Error",
              description: "Could not read text from the file.",
              variant: "destructive",
            });
            setSelectedFileName(null);
          }
        };
        reader.onerror = () => {
           toast({
            title: "File Read Error",
            description: "Failed to read the file.",
            variant: "destructive",
          });
          setSelectedFileName(null);
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a plain text (.txt) file.",
          variant: "destructive",
        });
        setSelectedFileName(null);
        // Clear the file input
        event.target.value = "";
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiInput: AtsCheckerInput = data;
      const aiResult = await checkAtsScore(aiInput);
      setResult(aiResult);
      toast({
        title: "ATS Score Calculated!",
        description: "AI has analyzed your resume against the job description.",
      });
    } catch (error) {
      console.error("Error calculating ATS score:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to calculate ATS score.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI ATS Score Checker"
        description="Get an estimated ATS score for your resume against a job description and receive actionable feedback."
        icon={ScanSearch}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Check Your Resume's ATS Compatibility</CardTitle>
          <CardDescription>Paste your resume text, upload a .txt file, and provide the target job description below to get an AI-powered analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Job Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste the full job description here." {...field} className="min-h-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Upload Resume (.txt file)</FormLabel>
                <div className="flex items-center gap-2">
                    <FormControl>
                         <Input 
                            id="resumeFile"
                            type="file" 
                            accept=".txt" 
                            onChange={handleFileChange} 
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                    </FormControl>
                </div>
                {selectedFileName && <p className="text-sm text-muted-foreground mt-1">Selected file: {selectedFileName}</p>}
                 <p className="text-xs text-muted-foreground mt-1">Alternatively, you can paste the resume text directly below.</p>
              </FormItem>

              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume Text (Paste or Upload)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste your full resume text here, or upload a .txt file above. Ensure it's plain text for best results." {...field} className="min-h-[250px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ScanSearch className="mr-2 h-4 w-4" />
                    Check ATS Score
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
            <p className="mt-4 text-muted-foreground">AI is analyzing your resume and job description...</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="shadow-lg mt-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-7 w-7 text-primary" />
              ATS Analysis Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1 flex items-center">
                Estimated ATS Score:
                <Badge variant={result.atsScore > 75 ? "default" : result.atsScore > 50 ? "secondary" : "destructive"} className="ml-2 text-lg px-3 py-1">
                  {result.atsScore}/100
                </Badge>
              </h3>
              <Progress value={result.atsScore} className="w-full h-3 mb-4" 
                indicatorClassName={
                  result.atsScore > 75 ? 'bg-green-500' : result.atsScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }
              />
            </div>

            <div>
              <h4 className="font-semibold text-md text-foreground mb-2 flex items-center"><ThumbsUp className="h-5 w-5 mr-2 text-green-600"/>Positive Points:</h4>
              {result.positivePoints && result.positivePoints.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 pl-4 text-sm text-muted-foreground bg-green-500/10 p-3 rounded-md">
                  {result.positivePoints.map((point, index) => (
                    <li key={`positive-${index}`}>{point}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific positive points highlighted by AI.</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold text-md text-foreground mb-2 flex items-center"><Edit className="h-5 w-5 mr-2 text-orange-500"/>Areas for Improvement:</h4>
              {result.areasForImprovement && result.areasForImprovement.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 pl-4 text-sm text-muted-foreground bg-orange-500/10 p-3 rounded-md">
                {result.areasForImprovement.map((area, index) => (
                  <li key={`improve-${index}`}>{area}</li>
                ))}
              </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">No specific areas for improvement highlighted by AI.</p>
              )}
            </div>
            
            <div>
              <h4 className="font-semibold text-md text-foreground mb-2">Detailed Feedback:</h4>
              <div className="prose prose-sm max-w-none dark:prose-invert rounded-md border border-border bg-background/50 p-4">
                 <p>{result.feedback}</p>
              </div>
            </div>
          </CardContent>
           <CardFooter>
            <p className="text-xs text-muted-foreground">
              Note: This ATS score is an estimate generated by AI and should be used as a guideline.
              Different ATS systems may have varying algorithms.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}


    