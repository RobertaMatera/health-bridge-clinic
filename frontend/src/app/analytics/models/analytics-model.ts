export interface WeeklyCount {
  /** Monday of the week, ISO date (yyyy-MM-dd). */
  weekStart: string;
  count: number;
}

export interface Analytics {
  createdReports: number;
  inProgressReports: number;
  finalizedReports: number;
  totalReports: number;
  /** Reports still CREATED more than 2 days after creation. */
  staleCreatedReports: number;

  totalUsers: number;
  totalPatients: number;
  totalDoctors: number;

  /** Null when no report has been finalized yet. */
  averageMinutesInProgress: number | null;
  totalExams: number;
  outOfRangeExams: number;
  reportsPerWeek: WeeklyCount[];
}
