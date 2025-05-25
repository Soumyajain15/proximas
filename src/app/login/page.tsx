
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Loader2, MailQuestion } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});
type LoginFormValues = z.infer<typeof loginFormSchema>;

const forgotPasswordSchema = z.object({
  resetEmail: z.string().email({ message: "Please enter a valid email address." }),
});
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login, sendPasswordReset, isFirebaseReady } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "test@example.com", // Hardcoded for testing
      password: "password123", // Hardcoded for testing
    },
  });

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      resetEmail: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    if (!isFirebaseReady) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please try again shortly.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({ title: "Login Successful!", description: "Welcome back!" });
      router.push("/dashboard");
    } catch (error: any) {
      const errorCode = error.code;
      let errorMessage = error.message;
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (errorCode) {
        errorMessage = `Login failed: ${errorCode}. Please try again.`;
      }
      toast({ title: "Login Failed", description: errorMessage, variant: "destructive" });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePasswordReset: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    if (!isFirebaseReady) {
      toast({ title: "System Error", description: "Authentication system is not ready. Please try again shortly.", variant: "destructive" });
      return;
    }
    setIsPasswordResetLoading(true);
    try {
      await sendPasswordReset(data.resetEmail);
      toast({ title: "Password Reset Email Sent", description: "If an account exists for this email, a password reset link has been sent." });
      setIsResetDialogOpen(false);
      forgotPasswordForm.reset();
    } catch (error: any) {
      toast({ title: "Password Reset Failed", description: error.message || "Could not send reset email.", variant: "destructive" });
      console.error("Password reset error:", error);
    } finally {
      setIsPasswordResetLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <LogIn className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription>
            Sign in to access your CareerCompass AI dashboard.
            <br />
            <span className="text-xs text-muted-foreground">(Test credentials: test@example.com / password123)</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
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
                control={form.control}
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
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading || !isFirebaseReady}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Login
              </Button>
            </form>
          </Form>
           <div className="mt-4 text-center text-sm">
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto text-primary hover:underline">
                  Forgot Password?
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2"><MailQuestion /> Reset Your Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address below and we&apos;ll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <Form {...forgotPasswordForm}>
                  <form onSubmit={forgotPasswordForm.handleSubmit(handlePasswordReset)} className="space-y-4 pt-2">
                    <FormField
                      control={forgotPasswordForm.control}
                      name="resetEmail"
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
                    <DialogFooter className="sm:justify-start">
                       <Button type="submit" disabled={isPasswordResetLoading || !isFirebaseReady} className="bg-primary hover:bg-primary/90">
                        {isPasswordResetLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Send Reset Link
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="ghost">
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign up here
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
