"use client"; // Add this at the very top so we can use hooks

import { useFormStatus } from "react-dom"; // Import this hook
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "../../app/(public)/(auth)/signup/action";

// 1. Create a "smart" button component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={pending} // Disables button immediately on click
    >
      {pending ? "Creating account..." : "Sign up"}
    </Button>
  );
}

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {/* 2. Move the action here */}
          <form action={signup}> 
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" name="password" minLength={6} type="password" required />
              </div>
              <div className="flex flex-col gap-3">
                {/* 3. Use the smart button here */}
                <SubmitButton /> 
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}