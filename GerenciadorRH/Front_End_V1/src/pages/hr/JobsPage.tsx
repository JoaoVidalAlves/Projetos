import { useState, useMemo } from "react";
import { Plus, Search, Trophy, MapPin, Users, Calendar } from "lucide-react";
import { useAppData } from "../../hooks/useAppData";
import { JobStatusBadge, ModalityBadge } from "../../components/domain";
import { FileTab } from "../../components/domain/FileTab";
import { Loading } from "../../components/ui/Loading";
import { Button } from "../../components/ui/Button";
import { JobModal } from "./JobModal";
import { RankingPanel } from "./RankingPanel";
import { formatDate } from "../../utils/formatters";
import type { Job, JobStatus } from "../../types";

export default function JobsPage() {
  const { jobs, createJob, updateJob, loading } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
  const [modalJob, setModalJob] = useState<Job | null | "new">(null);
  const [rankingJob, setRankingJob] = useState<Job | null>(null);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter && j.status !== statusFilter) return false;
      return true;
    });
  }, [jobs, search, statusFilter]);

  if (loading) return <Loading label="Carregando vagas..." />;

  return (
    <div>
      {modalJob !== null && (
        <JobModal job={modalJob === "new" ? null : modalJob} onClose={() => setModalJob(null)} onCreate={createJob} onUpdate={updateJob} />
      )}
      {rankingJob && <RankingPanel job={rankingJob} onClose={() => setRankingJob(null)} />}

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display text-xl font-semibold">Vagas</h1>
          <p className="text-xs text-muted">
            {jobs.length} vagas · {filtered.length} exibidas
          </p>
        </div>
        <Button size="sm" onClick={() => setModalJob("new")}>
          <Plus size={14} />
          Nova vaga
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="relative flex-1 min-w-[12rem]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar vaga..."
            className="w-full pl-8 pr-3 py-2 text-xs border border-line rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as JobStatus | "")}
          className="text-xs border border-line rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Todos os status</option>
          <option>Aberta</option>
          <option>Em Processo</option>
          <option>Encerrada</option>
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((job) => (
          <div key={job.id} className="relative bg-white border border-line rounded-sm p-5 flex flex-col">
            <FileTab className="border-line text-muted">{job.department}</FileTab>

            <div className="flex items-start justify-between mb-2 pr-8">
              <h3 className="font-display font-semibold text-sm truncate">{job.title}</h3>
              <JobStatusBadge status={job.status} />
            </div>

            <div className="space-y-1 mb-4 flex-1">
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <MapPin size={11} />
                {job.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Users size={11} />
                {job.openings} vaga{job.openings > 1 ? "s" : ""} · {job.candidatesCount} candidatos
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Calendar size={11} />
                {formatDate(job.postedDate)}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mb-4">
              <ModalityBadge modality={job.modality} />
              <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-sm font-medium">{job.type}</span>
              <span className="text-xs bg-info-soft text-info px-2 py-0.5 rounded-sm font-medium ml-auto">mín. {job.minExperienceMonths}m</span>
            </div>

            <div className="flex gap-2 pt-3 border-t border-line">
              <button
                onClick={() => setRankingJob(job)}
                className="flex-1 text-xs py-1.5 border border-line rounded-sm hover:bg-paper transition-colors flex items-center justify-center gap-1"
              >
                <Trophy size={12} className="text-amber" />
                Ranking
              </button>
              <button onClick={() => setModalJob(job)} className="flex-1 text-xs py-1.5 border border-line rounded-sm hover:bg-paper transition-colors">
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
