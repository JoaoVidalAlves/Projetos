import { useState } from "react";
import { ChevronDown, ChevronUp, Briefcase, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { useAppData } from "../../context";
import { StatusBadge, ModalityBadge } from "../../components/Shared";
import { formatDate } from "../../data";
import type { Candidatura } from "../../types";

function HistoricoTimeline({ historico }: { historico: Candidatura["historico"] }) {
  return (
    <div className="mt-4 pt-4 border-t border-border">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico do processo</p>
      <div className="space-y-3">
        {[...historico].reverse().map((h, i) => (
          <div key={h.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${i === 0 ? "bg-[#00C566]" : "bg-slate-300"}`} />
              {i < historico.length - 1 && <div className="w-px h-4 bg-slate-200 mt-1" />}
            </div>
            <div>
              <StatusBadge status={h.status} />
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{formatDate(h.data)}</span>
                <span className="text-[10px] text-muted-foreground">· {h.alteradoPor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CandidaturasPage() {
  const { myCandidaturas, jobs } = useAppData();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (myCandidaturas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Briefcase size={48} className="text-muted-foreground opacity-20 mb-4" />
        <h2 className="font-display text-xl font-semibold mb-2">Nenhuma candidatura ainda</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Explore as vagas abertas e candidate-se para acompanhar seu progresso aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Minhas Candidaturas</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {myCandidaturas.length} candidatura{myCandidaturas.length > 1 ? "s" : ""} registrada{myCandidaturas.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {myCandidaturas.map((candidatura) => {
          const job = jobs.find((j) => j.id === candidatura.vagaId);
          const isOpen = expanded === candidatura.id;

          return (
            <div key={candidatura.id} className="bg-white border border-border rounded">
              <button
                className="w-full text-left p-5 flex items-start gap-4"
                onClick={() => setExpanded(isOpen ? null : candidatura.id)}
              >
                <div className="w-10 h-10 rounded bg-[#00C566]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Briefcase size={18} className="text-[#00C566]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm truncate">{job?.title ?? "Vaga removida"}</p>
                      <p className="text-xs text-muted-foreground">{job?.department}</p>
                    </div>
                    <StatusBadge status={candidatura.status} />
                  </div>

                  {job && (
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin size={11} />{job.location}
                      </span>
                      <ModalityBadge modality={job.modality} />
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={11} />Candidatura em {formatDate(candidatura.dataCandidatura)}
                      </span>
                    </div>
                  )}

                  {candidatura.status === "Aprovado" && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-700">
                      <CheckCircle2 size={13} />
                      Parabéns! Você foi aprovado nesta seleção.
                    </div>
                  )}
                </div>

                <div className="flex-shrink-0 mt-1">
                  {isOpen ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5">
                  <HistoricoTimeline historico={candidatura.historico} />
                  {candidatura.observacoes && (
                    <p className="mt-3 text-xs text-muted-foreground italic">"{candidatura.observacoes}"</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
