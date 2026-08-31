import { useState } from "react";
import { ChevronDown, ChevronUp, Briefcase, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useAppData } from "../../hooks/useAppData";
import { StatusBadge, ModalityBadge } from "../../components/domain";
import { Loading } from "../../components/ui/Loading";
import { formatDate } from "../../utils/formatters";
import type { HistoryEntry } from "../../types";

function HistoryTimeline({ history }: { history: HistoryEntry[] }) {
  return (
    <div className="mt-4 pt-4 border-t border-line">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Histórico do processo</p>
      <div className="space-y-3">
        {[...history].reverse().map((h, i) => (
          <div key={h.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-accent" : "bg-stone-300"}`} />
              {i < history.length - 1 && <div className="w-px h-4 bg-stone-200 mt-1" />}
            </div>
            <div>
              <StatusBadge status={h.status} />
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted">{formatDate(h.date)}</span>
                <span className="text-[10px] text-muted">· {h.changedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ApplicationsPage() {
  const { myApplications, jobs, loading } = useAppData();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) return <Loading label="Carregando candidaturas..." />;

  if (myApplications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Briefcase size={48} className="text-muted opacity-20 mb-4" />
        <h2 className="font-display text-xl font-semibold mb-2">Nenhuma candidatura ainda</h2>
        <p className="text-sm text-muted max-w-xs">Explore as vagas abertas e candidate-se para acompanhar seu progresso aqui.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Minhas Candidaturas</h1>
        <p className="text-sm text-muted mt-0.5">
          {myApplications.length} candidatura{myApplications.length > 1 ? "s" : ""} registrada{myApplications.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {myApplications.map((application) => {
          const job = jobs.find((j) => j.id === application.jobId);
          const isOpen = expanded === application.id;

          return (
            <div key={application.id} className="bg-white border border-line rounded-sm">
              <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setExpanded(isOpen ? null : application.id)}>
                <div className="w-10 h-10 rounded-sm bg-accent-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Briefcase size={18} className="text-accent-dark" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm truncate">{job?.title ?? "Vaga removida"}</p>
                      <p className="text-xs text-muted">{job?.department}</p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>

                  {job && (
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <MapPin size={11} />
                        {job.location}
                      </span>
                      <ModalityBadge modality={job.modality} />
                      <span className="flex items-center gap-1 text-xs text-muted">
                        <Clock size={11} />
                        Candidatura em {formatDate(application.applicationDate)}
                      </span>
                    </div>
                  )}

                  {application.status === "Aprovado" && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-accent-dark">
                      <CheckCircle2 size={13} />
                      Parabéns! Você foi aprovado nesta seleção.
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 mt-1">
                  {isOpen ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  <HistoryTimeline history={application.history} />
                  {application.notes && <p className="mt-3 text-xs text-muted italic">"{application.notes}"</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
