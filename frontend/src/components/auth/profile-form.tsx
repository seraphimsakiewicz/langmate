import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
                <Select name="timezone" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC-12">UTC-12:00 (Baker Island)</SelectItem>
                    <SelectItem value="UTC-11">UTC-11:00 (Hawaii)</SelectItem>
                    <SelectItem value="UTC-10">UTC-10:00 (Alaska)</SelectItem>
                    <SelectItem value="UTC-9">UTC-09:00 (Pacific)</SelectItem>
                    <SelectItem value="UTC-8">UTC-08:00 (Mountain)</SelectItem>
                    <SelectItem value="UTC-7">UTC-07:00 (Central)</SelectItem>
                    <SelectItem value="UTC-6">UTC-06:00 (Eastern)</SelectItem>
                    <SelectItem value="UTC-5">UTC-05:00 (Atlantic)</SelectItem>
                    <SelectItem value="UTC+0">UTC+00:00 (London)</SelectItem>
                    <SelectItem value="UTC+1">UTC+01:00 (Paris)</SelectItem>
                    <SelectItem value="UTC+2">UTC+02:00 (Cairo)</SelectItem>
                    <SelectItem value="UTC+3">UTC+03:00 (Moscow)</SelectItem>
                    <SelectItem value="UTC+5">UTC+05:00 (Delhi)</SelectItem>
                    <SelectItem value="UTC+8">UTC+08:00 (Singapore)</SelectItem>
                    <SelectItem value="UTC+9">UTC+09:00 (Tokyo)</SelectItem>
                    <SelectItem value="UTC+12">UTC+12:00 (Auckland)</SelectItem>
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
