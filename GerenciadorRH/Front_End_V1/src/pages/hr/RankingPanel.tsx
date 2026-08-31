import { Trophy, Star } from "lucide-react";
import type { Job } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { Loading } from "../../components/ui/Loading";
import { useJobRanking } from "../../hooks/useJobRanking";

export function RankingPanel({ job, onClose }: { job: Job; onClose: () => void }) {
  const { ranking, loading } = useJobRanking(job.id);

  const minExpLabel =
    job.minExperienceMonths >= 12 ? `${Math.floor(job.minExperienceMonths / 12)}a` : `${job.minExperienceMonths}m`;

  return (
    <Modal
      title="Ranking de Candidatos"
      subtitle={`${job.title} · mín. ${minExpLabel} de exp.`}
      icon={<Trophy size={15} className="text-amber" />}
      onClose={onClose}
      maxWidth="max-w-xl"
    >
      <div className="max-h-[60vh] overflow-y-auto divide-y divide-line">
        {loading ? (
          <Loading label="Calculando ranking..." />
        ) : ranking.length === 0 ? (
          <p className="text-center text-sm text-muted py-10">Nenhum candidato nesta vaga ainda.</p>
        ) : (
          ranking.map((item, i) => (
            <div key={item.applicationId} className={`flex items-center gap-3 px-5 py-3.5 ${!item.qualified ? "opacity-60" : ""}`}>
              <span
                className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${
                  i < 3 && item.qualified ? "bg-amber-soft text-amber" : "bg-stone-100 text-stone-500"
                }`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.candidateName}</p>
                <p className="text-xs text-muted">
                  {item.experienceLabel} · {item.candidatePosition}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star size={11} className={item.qualified ? "text-accent" : "text-danger"} />
                  <span className={`text-xs font-semibold ${item.qualified ? "text-accent-dark" : "text-danger"}`}>{item.months}m</span>
                </div>
                {!item.qualified && <p className="text-[10px] text-danger">abaixo do mínimo</p>}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
}
