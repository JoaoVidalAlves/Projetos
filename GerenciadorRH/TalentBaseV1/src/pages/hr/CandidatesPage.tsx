import { useState, useMemo, useEffect } from "react";
import { Search, Trash2, ChevronDown } from "lucide-react";
import { useAppData } from "../../hooks/useAppData";
import { Avatar, StatusBadge } from "../../components/domain";
import { Loading } from "../../components/ui/Loading";
import { Pagination } from "../../components/ui/Pagination";
import { CandidateDetailPanel } from "./CandidateDetailPanel";
import { ALL_STATUSES, DEPARTMENTS } from "../../utils/domainOptions";
import { formatDate } from "../../utils/formatters";
import type { Candidate, Status } from "../../types";

const PAGE_SIZE = 6;

export default function CandidatesPage() {
  const { candidates, updateCandidateStatus, deleteCandidate, loading } = useAppData();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [deptFilter, setDeptFilter] = useState("");
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.position.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
      if (statusFilter && c.status !== statusFilter) return false;
      if (deptFilter && c.department !== deptFilter) return false;
      return true;
    });
  }, [candidates, search, statusFilter, deptFilter]);

  useEffect(() => setPage(1), [search, statusFilter, deptFilter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleStatusChange(id: string, status: Status) {
    await updateCandidateStatus(id, status);
    setSelected((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
  }

  async function handleDelete(id: string) {
    if (selected?.id === id) setSelected(null);
    await deleteCandidate(id);
  }

  if (loading) return <Loading label="Carregando candidatos..." />;

  return (
    <div className="flex h-[calc(100vh-4rem)] -m-6 sm:-m-8 overflow-hidden">
      <div className={`flex flex-col flex-1 min-w-0 overflow-hidden ${selected ? "hidden lg:flex" : "flex"}`}>
        <div className="flex-shrink-0 px-6 py-4 border-b border-line bg-white">
          <div className="mb-3">
            <h1 className="font-display text-xl font-semibold">Candidatos</h1>
            <p className="text-xs text-muted">
              {candidates.length} cadastrados · {filtered.length} exibidos
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[12rem]">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Buscar candidato..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-line rounded-sm focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Status | "")}
                className="text-xs border border-line rounded-sm pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
              >
                <option value="">Todos os status</option>
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="text-xs border border-line rounded-sm pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-accent appearance-none"
              >
                <option value="">Todos os departamentos</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-paper z-10">
              <tr>
                <th className="text-left text-xs font-semibold text-muted px-6 py-3 border-b border-line">Candidato</th>
                <th className="text-left text-xs font-semibold text-muted px-3 py-3 border-b border-line hidden md:table-cell">Departamento</th>
                <th className="text-left text-xs font-semibold text-muted px-3 py-3 border-b border-line hidden lg:table-cell">Candidatura</th>
                <th className="text-left text-xs font-semibold text-muted px-3 py-3 border-b border-line">Status</th>
                <th className="px-3 py-3 border-b border-line w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {pageItems.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`cursor-pointer hover:bg-paper/70 transition-colors ${selected?.id === c.id ? "bg-accent-soft" : ""}`}
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} size="sm" />
                      <div>
                        <p className="font-medium text-sm">{c.name}</p>
                        <p className="text-xs text-muted">{c.position}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-muted">{c.department}</span>
                  </td>
                  <td className="px-3 py-3.5 hidden lg:table-cell">
                    <span className="text-xs text-muted">{formatDate(c.appliedDate)}</span>
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={c.status}
                      onChange={(e) => handleStatusChange(c.id, e.target.value as Status)}
                      className="text-xs border border-line rounded-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-accent"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 text-muted hover:text-danger hover:bg-danger-soft rounded-sm transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-muted text-sm">
                    Nenhum candidato encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
      </div>

      {selected && (
        <div className="w-full lg:w-96 flex-shrink-0 h-full overflow-y-auto">
          <CandidateDetailPanel candidate={selected} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
        </div>
      )}
    </div>
  );
}
