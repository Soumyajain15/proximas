
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2, Compass, KeyRound, Mail } from "lucide-react";

const loginFormSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."), // Min 1 to allow submit, Firebase handles length
});

type LoginFormDataType = z.infer<typeof loginFormSchema>;

const forgotPasswordFormSchema = z.object({
  resetEmail: z.string().email("Please enter a valid email address."),
});
type ForgotPasswordFormDataType = z.infer<typeof forgotPasswordFormSchema>;

export default function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false);

  const { login, user, loading: authLoading, sendPasswordReset, firebaseAuthInstance } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const defaultTestEmail = "test@example.com";
  const defaultTestPassword = "password123";

  const loginForm = useForm<LoginFormDataType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { 
      email: defaultTestEmail,
      password: defaultTestPassword,
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormDataType>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: { resetEmail: "" },
  });

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/dashboard");
    }
  }, [user, authLoading, router]);

  const onLoginSubmit: SubmitHandler<LoginFormDataType> = async (data) => {
    setIsLoggingIn(true);
    if (!firebaseAuthInstance) {
      toast({
        title: "Login System Error",
        description: "Firebase is not properly configured. Please contact support or check application setup.",
        variant: "destructive",
      });
      setIsLoggingIn(false);
      return;
    }
    try {
      await login(data.email, data.password);
      toast({ title: "Login Successful!", description: "Welcome back." });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      let title = "Login Failed";
      let description = "An unexpected error occurred. Please try again.";
      if (error.code) { // Likely a Firebase error
        title = "Login Error";
        description = `${error.message.replace("Firebase: ", "")} (Code: ${error.code})`;
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const onForgotPasswordSubmit: SubmitHandler<ForgotPasswordFormDataType> = async (data) => {
    setIsSendingReset(true);
    if (!firebaseAuthInstance) {
      toast({
        title: "Password Reset Error",
        description: "Firebase is not properly configured. Cannot send reset email.",
        variant: "destructive",
      });
      setIsSendingReset(false);
      return;
    }
    try {
      await sendPasswordReset(data.resetEmail);
      toast({
        title: "Password Reset Email Sent",
        description: "If an account exists for this email, a reset link has been sent. Please check your inbox (and spam folder).",
      });
      setForgotPasswordDialogOpen(false); 
      forgotPasswordForm.reset(); 
    } catch (error: any) {
      console.error("Forgot password error:", error);
      let title = "Reset Failed";
      let description = "Failed to send password reset email. Please try again.";
       if (error.code) { // Likely a Firebase error
        title = "Password Reset Error";
        description = `${error.message.replace("Firebase: ", "")} (Code: ${error.code})`;
      } else if (error.message) {
        description = error.message;
      }
      toast({
        title: title,
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsSendingReset(false);
    }
  };
  
  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <Compass className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your CareerCompass AI dashboard. (Test: {defaultTestEmail} / {defaultTestPassword})</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center justify-between">
                <Dialog open={forgotPasswordDialogOpen} onOpenChange={setForgotPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" type="button" className="px-0 text-sm text-primary hover:underline">
                      Forgot Password?
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <KeyRound className="h-5 w-5 text-primary" /> Reset Your Password
                      </DialogTitle>
                      <DialogDescription>
                        Enter your email address below and we'll send you a link to reset your password.
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...forgotPasswordForm}>
                      <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4 pt-2">
                        <FormField
                          control={forgotPasswordForm.control}
                          name="resetEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                  <Input type="email" placeholder="you@example.com" {...field} className="pl-10"/>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <DialogFooter className="sm:justify-start">
                           <Button type="submit" disabled={isSendingReset} className="w-full bg-primary hover:bg-primary/90">
                            {isSendingReset ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : (
                              "Send Reset Link"
                            )}
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <Button type="submit" disabled={isLoggingIn} className="w-full bg-primary hover:bg-primary/90">
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
