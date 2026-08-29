import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Briefcase, TrendingUp, CheckCircle } from "lucide-react";
import { useAppData } from "../../context";
import { hiringData, STATUS_CONFIG } from "../../data";
import { Avatar, StatusBadge } from "../../components/Shared";

export default function DashboardPage() {
  const { candidates, jobs } = useAppData();

  const open = jobs.filter((j) => j.status === "Aberta").length;
  const approved = candidates.filter((c) => c.status === "Aprovado").length;
  const inProcess = candidates.filter((c) => c.status !== "Reprovado" && c.status !== "Aprovado").length;
  const recent = [...candidates].sort((a, b) => b.appliedDate.localeCompare(a.appliedDate)).slice(0, 5);

  const statusCounts = Object.fromEntries(
    Object.keys(STATUS_CONFIG).map((s) => [s, candidates.filter((c) => c.status === s).length])
  );

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Visão geral dos processos seletivos</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total de candidatos", value: candidates.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Vagas abertas", value: open, icon: Briefcase, color: "text-[#00C566]", bg: "bg-emerald-50" },
            { label: "Em processo", value: inProcess, icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Aprovados", value: approved, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white border border-border rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <div className={`w-7 h-7 rounded ${bg} flex items-center justify-center`}>
                  <Icon size={14} className={color} />
                </div>
              </div>
              <p className="font-display text-3xl font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white border border-border rounded p-5">
            <h2 className="font-display font-semibold text-sm mb-4">Candidatos vs Contratações (últimos 6 meses)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={hiringData} barSize={10} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F4" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ border: "1px solid #E5E7EB", borderRadius: "4px", fontSize: "11px" }}
                  cursor={{ fill: "#F4F4F7" }}
                />
                <Bar dataKey="candidatos" fill="#BFDBFE" radius={[2, 2, 0, 0]} name="Candidatos" />
                <Bar dataKey="contratados" fill="#00C566" radius={[2, 2, 0, 0]} name="Contratados" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Status breakdown */}
          <div className="bg-white border border-border rounded p-5">
            <h2 className="font-display font-semibold text-sm mb-4">Por status</h2>
            <div className="space-y-3">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <StatusBadge status={status as keyof typeof STATUS_CONFIG} />
                  <span className="text-sm font-semibold text-foreground">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent candidates */}
        <div className="mt-6 bg-white border border-border rounded">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-display font-semibold text-sm">Candidatos recentes</h2>
          </div>
          <div className="divide-y divide-border">
            {recent.map((c) => (
              <div key={c.id} className="px-5 py-3.5 flex items-center gap-3">
                <Avatar name={c.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.position}</p>
                </div>
                <StatusBadge status={c.status} />
                <span className="text-xs text-muted-foreground hidden sm:block shrink-0">
                  {c.appliedDate.split("-").reverse().join("/")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
