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
import { useForm, Controller } from "react-hook-form";
import { createProfile } from "@/app/(auth)/signup/profile/actions";

type Language = {
  id: string;
  name: string;
};

export type FormVals = {
  firstName: string;
  lastName: string;
  timezone: string;
  nativeLanguage: "" | "English" | "Spanish";
  targetLanguage: "" | "English" | "Spanish";
  targetLevel: "" | "beginner" | "intermediate" | "advanced";
};

export function ProfileForm({
  className,
  languages,
  ...props
}: React.ComponentProps<"div"> & { languages: Language[] }) {
  const { options } = useTimezoneSelect({
    labelStyle: "original",
    timezones: {
      ...allTimezones,
      // Eastern Time (NYC, Miami, Atlanta)
      "America/New_York": "New York, Miami, Atlanta",
      // Central Time (Chicago, Austin)
      "America/Chicago": "Chicago, Austin, Minneapolis",
      // Pacific Time (LA, Seattle)
      "America/Los_Angeles": "Los Angeles, Seattle, Portland",
    },
  });

  const { handleSubmit, control, register, watch, formState } = useForm<FormVals>({
    defaultValues: {
      // populate defaults here if you have user profile data
      nativeLanguage: "",
      targetLanguage: "",
      targetLevel: "",
      timezone: "",
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = async (data: FormVals) => {
    console.log("data", data);
    if (data.nativeLanguage === data.targetLanguage) {
      window.alert("cant select same language");
      return;
    } else {
      await createProfile(data);
      window.alert("profile made!!");
      // supabase.console.log("data", data);
      // post data to DB
    }
  };

  const targetLevel = watch("targetLevel");

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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">
                    First Name<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    // required
                    {...register("firstName", { required: true })}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName">
                    Last Name<span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    required
                    {...register("lastName", { required: true })}
                  />
                </div>
              </div>

              {/* Timezone */}
              <div className="grid gap-3">
                <Label htmlFor="timezone">
                  Time Zone<span className="text-red-600">*</span>
                </Label>
                <Controller
                  name="timezone"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Your time zone" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Native language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label>
                    Native Language<span className="text-red-600">*</span>
                  </Label>
                  <Controller
                    name="nativeLanguage"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Your native language" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem value={language.id}>{language.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Target language */}
                <div className="grid gap-3">
                  <Label>
                    Target Language<span className="text-red-600">*</span>
                  </Label>
                  <Controller
                    name="targetLanguage"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Language you want to learn" />
                        </SelectTrigger>
                        <SelectContent>
                          {languages.map((language) => (
                            <SelectItem value={language.id}>{language.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              {/* Level */}
              <div className="grid gap-3">
                <Label htmlFor="targetLevel"> What’s your level in your target language?</Label>
                {targetLevel === "beginner" && (
                  <p className="text-sm text-amber-600 mt-1/2">
                    We focus on intermediate+ conversations. You can sign up, but we recommend
                    building basic skills first before booking sessions.
                  </p>
                )}
                <Controller
                  name="targetLevel"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="What's your level?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (A1-A2)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (B1-B2)</SelectItem>
                        <SelectItem value="advanced">Advanced (C1-C2)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={!formState.isValid}>
                Complete Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
