import { ProfileForm } from "@/components/auth/profile-form";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-lg">
        <ProfileForm />
      </div>
    </div>
  );
}
