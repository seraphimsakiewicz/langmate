"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { useSessionsQuery } from "@/hooks/useSessionsQuery";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Users, UserRound } from "lucide-react";

export default function SessionsPage() {
  const { data, isLoading, isError, error, refetch } = useSessionsQuery();

  const upcomingSessions = useMemo(() => {
    if (!data) return [];
    const timezone = data.profile.timezone ?? "UTC";
    const now = DateTime.now().setZone(timezone);

    return data.sessions
      .map((session) => {
        const start = DateTime.fromISO(`${session.date}T${session.startTime}`, { zone: timezone });
        const end = start.plus({ minutes: 30 });
        return { session, start, end };
      })
      .filter(({ end }) => end > now)
      .sort((a, b) => a.start.toMillis() - b.start.toMillis());
  }, [data]);

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-muted-foreground text-sm">Loading your sessions...</p>;
    }

    if (isError) {
      return (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <div className="font-medium">Could not load sessions.</div>
          <p className="mt-1">{error instanceof Error ? error.message : "Please try again."}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium text-destructive transition hover:bg-destructive/10"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!data || upcomingSessions.length === 0) {
      return (
        <div className="rounded-lg border border-dashed bg-muted/10 p-8 text-center text-sm text-muted-foreground">
          <p className="font-medium text-foreground">No upcoming sessions</p>
          <p className="mt-1">Book a slot from the calendar to see it here.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {upcomingSessions.map(({ session, start, end }) => {
          const timezone = data.profile.timezone ?? "UTC";
          const isHost = session.user_one_id === data.profile.id;
          const isPartner = session.user_two_id === data.profile.id;
          const isBooked = Boolean(session.user_two_id);

          const statusLabel = isBooked
            ? isPartner
              ? "You're in"
              : isHost
                ? "Booked"
                : "Booked"
            : isHost
              ? "Awaiting partner"
              : "Open seat";

          const statusTone = isBooked
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200";

          const displayName = (
            name?: { first_name: string | null; last_name: string | null } | null
          ) => [name?.first_name, name?.last_name].filter(Boolean).join(" ").trim() || "Member";

          const partnerName = session.user_two_id
            ? isPartner
              ? "You"
              : displayName(session.user_two_name)
            : null;

          return (
            <Card key={session.id}>
              <CardHeader className="space-y-2 pb-2">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{start.toFormat("cccc, LLL d")}</CardTitle>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}>
                    {statusLabel}
                  </span>
                </div>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {start.toFormat("HH:mm")} – {end.toFormat("HH:mm")} ({timezone})
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {partnerName ? (
                    <span className="text-foreground font-medium">Partner: {partnerName}</span>
                  ) : (
                    <span>Looking for a partner</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto flex h-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-foreground">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            Times shown in {data?.profile.timezone ?? "your timezone"}.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}
