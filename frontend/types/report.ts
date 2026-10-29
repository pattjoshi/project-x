export interface ReportJob {
  id: string;
  type: string;
  status: "pending" | "completed" | "failed";
  output: { report?: string; error?: string } | null;
}
