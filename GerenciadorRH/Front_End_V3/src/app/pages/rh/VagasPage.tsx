import { useState, useMemo } from "react";
import { Plus, Search, X, Trophy, Star, MapPin, Users, Calendar } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppData } from "../../context";
import { JobStatusBadge, ModalityBadge } from "../../components/Shared";
import { DEPARTMENTS, MODALITIES, JOB_TYPES, formatDate, getExpMonths } from "../../data";
import type { Job, JobStatus } from "../../types";
import { toast } from "sonner";

// ---- Create/Edit Modal ----
interface JobFormData {
  title: string;
  department: string;
  location: string;
  modality: string;
  type: string;
  openings: number;
  status: JobStatus;
  experienciaMinimaMeses: number;
  description: string;
  skills: string;
}

function JobModal({ job, onClose, onCreate, onUpdate }: {
  job: Job | null;
  onClose: () => void;
  onCreate: (data: Omit<Job, "id" | "candidates" | "postedDate">) => void;
  onUpdate: (id: string, data: Partial<Omit<Job, "id" | "candidates" | "postedDate">>) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<JobFormData>({
    defaultValues: job ? {
      title: job.title, department: job.department, location: job.location,
      modality: job.modality, type: job.type, openings: job.openings,
      status: job.status, experienciaMinimaMeses: job.experienciaMinimaMeses,
      description: job.description ?? "", skills: (job.skills ?? []).join(", "),
    } : { status: "Aberta", modality: "Híbrido", type: "CLT", openings: 1, experienciaMinimaMeses: 24 },
  });

  function onSubmit(data: JobFormData) {
    const payload = {
      ...data,
      openings: Number(data.openings),
      experienciaMinimaMeses: Number(data.experienciaMinimaMeses),
      skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (job) {
      onUpdate(job.id, payload);
      toast.success("Vaga atualizada com sucesso!");
    } else {
      onCreate(payload);
      toast.success("Vaga criada com sucesso!");
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold">{job ? "Editar vaga" : "Nova vaga"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Título da vaga</label>
            <input {...register("title", { required: true })} className="field" placeholder="Ex: Desenvolvedor Frontend" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Departamento</label>
              <select {...register("department", { required: true })} className="field">
                <option value="">Selecione</option>
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Localização</label>
              <input {...register("location", { required: true })} className="field" placeholder="São Paulo, SP" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Modalidade</label>
              <select {...register("modality")} className="field">
                {MODALITIES.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Contrato</label>
              <select {...register("type")} className="field">
                {JOB_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Vagas</label>
              <input type="number" min={1} {...register("openings")} className="field" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Status</label>
              <select {...register("status")} className="field">
                <option>Aberta</option><option>Em Processo</option><option>Encerrada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Exp. mínima (meses)</label>
              <input type="number" min={0} {...register("experienciaMinimaMeses")} className="field" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Habilidades (separadas por vírgula)</label>
            <input {...register("skills")} className="field" placeholder="React, TypeScript, CSS" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Descrição</label>
            <textarea {...register("description")} rows={3} className="field resize-none" placeholder="Descreva a vaga..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-border rounded text-sm hover:bg-muted transition-colors">
              Cancelar
            </button>
            <button type="submit" className="flex-1 py-2 bg-[#00C566] text-white rounded text-sm font-medium hover:bg-[#00B05A] transition-colors">
              {job ? "Salvar alterações" : "Criar vaga"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Ranking Panel ----
function RankingPanel({ job, onClose }: { job: Job; onClose: () => void }) {
  const { candidates, candidaturas } = useAppData();
  const applicants = candidaturas.filter((c) => c.vagaId === job.id);
  const ranked = useMemo(() => {
    return applicants
      .map((c) => {
        const candidate = candidates.find((cd) => cd.id === c.candidatoId);
        if (!candidate) return null;
        const months = getExpMonths(candidate.experience);
        return { candidatura: c, candidate, months, qualified: months >= job.experienciaMinimaMeses };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a!.qualified && !b!.qualified) return -1;
        if (!a!.qualified && b!.qualified) return 1;
        return b!.months - a!.months;
      });
  }, [applicants, candidates, job.experienciaMinimaMeses]);

  const minExp = job.experienciaMinimaMeses >= 12
    ? `${Math.floor(job.experienciaMinimaMeses / 12)}a`
    : `${job.experienciaMinimaMeses}m`;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <div className="flex items-center gap-2">
              <Trophy size={15} className="text-amber-500" />
              <h2 className="font-display font-semibold text-sm">Ranking de Candidatos</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{job.title} · mín. {minExp} de exp.</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {ranked.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-10">Nenhum candidato nesta vaga ainda.</p>
          ) : ranked.map((item, i) => (
            <div key={item!.candidatura.id} className={`flex items-center gap-3 px-5 py-3.5 ${!item!.qualified ? "opacity-60" : ""}`}>
              <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 ${i < 3 && item!.qualified ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item!.candidate.name}</p>
                <p className="text-xs text-muted-foreground">{item!.candidate.experience} · {item!.candidate.position}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <Star size={11} className={item!.qualified ? "text-[#00C566]" : "text-red-400"} />
                  <span className={`text-xs font-semibold ${item!.qualified ? "text-[#00C566]" : "text-red-500"}`}>
                    {item!.months}m
                  </span>
                </div>
                {!item!.qualified && <p className="text-[10px] text-red-400">abaixo do mínimo</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function VagasPage() {
  const { jobs, createJob, updateJob } = useAppData();
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

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Modals */}
      {modalJob !== null && (
        <JobModal
          job={modalJob === "new" ? null : modalJob}
          onClose={() => setModalJob(null)}
          onCreate={createJob}
          onUpdate={updateJob}
        />
      )}
      {rankingJob && <RankingPanel job={rankingJob} onClose={() => setRankingJob(null)} />}

      <div className="p-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display text-xl font-semibold">Vagas</h1>
            <p className="text-xs text-muted-foreground">{jobs.length} vagas · {filtered.length} exibidas</p>
          </div>
          <button
            onClick={() => setModalJob("new")}
            className="flex items-center gap-1.5 bg-[#00C566] hover:bg-[#00B05A] text-white text-xs font-medium px-3.5 py-2 rounded transition-colors"
          >
            <Plus size={14} />
            Nova vaga
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar vaga..."
              className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-[#00C566]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as JobStatus | "")}
            className="text-xs border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
          >
            <option value="">Todos os status</option>
            <option>Aberta</option><option>Em Processo</option><option>Encerrada</option>
          </select>
        </div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white border border-border rounded p-5 flex flex-col">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-2">
                  <p className="text-xs text-muted-foreground">{job.department}</p>
                  <h3 className="font-display font-semibold text-sm mt-0.5 truncate">{job.title}</h3>
                </div>
                <JobStatusBadge status={job.status} />
              </div>

              <div className="space-y-1 mb-4 flex-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin size={11} />{job.location}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Users size={11} />{job.openings} vaga{job.openings > 1 ? "s" : ""} · {job.candidates} candidatos
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar size={11} />{formatDate(job.postedDate)}
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <ModalityBadge modality={job.modality} />
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">{job.type}</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium ml-auto">
                  mín. {job.experienciaMinimaMeses}m
                </span>
              </div>

              <div className="flex gap-2 pt-3 border-t border-border">
                <button
                  onClick={() => setRankingJob(job)}
                  className="flex-1 text-xs py-1.5 border border-border rounded hover:bg-muted transition-colors flex items-center justify-center gap-1"
                >
                  <Trophy size={12} className="text-amber-500" />
                  Ranking
                </button>
                <button
                  onClick={() => setModalJob(job)}
                  className="flex-1 text-xs py-1.5 border border-border rounded hover:bg-muted transition-colors"
                >
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field styles via inline style block workaround */}
      <style>{`.field { width: 100%; border: 1px solid var(--border); border-radius: 0.25rem; padding: 0.375rem 0.75rem; font-size: 0.75rem; color: var(--foreground); outline: none; } .field:focus { box-shadow: 0 0 0 1px #00C566; border-color: #00C566; }`}</style>
    </div>
  );
}
