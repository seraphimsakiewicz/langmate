export default async function LandingPage() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center py-24">
      <img src="/langmate-logo.svg" alt="Langmate logo" className="mb-4" />
      <div className="max-w-xl text-center">
        <h1 className="text-4xl font-bold text-primary tracking-tight sm:text-5xl">
          Practice languages with real people.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Build fluency together. Log in or sign up to start your next conversation.
        </p>
      </div>
    </main>
  );
}
