import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Briefcase, TrendingUp, CheckCircle } from "lucide-react";
import { useAppData } from "../../hooks/useAppData";
import { hiringChartData } from "../../utils/mockDatabase";
import { ALL_STATUSES } from "../../utils/domainOptions";
import { Avatar, StatusBadge } from "../../components/domain";
import { Loading } from "../../components/ui/Loading";
import { formatDate } from "../../utils/formatters";

const KPI_ICON_STYLES = [
  { icon: Users, color: "text-info", bg: "bg-info-soft" },
  { icon: Briefcase, color: "text-accent-dark", bg: "bg-accent-soft" },
  { icon: TrendingUp, color: "text-amber", bg: "bg-amber-soft" },
  { icon: CheckCircle, color: "text-accent-dark", bg: "bg-accent-soft" },
];

export default function DashboardPage() {
  const { candidates, jobs, loading } = useAppData();

  if (loading) return <Loading label="Carregando painel..." />;

  const openJobs = jobs.filter((j) => j.status === "Aberta").length;
  const approved = candidates.filter((c) => c.status === "Aprovado").length;
  const inProcess = candidates.filter((c) => c.status !== "Reprovado" && c.status !== "Aprovado").length;
  const recent = [...candidates].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).slice(0, 5);

  const kpis = [
    { label: "Total de candidatos", value: candidates.length },
    { label: "Vagas abertas", value: openJobs },
    { label: "Em processo", value: inProcess },
    { label: "Aprovados", value: approved },
  ];

  const statusCounts = ALL_STATUSES.map((status) => ({
    status,
    count: candidates.filter((c) => c.status === status).length,
  }));

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted mt-0.5">Visão geral dos processos seletivos</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => {
          const { icon: Icon, color, bg } = KPI_ICON_STYLES[i];
          return (
            <div key={kpi.label} className="bg-white border border-line rounded-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted">{kpi.label}</p>
                <div className={`w-7 h-7 rounded-sm ${bg} flex items-center justify-center`}>
                  <Icon size={14} className={color} />
                </div>
              </div>
              <p className="font-display text-3xl font-semibold">{kpi.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-line rounded-sm p-5">
          <h2 className="font-display font-semibold text-sm mb-4">Candidatos vs Contratações (últimos 6 meses)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hiringChartData} barSize={10} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFEEE8" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ border: "1px solid #DEDBD1", borderRadius: "3px", fontSize: "11px" }} cursor={{ fill: "#F4F3EE" }} />
              <Bar dataKey="candidates" fill="#C9CEC5" radius={[2, 2, 0, 0]} name="Candidatos" />
              <Bar dataKey="hired" fill="#2F6F4E" radius={[2, 2, 0, 0]} name="Contratados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white border border-line rounded-sm p-5">
          <h2 className="font-display font-semibold text-sm mb-4">Por status</h2>
          <div className="space-y-3">
            {statusCounts.map(({ status, count }) => (
              <div key={status} className="flex items-center justify-between">
                <StatusBadge status={status} />
                <span className="text-sm font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white border border-line rounded-sm">
        <div className="px-5 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-sm">Candidatos recentes</h2>
        </div>
        <div className="divide-y divide-line">
          {recent.map((c) => (
            <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
              <Avatar name={c.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.name}</p>
                <p className="text-xs text-muted truncate">{c.position}</p>
              </div>
              <StatusBadge status={c.status} />
              <span className="text-xs text-muted hidden sm:block shrink-0">{formatDate(c.appliedDate)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
