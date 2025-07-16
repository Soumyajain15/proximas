
"use client";

import * as React from "react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getMarketTrends, type MarketTrendsInput, type MarketTrendsOutput, type MarketTrendItem as TrendData } from "@/ai/flows/ai-market-trends";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, DollarSign, MapPin, Briefcase, Loader2, Lightbulb, ShieldCheck, Laptop, Brain, Activity, BarChart, Users, Cpu, Network, Cloud, HelpCircle } from "lucide-react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  DollarSign,
  MapPin,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Laptop,
  Brain,
  Activity,
  BarChart,
  Users,
  Cpu,
  Network,
  Cloud,
  HelpCircle, // Default/fallback icon
};

const formSchema = z.object({
  interestArea: z.string().min(10, "Please specify an area of interest (at least 10 characters)."),
});

type FormData = z.infer<typeof formSchema>;

export default function MarketTrendsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MarketTrendsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      interestArea: "general technology trends",
    },
  });

 const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    setResult(null);
    try {
      const aiInput: MarketTrendsInput = data;
      const aiResult = await getMarketTrends(aiInput);
      setResult(aiResult);
      toast({
        title: "Market Trends Loaded!",
        description: "AI has fetched the latest market trends for your area of interest.",
      });
    } catch (error) {
      console.error("Error fetching market trends:", error);
      toast({
        title: "Error",
        description: "Failed to fetch market trends. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch initial general trends on component mount
  React.useEffect(() => {
    onSubmit({ interestArea: "general technology trends" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Market Trends"
        description="Stay informed with the latest salary benchmarks, geographic trends, and in-demand skills powered by AI."
        icon={TrendingUp}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Explore Market Insights</CardTitle>
          <CardDescription>
            Enter an area of interest to get tailored market trends from our AI.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:flex sm:items-end sm:gap-4">
              <FormField
                control={form.control}
                name="interestArea"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormLabel>Area of Interest</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., AI in healthcare, remote software jobs, cybersecurity salaries" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shrink-0">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Get Trends
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && !result && (
        <Card className="shadow-md mt-6">
          <CardContent className="pt-6 text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">AI is fetching the latest market trends...</p>
          </CardContent>
        </Card>
      )}

      {result && result.trends && (
         <Card className="shadow-lg mt-8">
            <CardHeader>
                <CardTitle>AI-Powered Market Trends</CardTitle>
                <CardDescription>Dynamic insights based on your query: "{form.getValues("interestArea")}"</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
            {result.trends.map((trend: TrendData) => {
                const IconComponent = iconMap[trend.iconName] || HelpCircle;
                return (
                <Card key={trend.id} className="bg-background/50 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium text-primary">{trend.title}</CardTitle>
                    <IconComponent className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-foreground">{trend.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
                    {trend.trendDirection && (
                    <p className={`text-xs mt-2 flex items-center ${
                        trend.trendDirection === 'up' ? 'text-green-600' : 
                        trend.trendDirection === 'down' ? 'text-red-600' : 
                        'text-muted-foreground'}`
                    }>
                        {trend.trendDirection === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                        {/* Add other trend direction icons if desired */}
                        Trend: {trend.trendDirection.charAt(0).toUpperCase() + trend.trendDirection.slice(1)}
                    </p>
                    )}
                </CardContent>
                </Card>
            );
            })}
            </CardContent>
        </Card>
      )}


      <Card className="shadow-lg mt-8">
        <CardHeader>
            <CardTitle>Geographic Salary Distribution</CardTitle>
            <CardDescription>Illustrative map showing salary variations by region.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-4 bg-muted/30 rounded-md">
            <Image 
                src="https://placehold.co/600x400.png" 
                alt="Geographic Salary Map" 
                width={600} 
                height={400}
                data-ai-hint="world map analytics"
                className="rounded-md shadow-md"
            />
        </CardContent>
      </Card>
    </div>
  );
}
