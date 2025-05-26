
"use client";

import { useState, type ChangeEvent, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { checkAtsScore, type AtsCheckerInput, type AtsCheckerOutput } from "@/ai/flows/ai-ats-checker";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input"; 
import { ScanSearch, Loader2, Sparkles, ThumbsUp, Edit, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import * as pdfjsLib from 'pdfjs-dist';

const formSchema = z.object({
  resumeText: z.string().min(100, "Resume text should be at least 100 characters."),
  jobDescription: z.string().min(50, "Job description should be at least 50 characters."),
});

type FormData = z.infer<typeof formSchema>;

// Dynamically determine the version of pdfjs-dist for the workerSrc URL
// This is a bit of a trick to get the version pdfjs-dist reports for itself.
const PDF_JS_VERSION = pdfjsLib.version;

export default function AtsCheckerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
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

  useEffect(() => {
    // Set the workerSrc for pdf.js. This is crucial for it to work.
    // We use a CDN version for simplicity in a prototype environment.
    // Make sure this version matches the installed pdfjs-dist version.
     try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDF_JS_VERSION}/pdf.worker.min.mjs`;
    } catch (error) {
        console.error("Error setting pdf.js worker source:", error);
        // Fallback or further error handling might be needed if this fails
    }
  }, []);


  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setSelectedFileName(file.name);
        setIsParsingPdf(true);
        toast({
          title: "Processing PDF...",
          description: `Extracting text from ${file.name}. This may take a moment.`,
        });
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let allText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            let pageText = "";
            for (const item of textContent.items) {
                // Type guard to ensure item has 'str' property
                if ('str' in item) {
                    pageText += item.str + " ";
                }
            }
            allText += pageText.trim() + "\n\n"; // Add double newline for page separation
          }
          form.setValue("resumeText", allText.trim(), { shouldValidate: true });
          toast({
            title: "PDF Processed",
            description: `Text extracted from ${file.name} and loaded into resume text area.`,
          });
        } catch (error) {
          console.error("Error parsing PDF:", error);
          toast({
            title: "PDF Read Error",
            description: `Could not extract text from the PDF. Error: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          });
          setSelectedFileName(null);
          form.setValue("resumeText", "", { shouldValidate: false }); // Clear text area on error
        } finally {
          setIsParsingPdf(false);
          // Clear the file input so the same file can be re-selected if needed
          event.target.value = "";
        }
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF (.pdf) file.",
          variant: "destructive",
        });
        setSelectedFileName(null);
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
          <CardDescription>Upload your resume as a PDF file, or paste its text, and provide the target job description below to get an AI-powered analysis.</CardDescription>
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
                <FormLabel>Upload Resume (.pdf file)</FormLabel>
                <div className="flex items-center gap-2">
                    <FormControl>
                         <Input 
                            id="resumeFile"
                            type="file" 
                            accept=".pdf" 
                            onChange={handleFileChange} 
                            disabled={isParsingPdf}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                        />
                    </FormControl>
                     {isParsingPdf && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
                </div>
                {selectedFileName && !isParsingPdf && <p className="text-sm text-muted-foreground mt-1">Selected file: {selectedFileName}</p>}
                 <p className="text-xs text-muted-foreground mt-1">Alternatively, you can paste the resume text directly below.</p>
              </FormItem>

              <FormField
                control={form.control}
                name="resumeText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Resume Text (Paste or Upload PDF)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Upload a PDF resume above, or paste your full resume text here. Ensure it's machine-readable text for best results from PDF." {...field} className="min-h-[250px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading || isParsingPdf} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
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

      {(isLoading || isParsingPdf) && (
        <Card className="shadow-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">
              {isParsingPdf ? "Extracting text from PDF..." : "AI is analyzing your resume and job description..."}
            </p>
          </CardContent>
        </Card>
      )}

      {result && !isLoading && !isParsingPdf && (
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
              Different ATS systems may have varying algorithms. PDF text extraction accuracy can vary.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
