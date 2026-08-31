import { useEffect, useState } from "react";
import { getJobRanking, type RankedApplicant } from "../services/vacancyService";

export function useJobRanking(jobId: string | null) {
  const [ranking, setRanking] = useState<RankedApplicant[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!jobId) {
      setRanking([]);
      return;
    }
    let active = true;
    setLoading(true);
    getJobRanking(jobId).then((result) => {
      if (active) {
        setRanking(result);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [jobId]);

  return { ranking, loading };
}
