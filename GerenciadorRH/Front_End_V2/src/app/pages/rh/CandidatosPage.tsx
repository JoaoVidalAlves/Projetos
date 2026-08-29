import { useState, useMemo } from "react";
import { Search, Trash2, ChevronDown, X, MapPin, Phone, Mail, Briefcase, Star, Calendar } from "lucide-react";
import { useAppData } from "../../context";
import { Avatar, StatusBadge } from "../../components/Shared";
import { ALL_STATUSES, DEPARTMENTS, formatDate, getExpMonths } from "../../data";
import type { Candidate, Status } from "../../types";

// --- Candidate Detail Panel ---
function CandidateDetail({ candidate, onClose, onStatusChange }: {
  candidate: Candidate;
  onClose: () => void;
  onStatusChange: (id: string, status: Status) => void;
}) {
  return (
    <div className="flex flex-col h-full bg-white border-l border-border">
      {/* Header */}
      <div className="flex items-start justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar name={candidate.name} size="lg" />
          <div>
            <h2 className="font-display font-semibold text-base">{candidate.name}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{candidate.position} · {candidate.department}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors">
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Status */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Status do processo</p>
          <select
            value={candidate.status}
            onChange={(e) => onStatusChange(candidate.id, e.target.value as Status)}
            className="text-xs border border-border rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#00C566]"
          >
            {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Info */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Informações</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail size={13} className="text-muted-foreground" />
              <a href={`mailto:${candidate.email}`} className="text-[#00C566] hover:underline">{candidate.email}</a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone size={13} className="text-muted-foreground" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin size={13} className="text-muted-foreground" />
              <span>{candidate.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase size={13} className="text-muted-foreground" />
              <span>{candidate.experience} de experiência</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={13} className="text-muted-foreground" />
              <span>Candidatura em {formatDate(candidate.appliedDate)}</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Habilidades</p>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.map((skill) => (
              <span key={skill} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium">{skill}</span>
            ))}
          </div>
        </div>

        {/* Score badge */}
        <div className="p-3 bg-[#00C566]/5 border border-[#00C566]/20 rounded flex items-center gap-2">
          <Star size={13} className="text-[#00C566]" />
          <span className="text-xs text-foreground font-medium">
            {getExpMonths(candidate.experience)} meses de experiência (Caminho B)
          </span>
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
export default function CandidatosPage() {
  const { candidates, updateCandidateStatus, deleteCandidate } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [deptFilter, setDeptFilter] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.position.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (deptFilter && c.department !== deptFilter) return false;
      return true;
    });
  }, [candidates, search, statusFilter, deptFilter]);

  function handleStatusChange(id: string, status: Status) {
    updateCandidateStatus(id, status);
    setSelected((prev) => prev && prev.id === id ? { ...prev, status } : prev);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Table area */}
      <div className={`flex flex-col flex-1 min-w-0 overflow-hidden ${selected ? "hidden lg:flex" : "flex"}`}>
        {/* Toolbar */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border bg-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="font-display text-xl font-semibold">Candidatos</h1>
              <p className="text-xs text-muted-foreground">{candidates.length} cadastrados · {filtered.length} exibidos</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar candidato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-[#00C566]"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "")}
                className="text-xs border border-border rounded pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566] appearance-none"
              >
                <option value="">Todos os status</option>
                {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs border border-border rounded pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566] appearance-none"
              >
                <option value="">Todos os departamentos</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F8F8FA] z-10">
              <tr>
                <th className="text-left text-xs font-semibold text-muted-foreground px-6 py-3 border-b border-border">Candidato</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-3 border-b border-border hidden md:table-cell">Departamento</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-3 border-b border-border hidden lg:table-cell">Candidatura</th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-3 py-3 border-b border-border">Status</th>
                <th className="px-3 py-3 border-b border-border w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer hover:bg-muted/40 transition-colors ${selected?.id === c.id ? "bg-[#00C566]/5" : ""}`}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">{c.department}</span>
                  </td>
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-muted-foreground">{formatDate(c.appliedDate)}</span>
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as Status)}
                      className="text-xs border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                    >
                      {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        if (selected?.id === c.id) setSelected(null);
                        deleteCandidate(c.id);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted-foreground text-sm">
                    Nenhum candidato encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="w-full lg:w-96 flex-shrink-0 h-full overflow-y-auto">
          <CandidateDetail
            candidate={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}
    </div>
  );
}
