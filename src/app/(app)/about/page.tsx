
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Target, Lightbulb } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="About Proxima AI"
        description="Learn more about our mission, vision, and the team dedicated to helping you navigate your career path."
        icon={Info}
      />

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            At Proxima AI, our mission is to empower individuals with the tools, insights, and guidance needed to confidently navigate their career journeys. We believe that everyone deserves access to personalized career coaching and resources to achieve their professional aspirations.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-primary" />
            Our Vision
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            We envision a world where career development is accessible, intuitive, and tailored to each individual's unique strengths and goals. Proxima AI aims to be the leading platform for AI-driven career guidance, fostering a community of supported and successful professionals.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            The Team (Placeholder)
          </CardTitle>
          <CardDescription>
            Meet the passionate individuals behind Proxima AI.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/30 rounded-md">
            <Image
              src="https://placehold.co/400x300.png"
              alt="Team Placeholder Image"
              width={400}
              height={300}
              data-ai-hint="team meeting"
              className="rounded-lg shadow-md md:w-1/3"
            />
            <div className="md:w-2/3">
              <p className="text-muted-foreground">
                We are a diverse team of innovators, developers, career coaches, and AI enthusiasts dedicated to building the next generation of career development tools. Our combined expertise allows us to create a platform that is both technologically advanced and deeply human-centric. 
              </p>
              <p className="text-muted-foreground mt-2">
                (More detailed team member profiles and information would go here.)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Have questions or feedback? We&apos;d love to hear from you!
            <br />
            (Placeholder for contact information or a contact form)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
