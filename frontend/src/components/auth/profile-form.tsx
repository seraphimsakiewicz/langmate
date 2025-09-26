"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTimezoneSelect, allTimezones } from "react-timezone-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProfileForm({ className, ...props }: React.ComponentProps<"div">) {
  const { options, parseTimezone } = useTimezoneSelect({
    labelStyle: "original", // or "altName", "abbrev", etc.
    timezones: allTimezones,
  });

  console.log("options", options);
  const timeOptions = [...options, Intl.DateTimeFormat().resolvedOptions().timeZone];

  console.log("timeOptions", timeOptions);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Tell us a bit about yourself to personalize your Langmate experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName">
                    Last Name<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="timezone">
                  Time Zone<span className="text-red-600">*</span>
                </Label>
                <Select
                  name="timezone"
                  required
                  onValueChange={(value) => {
                    console.log("value", value);
                    console.log("parseTimezone(value)", parseTimezone(value));
                    // parseTimezone(e.currentTarget.value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="nativeLanguage">
                    Native/Fluent Language<span className="text-red-600">*</span>
                  </Label>
                  <Select name="nativeLanguage" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your native language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="targetLanguage">
                    Target Language<span className="text-red-600">*</span>
                  </Label>
                  <Select name="targetLanguage" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Language you want to learn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Complete Sign Up
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
