"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportJob } from "@/types/report";

const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 20;

export function CompatibilityReport({
  characterId,
  characterName,
}: {
  characterId: string;
  characterName: string;
}) {
  const [job, setJob] = useState<ReportJob | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pollJob = async (jobId: string, attempt: number) => {
    const res = await fetch(`/api/reports/jobs/${jobId}`);
    const data: ReportJob = await res.json();
    setJob(data);

    if (data.status === "pending" && attempt < MAX_POLLS) {
      setTimeout(() => pollJob(jobId, attempt + 1), POLL_INTERVAL_MS);
    } else if (data.status === "pending") {
      setError("Taking longer than expected. Try again in a bit.");
    }
  };

  const requestReport = async () => {
    setIsRequesting(true);
    setError(null);
    setJob(null);
    try {
      const res = await fetch(`/api/reports/${characterId}`, { method: "POST" });
      const data: ReportJob = await res.json();
      if (!res.ok) {
        setError("Something went wrong. Try again.");
        return;
      }
      setJob(data);
      void pollJob(data.id, 0);
    } catch {
      setError("Network error. Try again.");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={requestReport} disabled={isRequesting} className="w-fit">
        {isRequesting ? "Requesting..." : `Get ${characterName}'s compatibility report`}
      </Button>

      {job?.status === "pending" && (
        <p className="text-sm text-muted-foreground">Writing the report...</p>
      )}
      {job?.status === "completed" && job.output?.report && (
        <Card>
          <CardContent className="pt-2">
            <p className="leading-relaxed">{job.output.report}</p>
          </CardContent>
        </Card>
      )}
      {job?.status === "failed" && (
        <p className="text-sm text-destructive">Couldn&apos;t generate a report. Try again.</p>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
