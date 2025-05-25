
"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, HelpCircle, MessageSquare, FileText, Navigation, BookOpen, User, Send, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
// Import only the types and the async function
import { chatWithAI, type ChatInput, type ChatOutput } from "@/ai/flows/ai-conversational-chat";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Capability {
  title: string;
  description: string;
  icon: LucideIcon;
}

const capabilities: Capability[] = [
  {
    title: "Instant Career Queries",
    description: "Ask questions about job roles, required skills, career paths, certifications, and more—and get precise, AI-powered responses in real-time.",
    icon: HelpCircle,
  },
  {
    title: "Interview Practice Bot",
    description: "Engage in simulated mock interviews with the chatbot and receive feedback on your answers, tone, and structure.",
    icon: MessageSquare,
  },
  {
    title: "Resume and Profile Support",
    description: "Get tips on optimizing your resume, LinkedIn profile, and portfolio for better visibility and impact.",
    icon: FileText,
  },
  {
    title: "Platform Navigation Help",
    description: "Easily explore CareerCompass AI’s features with chatbot assistance guiding you through career tools, resources, and community features.",
    icon: Navigation,
  },
  {
    title: "Learning Recommendations",
    description: "Based on your profile and career goals, the chatbot suggests relevant courses, articles, and tutorials to help you upskill.",
    icon: BookOpen,
  },
];

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

type GenkitHistoryMessage = {
  role: "user" | "model";
  parts: { text: string }[];
};


export default function AIChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial-ai-greeting', role: 'ai', content: "Hello! I'm CareerCompass AI. How can I help you with your career journey today?" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
   const messagesEndRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessageContent = inputValue.trim();
    const newUserMessage: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: userMessageContent,
    };
    
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    const genkitHistory: GenkitHistoryMessage[] = messages
      .filter(msg => msg.id !== 'initial-ai-greeting') // Exclude initial greeting from history sent to AI
      .map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
    
    // Add the current user message to the history being sent if it's not the only message
    // (initial state already has AI greeting)
    if (genkitHistory.length > 0 || messages.length > 1) {
       // genkitHistory.push({role: 'user', parts: [{text: userMessageContent}]});
       // The userMessageContent is passed as `userInput` to the flow, no need to add to history array being passed
    }


    try {
      const aiInput: ChatInput = {
        userInput: userMessageContent,
        history: genkitHistory,
      };
      const result: ChatOutput = await chatWithAI(aiInput);
      const cleanedAiResponse = result.aiResponse.replace(/\*/g, ''); // Remove all asterisks
      const newAiMessage: Message = {
        id: Date.now().toString() + "-ai",
        role: "ai",
        content: cleanedAiResponse,
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error: any) {
      console.error("Error calling AI chat flow:", error);
      const errorMessage = error instanceof Error ? error.message : "Could not get a response from the AI. Please try again.";
      toast({
        title: "Chatbot Error",
        description: errorMessage,
        variant: "destructive",
      });
       // Remove the optimistically added user message on error
       setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== newUserMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Chatbot – Your 24/7 Virtual Career Assistant"
        description="An intelligent virtual assistant integrated into the platform to provide instant, personalized support around the clock. It helps users navigate their career journey with ease, offering timely answers, guidance, and actionable suggestions."
        icon={Bot}
      />

      <Card className="shadow-lg mt-8 flex flex-col h-[calc(100vh-280px)] min-h-[500px] max-h-[700px]">
        <CardHeader className="shrink-0">
          <CardTitle>Interact with CareerCompass AI</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            <div className="space-y-4 pr-2"> {/* Added pr-2 for scrollbar spacing */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-end gap-2 w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "ai" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-3 text-sm shadow-md break-words",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border" // Use card and border for AI for better theme adapt
                    )}
                  >
                    {/* Preserve newlines in AI responses */}
                    {message.content.split('\\n').map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  {message.role === "user" && (
                     <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        <User size={18} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
               {isLoading && (
                <div className="flex items-end gap-2 justify-start w-full">
                   <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot size={18} />
                      </AvatarFallback>
                    </Avatar>
                  <div className="max-w-[75%] rounded-lg p-3 text-sm shadow-md bg-card border">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
            </div>
          </ScrollArea>
          <div className="p-4 border-t shrink-0">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Ask about careers, skills, or get advice..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow"
                disabled={isLoading}
                aria-label="Chat input"
              />
              <Button type="submit" disabled={isLoading || !inputValue.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Key Capabilities section moved below the chat for better focus */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Key Capabilities (Reference)</CardTitle>
          <CardDescription>
            The AI is designed to help with areas like these. Built with natural language processing (NLP), the chatbot ensures seamless, human-like interaction, offering a smart and responsive user experience to make career development more accessible and efficient.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {capabilities.map((capability, index) => (
            <Card key={index} className="bg-background/50">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-3">
                <div className="p-2.5 rounded-full bg-primary/10 text-primary shrink-0">
                  <capability.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{capability.description}</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
