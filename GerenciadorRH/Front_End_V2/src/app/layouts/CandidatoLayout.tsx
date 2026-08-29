import { Outlet, NavLink, Navigate, Link, useNavigate } from "react-router";
import { User, FileText, LogOut, UserCheck, Briefcase } from "lucide-react";
import { useAuth } from "../context";
import { useAppData } from "../context";
import { toast } from "sonner";

const NAV = [
  { to: "/candidato/perfil", label: "Meu Perfil", icon: User },
  { to: "/candidato/candidaturas", label: "Minhas Candidaturas", icon: FileText },
];

export default function CandidatoLayout() {
  const { user, logout } = useAuth();
  const { myCandidaturas } = useAppData();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "Candidato") return <Navigate to="/rh/dashboard" replace />;

  function handleLogout() {
    logout();
    toast.success("Sessão encerrada.");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex flex-col">
      {/* Header */}
      <header className="bg-[#0D0D14] border-b border-white/5 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="w-6 h-6 rounded bg-[#00C566] flex items-center justify-center">
                <UserCheck size={12} className="text-white" />
              </div>
              <span className="font-display text-sm font-semibold text-white tracking-tight">TalentBase</span>
            </Link>
            <nav className="flex items-center gap-1">
              {NAV.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
                    }`
                  }
                >
                  <Icon size={13} />
                  {label}
                  {to === "/candidato/candidaturas" && myCandidaturas.length > 0 && (
                    <span className="ml-0.5 bg-[#00C566] text-white text-[9px] font-bold px-1 py-0.5 rounded">
                      {myCandidaturas.length}
                    </span>
                  )}
                </NavLink>
              ))}
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
              >
                <Briefcase size={13} />
                Ver Vagas
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 hidden sm:block">{user.name}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors p-1.5 rounded hover:bg-white/5"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
