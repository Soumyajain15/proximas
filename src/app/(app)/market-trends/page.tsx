import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, MapPin, Briefcase } from "lucide-react";
import Image from "next/image";

interface TrendData {
  id: string;
  title: string;
  value: string;
  icon: React.ElementType;
  description: string;
  trend?: 'up' | 'down' | 'stable';
}

const placeholderTrends: TrendData[] = [
  {
    id: 'salary-benchmark',
    title: "Avg. Software Engineer Salary (US)",
    value: "$120,000",
    icon: DollarSign,
    description: "National average based on recent data. Varies by experience and location.",
    trend: 'up',
  },
  {
    id: 'geo-trend',
    title: "Top Tech Hubs",
    value: "Austin, TX",
    icon: MapPin,
    description: "Emerging as a major center for tech innovation and job growth.",
  },
  {
    id: 'skill-demand',
    title: "In-Demand Skill",
    value: "Cloud Computing (AWS, Azure)",
    icon: Briefcase,
    description: "High demand across multiple industries for cloud-proficient professionals.",
    trend: 'up',
  },
   {
    id: 'remote-work',
    title: "Remote Work Trend",
    value: "Increasing",
    icon: TrendingUp,
    description: "More companies are offering remote or hybrid work options.",
    trend: 'up',
  }
];

export default function MarketTrendsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Job Market Trends"
        description="Stay informed with the latest salary benchmarks, geographic trends, and in-demand skills."
        icon={TrendingUp}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Current Market Insights</CardTitle>
          <CardDescription>
            This section displays mock data for illustrative purposes. Future versions will integrate with real-time job market APIs.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {placeholderTrends.map((trend) => (
            <Card key={trend.id} className="bg-background/50 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium text-primary">{trend.title}</CardTitle>
                <trend.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{trend.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
                {trend.trend && (
                   <p className={`text-xs mt-2 flex items-center ${trend.trend === 'up' ? 'text-green-600' : trend.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {trend.trend === 'up' && <TrendingUp className="h-4 w-4 mr-1" />}
                    {/* Add down arrow icon if needed */}
                    Trend: {trend.trend.charAt(0).toUpperCase() + trend.trend.slice(1)}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Geographic Salary Distribution (Example)</CardTitle>
            <CardDescription>Illustrative map showing salary variations by region. (Placeholder image)</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center p-4 bg-muted/30 rounded-md">
            <Image 
                src="https://placehold.co/600x400.png" 
                alt="Geographic Salary Map Placeholder" 
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
