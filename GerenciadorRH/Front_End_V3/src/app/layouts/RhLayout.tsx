import { Outlet, NavLink, Navigate, useNavigate } from "react-router";
import { LayoutDashboard, Users, Briefcase, FilePlus2, UserCheck, LogOut } from "lucide-react";
import { useAuth } from "../context";
import { useAppData } from "../context";
import { toast } from "sonner";

const NAV = [
  { to: "/rh/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/rh/candidatos", label: "Candidatos", icon: Users },
  { to: "/rh/vagas", label: "Vagas", icon: Briefcase },
  { to: "/rh/cadastrar", label: "Cadastrar Currículo", icon: FilePlus2 },
];

export default function RhLayout() {
  const { user, logout } = useAuth();
  const { candidates, jobs } = useAppData();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "RH") return <Navigate to="/candidato" replace />;

  const counts: Record<string, number> = {
    "/rh/candidatos": candidates.length,
    "/rh/vagas": jobs.length,
  };

  function handleLogout() {
    logout();
    toast.success("Sessão encerrada.");
    navigate("/login");
  }

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
              <p className="text-[10px] text-white/40 mt-0.5">Painel RH</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded text-left text-sm transition-colors ${
                  isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2.5">
                    <Icon size={15} className={isActive ? "text-[#00C566]" : ""} />
                    <span className="font-medium">{label}</span>
                  </span>
                  {counts[to] !== undefined && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isActive ? "bg-[#00C566] text-white" : "bg-white/10 text-white/50"}`}>
                      {counts[to]}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded hover:bg-white/5 transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-semibold text-white/70 flex-shrink-0">
              RH
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white/80 truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
            <LogOut size={13} className="text-white/30 flex-shrink-0" />
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
