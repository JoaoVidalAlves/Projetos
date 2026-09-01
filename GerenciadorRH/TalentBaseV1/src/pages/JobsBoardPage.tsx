import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Clock, Users, ChevronRight, Briefcase, Filter } from "lucide-react";
import { useAppData } from "../hooks/useAppData";
import { ModalityBadge } from "../components/domain";
import { FileTab } from "../components/domain/FileTab";
import { Loading } from "../components/ui/Loading";
import { formatDate } from "../utils/formatters";
import { DEPARTMENTS, MODALITIES, JOB_TYPES } from "../utils/domainOptions";

export default function JobsBoardPage() {
  const { jobs, loading } = useAppData();
  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("");
  const [modality, setModality] = useState("");
  const [type, setType] = useState("");

  const visibleJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (j.status === "Encerrada") return false;
      if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.department.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (dept && j.department !== dept) return false;
      if (modality && j.modality !== modality) return false;
      if (type && j.type !== type) return false;
      return true;
    });
  }, [jobs, search, dept, modality, type]);

  const hasFilters = Boolean(search || dept || modality || type);

  if (loading) return <Loading label="Carregando vagas..." />;

  return (
    <div>
      <div className="bg-ink py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {visibleJobs.length} vagas abertas
          </div>
          <h1 className="font-display text-4xl font-semibold text-white leading-tight mb-3">Encontre sua próxima oportunidade</h1>
          <p className="text-white/50 text-sm max-w-xl mx-auto mb-8">
            Vagas em tecnologia, marketing, gestão e muito mais. Candidate-se com um clique.
          </p>

          <div className="relative max-w-lg mx-auto">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Buscar por cargo ou área..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-sm px-4 py-3 pl-10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex items-center gap-1.5 text-xs text-muted shrink-0">
            <Filter size={13} />
            Filtros:
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={dept} onChange={(e) => setDept(e.target.value)} className="text-xs border border-line rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-accent">
              <option value="">Todas as áreas</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select value={modality} onChange={(e) => setModality(e.target.value)} className="text-xs border border-line rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-accent">
              <option value="">Modalidade</option>
              {MODALITIES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className="text-xs border border-line rounded-sm px-3 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-accent">
              <option value="">Contrato</option>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setDept("");
                  setModality("");
                  setType("");
                }}
                className="text-xs text-muted hover:text-ink transition-colors px-2"
              >
                Limpar filtros
              </button>
            )}
          </div>
          <div className="ml-auto text-xs text-muted">
            {visibleJobs.length} resultado{visibleJobs.length !== 1 ? "s" : ""}
          </div>
        </div>

        {visibleJobs.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Nenhuma vaga encontrada.</p>
            <p className="text-xs mt-1">Tente ajustar os filtros ou buscar por outros termos.</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleJobs.map((job) => (
              <Link
                key={job.id}
                to={`/vaga/${job.id}`}
                className="group relative flex flex-col bg-white border border-line rounded-sm p-5 hover:border-accent hover:shadow-sm transition-all"
              >
                <FileTab className="border-line text-muted group-hover:border-accent/40 group-hover:text-accent-dark transition-colors">
                  {job.department}
                </FileTab>

                <div className="mb-3">
                  <h3 className="font-display font-semibold text-base leading-snug group-hover:text-accent-dark transition-colors pr-8">
                    {job.title}
                  </h3>
                </div>

                <div className="space-y-1.5 mb-4 flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <MapPin size={12} />
                    {job.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Users size={12} />
                    {job.openings} vaga{job.openings > 1 ? "s" : ""} · {job.candidatesCount} candidato{job.candidatesCount !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted">
                    <Clock size={12} />
                    Publicada em {formatDate(job.postedDate)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-line">
                  <div className="flex items-center gap-1.5">
                    <ModalityBadge modality={job.modality} />
                    <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-sm font-medium">{job.type}</span>
                  </div>
                  <ChevronRight size={14} className="text-muted group-hover:text-accent transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
