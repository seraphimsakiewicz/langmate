"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export default function Page() {
  const posthog = usePostHog();

  // useEffect(() => {
  //   posthog.capture("signed_up");
  // }, []);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Check your email</CardTitle>
            <CardDescription>
              We've sent you a confirmation link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>Click the link in the email to confirm your new account.</p>
              <p className="mt-2">Don't see it? Check your spam folder.</p>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              Need help?{" "}
              <a
                href="mailto:hello@langmate.io"
                className="underline underline-offset-4 hover:text-primary"
              >
                Contact us
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
