
"use client";

import { useState, useRef } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateResume, type GenerateResumeInput, type GenerateResumeOutput } from "@/ai/flows/ai-resume-builder";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileText, Loader2, Sparkles, ClipboardCopy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const formSchema = z.object({
  jobDescription: z.string().min(50, "Job description should be at least 50 characters."),
  userSkills: z.string().min(10, "Skills list should be at least 10 characters (e.g. 'Python, JavaScript')."),
  userExperience: z.string().min(50, "Experience summary should be at least 50 characters."),
  education: z.string().min(20, "Education details should be at least 20 characters."),
});

type FormData = z.infer<typeof formSchema>;

export default function ResumeBuilderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateResumeOutput | null>(null);
  const { toast } = useToast();
  const previewRef = useRef<HTMLDivElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobDescription: "",
      userSkills: "",
      userExperience: "",
      education: "",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiInput: GenerateResumeInput = {
        ...data,
        userSkills: data.userSkills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0),
      };
      const aiResult = await generateResume(aiInput);
      setResult(aiResult);
      toast({
        title: "Resume Generated!",
        description: "AI has crafted a resume tailored to your input.",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (result?.resumeContentMarkdown) {
      navigator.clipboard.writeText(result.resumeContentMarkdown)
        .then(() => {
          toast({ title: "Copied to clipboard!", description: "Resume Markdown content has been copied." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy content to clipboard.", variant: "destructive" });
          console.error('Failed to copy: ', err);
        });
    }
  };

  const handleExportToPDF = () => {
    if (previewRef.current && result?.resumeContentMarkdown) {
      toast({ title: "Exporting PDF...", description: "Please wait a moment."});
      html2canvas(previewRef.current, { 
        scale: 2, // Improves quality
        logging: false, // Suppress html2canvas logs in console
        useCORS: true // If your markdown includes external images
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Calculate the ratio to fit the image within the PDF page dimensions
        const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
        
        const imgX = (pdfWidth - canvasWidth * ratio) / 2; // Center the image
        const imgY = 0; // Align to top
        
        pdf.addImage(imgData, 'PNG', imgX, imgY, canvasWidth * ratio, canvasHeight * ratio);
        pdf.save('resume.pdf');
        toast({ title: "Resume Exported!", description: "Your resume has been saved as resume.pdf." });
      }).catch(err => {
        toast({ title: "PDF Export Failed", description: "Could not export resume to PDF. Check console for details.", variant: "destructive" });
        console.error('Failed to export PDF: ', err);
      });
    } else {
       toast({ title: "Nothing to Export", description: "Please generate a resume first.", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Resume Builder"
        description="Create professional, ATS-friendly resumes tailored to specific roles and industries in minutes."
        icon={FileText}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Build Your Resume</CardTitle>
          <CardDescription>Fill in your details, and our AI will generate optimized resume content for you.</CardDescription>
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
                      <Textarea placeholder="Paste the job description for the role you're applying for." {...field} className="min-h-[120px]" />
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
                    <FormLabel>Your Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your skills, separated by commas (e.g., Python, JavaScript, Team Leadership)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Experience</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your relevant work experience." {...field} className="min-h-[150px]" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Education</FormLabel>
                    <FormControl>
                      <Textarea placeholder="List your educational qualifications." {...field} className="min-h-[100px]" />
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
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Resume
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
            <p className="mt-4 text-muted-foreground">AI is crafting your resume content...</p>
          </CardContent>
        </Card>
      )}

      {result && result.resumeContentMarkdown && (
        <Card className="shadow-lg mt-8 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xl text-primary">
              <FileText className="h-6 w-6" />
              Live Preview & Actions
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopyToClipboard} disabled={!result?.resumeContentMarkdown}>
                <ClipboardCopy className="mr-2 h-4 w-4" />
                Copy Markdown
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportToPDF} disabled={!result?.resumeContentMarkdown || isLoading} className="bg-primary/10 text-primary hover:bg-primary/20">
                <Download className="mr-2 h-4 w-4" />
                Export to PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              id="resume-preview-content" 
              ref={previewRef} 
              className="prose prose-sm dark:prose-invert max-w-full p-4 border border-border bg-background/70 rounded-md shadow-inner min-h-[300px] overflow-y-auto lg:min-h-[500px]"
              style={{ lineHeight: '1.6' }} // Added for better readability
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {result.resumeContentMarkdown}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
