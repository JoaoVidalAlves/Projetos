import { useState, useMemo } from "react";
import {
  LayoutDashboard, Users, Briefcase, FilePlus2,
  Search, Plus, X, MapPin, Calendar, Clock,
  CheckCircle2, ArrowUpRight, ChevronDown,
  Phone, Mail, Trash2, Trophy, Edit3, AlertTriangle, UserCheck
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// --- TYPES ---
type Status = "Novo" | "Em Análise" | "Entrevista" | "Aprovado" | "Reprovado";
type JobStatus = "Aberta" | "Em Processo" | "Encerrada";
type View = "dashboard" | "candidates" | "jobs" | "register";
type EditingJobState = { mode: "new" } | { mode: "edit"; job: Job };

interface Candidate {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  status: Status;
  appliedDate: string;
  experience: string;
  skills: string[];
  location: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  modality: string;
  openings: number;
  candidates: number;
  status: JobStatus;
  postedDate: string;
  type: string;
  experienciaMinimaMeses: number;
}

// --- SECTION 5.1 — Caminho B: faixa → meses ---
const EXP_TO_MONTHS: Record<string, number> = {
  "Menos de 1 ano": 6,
  "1 ano": 12,
  "2 anos": 24,
  "3 anos": 36,
  "4 anos": 48,
  "5 anos": 60,
  "6 anos": 72,
  "7 anos": 84,
  "8 anos": 96,
  "9 anos": 108,
  "10+ anos": 120,
};

function getExpMonths(exp: string): number {
  return EXP_TO_MONTHS[exp] ?? 0;
}

// --- DATA ---
const initialCandidates: Candidate[] = [
  { id: "1", name: "Ana Carolina Mendes", position: "Desenvolvedora Frontend", department: "Tecnologia", email: "ana.mendes@email.com", phone: "(11) 99234-5678", status: "Entrevista", appliedDate: "2026-08-12", experience: "4 anos", skills: ["React", "TypeScript", "CSS"], location: "São Paulo, SP" },
  { id: "2", name: "Bruno Ferreira Lima", position: "Gerente de Projetos", department: "Gestão", email: "bruno.lima@email.com", phone: "(21) 98765-4321", status: "Em Análise", appliedDate: "2026-08-10", experience: "7 anos", skills: ["Scrum", "MS Project", "PMBOK"], location: "Rio de Janeiro, RJ" },
  { id: "3", name: "Carla Oliveira Santos", position: "Analista de Marketing", department: "Marketing", email: "carla.santos@email.com", phone: "(31) 97654-3210", status: "Aprovado", appliedDate: "2026-08-05", experience: "3 anos", skills: ["SEO", "Google Ads", "Analytics"], location: "Belo Horizonte, MG" },
  { id: "4", name: "Diego Alves Costa", position: "Engenheiro de Backend", department: "Tecnologia", email: "diego.costa@email.com", phone: "(11) 96543-2109", status: "Novo", appliedDate: "2026-08-15", experience: "5 anos", skills: ["Node.js", "Python", "AWS"], location: "São Paulo, SP" },
  { id: "5", name: "Elisa Rodrigues Pinto", position: "Designer UX/UI", department: "Produto", email: "elisa.pinto@email.com", phone: "(41) 95432-1098", status: "Reprovado", appliedDate: "2026-08-01", experience: "2 anos", skills: ["Figma", "Sketch", "Prototipagem"], location: "Curitiba, PR" },
  { id: "6", name: "Felipe Nascimento Gomes", position: "Analista de Dados", department: "Tecnologia", email: "felipe.gomes@email.com", phone: "(85) 94321-0987", status: "Em Análise", appliedDate: "2026-08-08", experience: "6 anos", skills: ["Python", "SQL", "Power BI"], location: "Fortaleza, CE" },
  { id: "7", name: "Gabriela Teixeira Moura", position: "Analista de RH", department: "Recursos Humanos", email: "gabi.moura@email.com", phone: "(11) 93210-9876", status: "Entrevista", appliedDate: "2026-08-11", experience: "3 anos", skills: ["Recrutamento", "Treinamento", "CLT"], location: "São Paulo, SP" },
  { id: "8", name: "Henrique Barbosa Souza", position: "Desenvolvedor Mobile", department: "Tecnologia", email: "henrique.souza@email.com", phone: "(51) 92109-8765", status: "Novo", appliedDate: "2026-08-16", experience: "4 anos", skills: ["Flutter", "React Native", "Swift"], location: "Porto Alegre, RS" },
  { id: "9", name: "Isabela Monteiro Cruz", position: "Analista de Marketing", department: "Marketing", email: "isabela.cruz@email.com", phone: "(71) 91098-7654", status: "Em Análise", appliedDate: "2026-08-09", experience: "5 anos", skills: ["Content", "Social Media", "Branding"], location: "Salvador, BA" },
  { id: "10", name: "João Pedro Ramos Silva", position: "Engenheiro de Backend", department: "Tecnologia", email: "joao.silva@email.com", phone: "(61) 90987-6543", status: "Aprovado", appliedDate: "2026-08-03", experience: "8 anos", skills: ["Java", "Spring Boot", "Kafka"], location: "Brasília, DF" },
];

const initialJobs: Job[] = [
  { id: "1", title: "Desenvolvedora Frontend", department: "Tecnologia", location: "São Paulo, SP", modality: "Híbrido", openings: 2, candidates: 14, status: "Em Processo", postedDate: "2026-07-28", type: "CLT", experienciaMinimaMeses: 36 },
  { id: "2", title: "Gerente de Projetos", department: "Gestão", location: "Remoto", modality: "Remoto", openings: 1, candidates: 8, status: "Aberta", postedDate: "2026-08-05", type: "CLT", experienciaMinimaMeses: 60 },
  { id: "3", title: "Analista de Marketing", department: "Marketing", location: "Belo Horizonte, MG", modality: "Presencial", openings: 3, candidates: 22, status: "Em Processo", postedDate: "2026-07-20", type: "CLT", experienciaMinimaMeses: 24 },
  { id: "4", title: "Engenheiro de Backend", department: "Tecnologia", location: "Remoto", modality: "Remoto", openings: 2, candidates: 19, status: "Aberta", postedDate: "2026-08-10", type: "PJ", experienciaMinimaMeses: 48 },
  { id: "5", title: "Designer UX/UI", department: "Produto", location: "São Paulo, SP", modality: "Híbrido", openings: 1, candidates: 11, status: "Encerrada", postedDate: "2026-07-15", type: "CLT", experienciaMinimaMeses: 12 },
  { id: "6", title: "Analista de Dados", department: "Tecnologia", location: "Remoto", modality: "Remoto", openings: 2, candidates: 16, status: "Aberta", postedDate: "2026-08-12", type: "PJ", experienciaMinimaMeses: 60 },
  { id: "7", title: "Desenvolvedor Mobile", department: "Tecnologia", location: "Porto Alegre, RS", modality: "Presencial", openings: 1, candidates: 9, status: "Em Processo", postedDate: "2026-08-01", type: "CLT", experienciaMinimaMeses: 36 },
];

const hiringData = [
  { month: "Mar", candidatos: 24, contratados: 3 },
  { month: "Abr", candidatos: 31, contratados: 5 },
  { month: "Mai", candidatos: 28, contratados: 4 },
  { month: "Jun", candidatos: 38, contratados: 7 },
  { month: "Jul", candidatos: 45, contratados: 9 },
  { month: "Ago", candidatos: 52, contratados: 11 },
];

// --- CONFIGS ---
const STATUS_CONFIG: Record<Status, { badge: string; dot: string; label: string }> = {
  "Novo": { badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400", label: "Novo" },
  "Em Análise": { badge: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-400", label: "Em Análise" },
  "Entrevista": { badge: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500", label: "Entrevista" },
  "Aprovado": { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500", label: "Aprovado" },
  "Reprovado": { badge: "bg-red-50 text-red-600 border border-red-200", dot: "bg-red-500", label: "Reprovado" },
};

const JOB_STATUS_CONFIG: Record<JobStatus, { badge: string; dot: string }> = {
  "Aberta": { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  "Em Processo": { badge: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
  "Encerrada": { badge: "bg-slate-100 text-slate-500", dot: "bg-slate-400" },
};

const ALL_STATUSES: Status[] = ["Novo", "Em Análise", "Entrevista", "Aprovado", "Reprovado"];
const DEPARTMENTS = ["Tecnologia", "Marketing", "Gestão", "Produto", "Recursos Humanos", "Financeiro", "Comercial"];
const MODALITIES = ["Presencial", "Híbrido", "Remoto"];
const JOB_TYPES = ["CLT", "PJ", "Estágio", "Freelance"];

// --- HELPERS ---
function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
  const colors = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-amber-100 text-amber-700", "bg-emerald-100 text-emerald-700", "bg-rose-100 text-rose-700"];
  const idx = name.charCodeAt(0) % colors.length;
  const sz = size === "lg" ? "w-14 h-14 text-base" : size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-xs";
  return (
    <span className={`inline-flex items-center justify-center rounded-full font-semibold flex-shrink-0 ${sz} ${colors[idx]}`}>
      {initials}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function JobStatusBadge({ status }: { status: JobStatus }) {
  const cfg = JOB_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {status}
    </span>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded p-3 shadow-md text-xs">
        <p className="font-semibold mb-2 text-foreground">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="flex items-center gap-2 mb-0.5">
            <span className="font-medium capitalize" style={{ color: p.fill }}>{p.name}:</span>
            <span className="text-foreground font-semibold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- CANDIDATE DETAIL PANEL (novo — seção 2.2) ---
function CandidateDetailPanel({
  candidate,
  onClose,
  onStatusChange,
}: {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => void;
}) {
  const [statusDropdown, setStatusDropdown] = useState(false);
  const expMonths = getExpMonths(candidate.experience);

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-border z-40 flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-display text-lg font-semibold">Detalhe do Candidato</h2>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Profile header */}
          <div className="px-6 py-5 border-b border-border">
            <div className="flex items-center gap-4 mb-5">
              <Avatar name={candidate.name} size="lg" />
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{candidate.position}</p>
                <p className="text-xs text-muted-foreground">{candidate.department}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Status da candidatura</p>
              <div className="relative inline-block">
                <button
                  onClick={() => setStatusDropdown(!statusDropdown)}
                  className="flex items-center gap-1.5"
                >
                  <StatusBadge status={candidate.status} />
                  <ChevronDown size={11} className="text-muted-foreground" />
                </button>
                {statusDropdown && (
                  <div className="absolute left-0 top-full mt-1 z-10 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[150px]">
                    {ALL_STATUSES.map((s) => (
                      <button
                        key={s}
                        onClick={() => { onStatusChange(candidate.id, s); setStatusDropdown(false); }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Contato</p>
            <div className="space-y-2.5">
              <a
                href={`mailto:${candidate.email}`}
                className="flex items-center gap-2.5 text-sm hover:text-accent transition-colors"
              >
                <Mail size={13} className="text-muted-foreground flex-shrink-0" />
                <span className="truncate">{candidate.email}</span>
              </a>
              {candidate.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone size={13} className="text-muted-foreground flex-shrink-0" />
                  <span>{candidate.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2.5 text-sm">
                <MapPin size={13} className="text-muted-foreground flex-shrink-0" />
                <span>{candidate.location}</span>
              </div>
            </div>
          </div>

          {/* Experience — showing numeric months per section 5.1 */}
          <div className="px-6 py-4 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Experiência</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="font-display text-4xl font-bold leading-none">{expMonths}</p>
                <p className="text-xs text-muted-foreground mt-1">meses (faixa: {candidate.experience})</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Candidatou-se em</p>
                <p className="text-sm font-medium">{formatDate(candidate.appliedDate)}</p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {candidate.skills.length > 0 && (
            <div className="px-6 py-4 border-b border-border">
              <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-3">Habilidades</p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.skills.map((skill, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-foreground text-primary-foreground rounded font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status history */}
          <div className="px-6 py-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-4">Histórico de Status</p>
            <div className="relative pl-4">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 -ml-4 ring-2 ring-white ${STATUS_CONFIG["Novo"].dot}`} />
                  <div>
                    <p className="text-xs font-medium">Currículo recebido — Novo</p>
                    <p className="text-xs text-muted-foreground">{formatDate(candidate.appliedDate)}</p>
                  </div>
                </div>
                {candidate.status !== "Novo" && (
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 -ml-4 ring-2 ring-white ${STATUS_CONFIG[candidate.status].dot}`} />
                    <div>
                      <p className="text-xs font-medium">Status atualizado — {candidate.status}</p>
                      <p className="text-xs text-muted-foreground">Equipe de RH · TalentBase</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- CREATE / EDIT JOB MODAL (novo — seção 2.2) ---
function CreateEditJobModal({
  job,
  onClose,
  onSave,
}: {
  job: Job | null;
  onClose: () => void;
  onSave: (data: Omit<Job, "id" | "candidates" | "postedDate">) => void;
}) {
  const [form, setForm] = useState({
    title: job?.title ?? "",
    department: job?.department ?? "",
    location: job?.location ?? "",
    modality: job?.modality ?? "Presencial",
    type: job?.type ?? "CLT",
    openings: job?.openings ?? 1,
    status: (job?.status ?? "Aberta") as JobStatus,
    experienciaMinimaMeses: job?.experienciaMinimaMeses ?? 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string | number) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Título obrigatório";
    if (!form.department) e.department = "Departamento obrigatório";
    if (!form.location.trim()) e.location = "Localização obrigatória";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      title: form.title.trim(),
      department: form.department,
      location: form.location.trim(),
      modality: form.modality,
      type: form.type,
      openings: Number(form.openings),
      status: form.status,
      experienciaMinimaMeses: Number(form.experienciaMinimaMeses),
    });
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2 text-sm bg-muted border rounded focus:outline-none focus:bg-white transition-colors placeholder:text-muted-foreground ${errors[field] ? "border-red-400" : "border-transparent focus:border-foreground/20"}`;

  const selectCls = "appearance-none pr-8 w-full px-3 py-2 text-sm bg-muted border border-transparent rounded focus:outline-none focus:bg-white focus:border-foreground/20 transition-colors";

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-30" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4 pointer-events-none">
        <div className="bg-white rounded-lg border border-border shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide pointer-events-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
            <h2 className="font-display text-lg font-semibold">{job ? "Editar Vaga" : "Nova Vaga"}</h2>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors">
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                Título da Vaga <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Ex: Desenvolvedor Backend Senior"
                className={inputCls("title")}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                  Departamento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                    className={`${selectCls} ${errors.department ? "border border-red-400" : ""}`}
                  >
                    <option value="">Selecione...</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Tipo de contrato</label>
                <div className="relative">
                  <select value={form.type} onChange={(e) => set("type", e.target.value)} className={selectCls}>
                    {JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                  Localização <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="São Paulo, SP"
                  className={inputCls("location")}
                />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Modalidade</label>
                <div className="relative">
                  <select value={form.modality} onChange={(e) => set("modality", e.target.value)} className={selectCls}>
                    {MODALITIES.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Vagas disponíveis</label>
                <input
                  type="number"
                  min={1}
                  value={form.openings}
                  onChange={(e) => set("openings", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-muted border border-transparent rounded focus:outline-none focus:bg-white focus:border-foreground/20 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Status</label>
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={(e) => set("status", e.target.value as JobStatus)}
                    className={selectCls}
                  >
                    <option value="Aberta">Aberta</option>
                    <option value="Em Processo">Em Processo</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Exp mínima — alimenta o ranking da seção 5.3 */}
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Experiência mínima requerida</label>
              <div className="relative">
                <select
                  value={form.experienciaMinimaMeses}
                  onChange={(e) => set("experienciaMinimaMeses", Number(e.target.value))}
                  className={selectCls}
                >
                  <option value={0}>Sem requisito</option>
                  <option value={6}>Menos de 1 ano (6 meses)</option>
                  <option value={12}>1 ano (12 meses)</option>
                  <option value={24}>2 anos (24 meses)</option>
                  <option value={36}>3 anos (36 meses)</option>
                  <option value={48}>4 anos (48 meses)</option>
                  <option value={60}>5 anos (60 meses)</option>
                  <option value={72}>6 anos (72 meses)</option>
                  <option value={84}>7 anos (84 meses)</option>
                  <option value={96}>8 anos (96 meses)</option>
                  <option value={108}>9 anos (108 meses)</option>
                  <option value={120}>10+ anos (120 meses)</option>
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">Usado para ordenar o ranking de candidatos desta vaga.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-foreground text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity"
              >
                {job ? "Salvar alterações" : "Criar vaga"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// --- RANKING PANEL — seção 5.3 ---
function RankingPanel({
  job,
  candidates,
  onClose,
}: {
  job: Job;
  candidates: Candidate[];
  onClose: () => void;
}) {
  const ranked = useMemo(() => {
    return [...candidates]
      .map((c) => ({
        ...c,
        expMonths: getExpMonths(c.experience),
        atendeRequisito: job.experienciaMinimaMeses === 0 || getExpMonths(c.experience) >= job.experienciaMinimaMeses,
      }))
      .sort((a, b) => {
        if (a.atendeRequisito !== b.atendeRequisito) return a.atendeRequisito ? -1 : 1;
        return b.expMonths - a.expMonths;
      });
  }, [candidates, job]);

  const meetingCount = ranked.filter((c) => c.atendeRequisito).length;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[440px] bg-white border-l border-border z-40 flex flex-col shadow-xl">
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                Ranking de Candidatos
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">{job.title} — {job.department}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-muted transition-colors flex-shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-muted/50 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Exp. mínima requerida</p>
              <p className="text-sm font-semibold">
                {job.experienciaMinimaMeses === 0 ? "Sem requisito" : `${job.experienciaMinimaMeses} meses`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Atendem o requisito</p>
              <p className="font-display text-2xl font-bold leading-none mt-0.5">
                <span className="text-emerald-600">{meetingCount}</span>
                <span className="text-muted-foreground text-sm font-normal">/{ranked.length}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-2 border-b border-border flex items-center gap-4 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 size={11} className="text-emerald-500" />Atende o requisito
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle size={11} className="text-amber-500" />Abaixo do requisito
          </span>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-border">
          {ranked.map((c, idx) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 px-5 py-3.5 ${!c.atendeRequisito ? "bg-amber-50/40" : ""}`}
            >
              <span className={`font-display text-sm font-bold w-5 text-center flex-shrink-0 ${idx === 0 ? "text-amber-500" : "text-muted-foreground"}`}>
                {idx + 1}
              </span>
              <Avatar name={c.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.position}</p>
              </div>
              <div className="text-right flex-shrink-0 mr-1">
                <p className="text-xs font-semibold">{c.expMonths}m</p>
                <p className="text-[10px] text-muted-foreground">{c.experience}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <StatusBadge status={c.status} />
                {c.atendeRequisito
                  ? <CheckCircle2 size={13} className="text-emerald-500 flex-shrink-0" />
                  : <AlertTriangle size={13} className="text-amber-500 flex-shrink-0" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// --- DASHBOARD ---
function DashboardView({ candidates, jobs }: { candidates: Candidate[]; jobs: Job[] }) {
  const stats = {
    total: candidates.length,
    open: jobs.filter((j) => j.status !== "Encerrada").length,
    interviews: candidates.filter((c) => c.status === "Entrevista").length,
    approved: candidates.filter((c) => c.status === "Aprovado").length,
  };

  const statusCounts = ALL_STATUSES.map((s) => ({
    status: s,
    count: candidates.filter((c) => c.status === s).length,
  }));

  const recent = [...candidates].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total de Candidatos", value: stats.total, icon: Users, delta: "+12 este mês", positive: true },
          { label: "Vagas Abertas", value: stats.open, icon: Briefcase, delta: `de ${jobs.length} vagas`, positive: null },
          { label: "Entrevistas Agendadas", value: stats.interviews, icon: Clock, delta: "aguardando retorno", positive: null },
          { label: "Aprovados no Mês", value: stats.approved, icon: CheckCircle2, delta: "+3 vs mês anterior", positive: true },
        ].map(({ label, value, icon: Icon, delta, positive }) => (
          <div key={label} className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3 hover:border-foreground/20 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</span>
              <span className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <Icon size={15} className="text-muted-foreground" />
              </span>
            </div>
            <div className="flex items-end justify-between">
              <span className="font-display text-5xl font-bold text-foreground leading-none">{value}</span>
              <span className={`text-xs font-medium ${positive === true ? "text-emerald-600" : "text-muted-foreground"}`}>
                {positive === true && <ArrowUpRight size={11} className="inline mb-0.5" />}
                {delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-semibold tracking-tight">Candidatos por Mês</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#00C566]" />Candidatos</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-foreground" />Contratados</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={hiringData} barGap={4} barCategoryGap="30%">
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#8C8CA0" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8C8CA0" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
              <Bar dataKey="candidatos" fill="#00C566" radius={[3, 3, 0, 0]} />
              <Bar dataKey="contratados" fill="#0D0D14" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-display text-lg font-semibold tracking-tight mb-4">Funil de Status</h3>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => {
              const cfg = STATUS_CONFIG[status];
              const pct = candidates.length > 0 ? Math.round((count / candidates.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      {status}
                    </span>
                    <span className="text-xs font-semibold text-foreground">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cfg.dot}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">Taxa de aprovação</p>
            <p className="font-display text-3xl font-bold mt-1">
              {candidates.length > 0 ? Math.round((stats.approved / candidates.length) * 100) : 0}
              <span className="text-lg text-muted-foreground font-medium">%</span>
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold tracking-tight">Candidaturas Recentes</h3>
          <span className="text-xs text-muted-foreground">Últimas 5</span>
        </div>
        <div className="divide-y divide-border">
          {recent.map((c) => (
            <div key={c.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors">
              <Avatar name={c.name} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.position}</p>
              </div>
              <span className="hidden sm:block text-xs text-muted-foreground">{c.location}</span>
              <StatusBadge status={c.status} />
              <span className="text-xs text-muted-foreground hidden md:block whitespace-nowrap">{formatDate(c.appliedDate)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- CANDIDATES VIEW ---
function CandidatesView({
  candidates,
  onStatusChange,
  onDelete,
  onSelectCandidate,
}: {
  candidates: Candidate[];
  onStatusChange: (id: string, status: Status) => void;
  onDelete: (id: string) => void;
  onSelectCandidate: (c: Candidate) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "Todos">("Todos");
  const [deptFilter, setDeptFilter] = useState("Todos");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.position.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === "Todos" || c.status === statusFilter;
      const matchDept = deptFilter === "Todos" || c.department === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });
  }, [candidates, search, statusFilter, deptFilter]);

  const depts = ["Todos", ...Array.from(new Set(candidates.map((c) => c.department)))];

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar candidato, vaga..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted border border-transparent rounded focus:outline-none focus:border-foreground/20 focus:bg-white transition-colors placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "Todos")}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-muted border border-transparent rounded focus:outline-none focus:border-foreground/20 focus:bg-white transition-colors cursor-pointer"
            >
              <option value="Todos">Todos os status</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-xs font-medium bg-muted border border-transparent rounded focus:outline-none focus:border-foreground/20 focus:bg-white transition-colors cursor-pointer"
            >
              {depts.map((d) => <option key={d} value={d}>{d === "Todos" ? "Todos os depto." : d}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Candidato</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">Vaga / Depto.</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden lg:table-cell">Localização</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden xl:table-cell">Exp.</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium">Status</th>
                <th className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground font-medium hidden md:table-cell">Data</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground text-sm">
                    Nenhum candidato encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => onSelectCandidate(c)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-[160px]">{c.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[160px]">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm truncate max-w-[140px]">{c.position}</p>
                      <p className="text-xs text-muted-foreground">{c.department}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin size={11} />{c.location}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-xs font-medium">{getExpMonths(c.experience)}m</span>
                      <p className="text-[10px] text-muted-foreground">{c.experience}</p>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button onClick={() => setOpenDropdown(openDropdown === c.id ? null : c.id)}>
                          <StatusBadge status={c.status} />
                        </button>
                        {openDropdown === c.id && (
                          <div className="absolute left-0 top-full mt-1 z-20 bg-white border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                            {ALL_STATUSES.map((s) => (
                              <button
                                key={s}
                                onClick={() => { onStatusChange(c.id, s); setOpenDropdown(null); }}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2"
                              >
                                <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[s].dot}`} />
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground">{formatDate(c.appliedDate)}</span>
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-red-50 hover:text-red-600 text-muted-foreground"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">{filtered.length} candidato{filtered.length !== 1 ? "s" : ""} — clique para ver detalhes</span>
            <div className="flex items-center gap-1 flex-wrap">
              {ALL_STATUSES.map((s) => {
                const cnt = filtered.filter((c) => c.status === s).length;
                if (cnt === 0) return null;
                return (
                  <span key={s} className={`text-xs px-2 py-0.5 rounded ${STATUS_CONFIG[s].badge}`}>
                    {s}: {cnt}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- JOBS VIEW (updated — seção 2.2) ---
function JobsView({
  jobs,
  onNewJob,
  onEditJob,
  onRankJob,
}: {
  jobs: Job[];
  onNewJob: () => void;
  onEditJob: (job: Job) => void;
  onRankJob: (job: Job) => void;
}) {
  const open = jobs.filter((j) => j.status === "Aberta").length;
  const inProcess = jobs.filter((j) => j.status === "Em Processo").length;
  const closed = jobs.filter((j) => j.status === "Encerrada").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-6">
          {[
            { label: "Abertas", count: open, color: "text-emerald-600" },
            { label: "Em Processo", count: inProcess, color: "text-blue-600" },
            { label: "Encerradas", count: closed, color: "text-muted-foreground" },
          ].map(({ label, count, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`font-display text-3xl font-bold ${color}`}>{count}</span>
              <span className="text-xs text-muted-foreground leading-tight">{label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={onNewJob}
          className="flex items-center gap-1.5 px-4 py-2 bg-foreground text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          <Plus size={14} />
          Nova Vaga
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-card border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors group flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold tracking-tight truncate">{job.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{job.department}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded">{job.type}</span>
                <JobStatusBadge status={job.status} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
              <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(job.postedDate)}</span>
              <span className="px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{job.modality}</span>
              {job.experienciaMinimaMeses > 0 && (
                <span className="flex items-center gap-1 px-1.5 py-0.5 bg-muted rounded">
                  <Clock size={10} />Min. {job.experienciaMinimaMeses}m exp.
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-5">
                <div>
                  <p className="text-xs text-muted-foreground">Vagas</p>
                  <p className="font-display text-xl font-bold leading-tight">{job.openings}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Candidatos</p>
                  <p className="font-display text-xl font-bold leading-tight">{job.candidates}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onRankJob(job)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <Trophy size={11} />
                  Ranking
                </button>
                <button
                  onClick={() => onEditJob(job)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded bg-muted text-foreground hover:bg-foreground hover:text-primary-foreground transition-colors"
                >
                  <Edit3 size={11} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- REGISTER VIEW ---
function RegisterView({ jobs, onSubmit }: { jobs: Job[]; onSubmit: (candidate: Omit<Candidate, "id" | "status" | "appliedDate">) => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", location: "",
    position: "", department: "", experience: "", skillsRaw: "", notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nome obrigatório";
    if (!form.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) e.email = "E-mail inválido";
    if (!form.position.trim()) e.position = "Informe a vaga pretendida";
    if (!form.department) e.department = "Selecione o departamento";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim() || "Não informado",
      position: form.position.trim(),
      department: form.department,
      experience: form.experience || "Não informado",
      skills: form.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", phone: "", location: "", position: "", department: "", experience: "", skillsRaw: "", notes: "" });
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[500px] text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
          <CheckCircle2 size={28} className="text-emerald-600" />
        </div>
        <h2 className="font-display text-3xl font-bold mb-2">Currículo Cadastrado</h2>
        <p className="text-muted-foreground text-sm max-w-xs mb-6">
          Candidato adicionado com status <strong>Novo</strong>. Aparece na lista de candidatos e no ranking das vagas.
        </p>
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-foreground text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity"
        >
          Cadastrar outro currículo
        </button>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `w-full px-3 py-2 text-sm bg-muted border rounded focus:outline-none focus:bg-white transition-colors placeholder:text-muted-foreground ${errors[field] ? "border-red-400" : "border-transparent focus:border-foreground/20"}`;

  return (
    <div className="p-8 max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-display text-base font-semibold tracking-tight mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-foreground flex items-center justify-center text-primary-foreground text-[10px] font-bold">1</span>
            Informações Pessoais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Nome completo <span className="text-red-500">*</span></label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ex: Maria Silva Oliveira" className={inputClass("name")} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">E-mail <span className="text-red-500">*</span></label>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="maria@email.com" className={inputClass("email")} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Telefone</label>
              <input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(11) 99999-9999" className={inputClass("phone")} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Cidade / Estado</label>
              <input type="text" value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="São Paulo, SP" className={inputClass("location")} />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-display text-base font-semibold tracking-tight mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-foreground flex items-center justify-center text-primary-foreground text-[10px] font-bold">2</span>
            Informações Profissionais
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Vaga pretendida <span className="text-red-500">*</span></label>
              <input
                type="text"
                list="jobs-list"
                value={form.position}
                onChange={(e) => set("position", e.target.value)}
                placeholder="Ex: Desenvolvedor Frontend"
                className={inputClass("position")}
              />
              <datalist id="jobs-list">
                {jobs.map((j) => <option key={j.id} value={j.title} />)}
              </datalist>
              {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Departamento <span className="text-red-500">*</span></label>
              <div className="relative">
                <select value={form.department} onChange={(e) => set("department", e.target.value)} className={`appearance-none pr-8 ${inputClass("department")}`}>
                  <option value="">Selecione...</option>
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">Tempo de experiência</label>
              <div className="relative">
                <select value={form.experience} onChange={(e) => set("experience", e.target.value)} className="appearance-none pr-8 w-full px-3 py-2 text-sm bg-muted border border-transparent rounded focus:outline-none focus:bg-white focus:border-foreground/20 transition-colors">
                  <option value="">Selecione...</option>
                  {Object.keys(EXP_TO_MONTHS).map((k) => <option key={k} value={k}>{k} ({EXP_TO_MONTHS[k]}m)</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1.5">
                Habilidades <span className="text-muted-foreground font-normal normal-case">(separadas por vírgula)</span>
              </label>
              <input
                type="text"
                value={form.skillsRaw}
                onChange={(e) => set("skillsRaw", e.target.value)}
                placeholder="React, TypeScript, Node.js..."
                className="w-full px-3 py-2 text-sm bg-muted border border-transparent rounded focus:outline-none focus:bg-white focus:border-foreground/20 transition-colors placeholder:text-muted-foreground"
              />
              {form.skillsRaw && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean).map((s, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 bg-foreground text-primary-foreground rounded">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-display text-base font-semibold tracking-tight mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-foreground flex items-center justify-center text-primary-foreground text-[10px] font-bold">3</span>
            Observações
          </h3>
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Informações adicionais sobre o candidato..."
            rows={4}
            className="w-full px-3 py-2 text-sm bg-muted border border-transparent rounded focus:outline-none focus:bg-white focus:border-foreground/20 transition-colors placeholder:text-muted-foreground resize-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" className="px-6 py-2.5 bg-foreground text-primary-foreground text-sm font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus size={15} />
            Cadastrar Currículo
          </button>
          <button type="button" onClick={handleReset} className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Limpar
          </button>
        </div>
      </form>
    </div>
  );
}

// --- APP ---
const NAV_ITEMS = [
  { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
  { id: "candidates" as View, label: "Candidatos", icon: Users },
  { id: "jobs" as View, label: "Vagas", icon: Briefcase },
  { id: "register" as View, label: "Cadastrar Currículo", icon: FilePlus2 },
];

const PAGE_TITLES: Record<View, string> = {
  dashboard: "Dashboard",
  candidates: "Candidatos",
  jobs: "Vagas",
  register: "Cadastrar Currículo",
};

export default function App() {
  const [view, setView] = useState<View>("dashboard");
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [editingJobState, setEditingJobState] = useState<EditingJobState | null>(null);
  const [rankingJob, setRankingJob] = useState<Job | null>(null);

  const handleStatusChange = (id: string, status: Status) => {
    setCandidates((cs) => cs.map((c) => c.id === id ? { ...c, status } : c));
    setSelectedCandidate((sc) => sc?.id === id ? { ...sc, status } : sc);
  };

  const handleDelete = (id: string) => {
    setCandidates((cs) => cs.filter((c) => c.id !== id));
    if (selectedCandidate?.id === id) setSelectedCandidate(null);
  };

  const handleRegister = (data: Omit<Candidate, "id" | "status" | "appliedDate">) => {
    setCandidates((cs) => [{
      ...data,
      id: Date.now().toString(),
      status: "Novo",
      appliedDate: new Date().toISOString().split("T")[0],
    }, ...cs]);
  };

  const handleSaveJob = (data: Omit<Job, "id" | "candidates" | "postedDate">) => {
    if (!editingJobState) return;
    if (editingJobState.mode === "new") {
      setJobs((js) => [...js, {
        ...data,
        id: Date.now().toString(),
        candidates: 0,
        postedDate: new Date().toISOString().split("T")[0],
      }]);
    } else {
      setJobs((js) => js.map((j) => j.id === editingJobState.job.id ? { ...j, ...data } : j));
      if (rankingJob?.id === editingJobState.job.id) {
        setRankingJob((rj) => rj ? { ...rj, ...data } : null);
      }
    }
    setEditingJobState(null);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 flex-shrink-0 bg-[#0D0D14] border-r border-white/5">
        <div className="px-5 pt-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#00C566] flex items-center justify-center flex-shrink-0">
              <UserCheck size={14} className="text-white" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-white tracking-tight leading-none">TalentBase</p>
              <p className="text-[10px] text-white/40 mt-0.5">Prospecção de Vagas</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = view === id;
            const count = id === "candidates" ? candidates.length : id === "jobs" ? jobs.length : undefined;
            return (
              <button
                key={id}
                onClick={() => setView(id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded text-left text-sm transition-colors ${active ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"}`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon size={15} className={active ? "text-[#00C566]" : ""} />
                  <span className="font-medium">{label}</span>
                </span>
                {count !== undefined && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${active ? "bg-[#00C566] text-white" : "bg-white/10 text-white/50"}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70">RH</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white/80 truncate">Equipe de RH</p>
              <p className="text-[10px] text-white/40 truncate">rh@empresa.com.br</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between px-6 md:px-8 py-4 border-b border-border bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex md:hidden items-center gap-2 mr-1">
              <div className="w-6 h-6 rounded bg-[#00C566] flex items-center justify-center">
                <UserCheck size={12} className="text-white" />
              </div>
            </div>
            <h1 className="font-display text-xl font-semibold tracking-tight">{PAGE_TITLES[view]}</h1>
            {view === "candidates" && (
              <span className="text-xs text-muted-foreground hidden sm:block">{candidates.length} registros</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {view === "jobs" && (
              <button
                onClick={() => setEditingJobState({ mode: "new" })}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-foreground text-primary-foreground text-xs font-medium rounded hover:opacity-90 transition-opacity"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Nova Vaga</span>
              </button>
            )}
            {view !== "register" && view !== "jobs" && (
              <button
                onClick={() => setView("register")}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-foreground text-primary-foreground text-xs font-medium rounded hover:opacity-90 transition-opacity"
              >
                <Plus size={13} />
                <span className="hidden sm:inline">Novo Currículo</span>
                <span className="sm:hidden">Novo</span>
              </button>
            )}
            <div className="flex md:hidden gap-1">
              {NAV_ITEMS.slice(0, 3).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setView(id)}
                  className={`p-2 rounded transition-colors ${view === id ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {view === "dashboard" && <DashboardView candidates={candidates} jobs={jobs} />}
          {view === "candidates" && (
            <CandidatesView
              candidates={candidates}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onSelectCandidate={setSelectedCandidate}
            />
          )}
          {view === "jobs" && (
            <JobsView
              jobs={jobs}
              onNewJob={() => setEditingJobState({ mode: "new" })}
              onEditJob={(job) => setEditingJobState({ mode: "edit", job })}
              onRankJob={setRankingJob}
            />
          )}
          {view === "register" && <RegisterView jobs={jobs} onSubmit={handleRegister} />}
        </main>
      </div>

      {/* Overlays */}
      {selectedCandidate && (
        <CandidateDetailPanel
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      {editingJobState && (
        <CreateEditJobModal
          job={editingJobState.mode === "edit" ? editingJobState.job : null}
          onClose={() => setEditingJobState(null)}
          onSave={handleSaveJob}
        />
      )}
      {rankingJob && (
        <RankingPanel
          job={rankingJob}
          candidates={candidates}
          onClose={() => setRankingJob(null)}
        />
      )}
    </div>
  );
}
