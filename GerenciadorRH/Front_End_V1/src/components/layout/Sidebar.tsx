import { NavLink } from "react-router-dom";
import { Briefcase, LayoutDashboard, Users, UserPlus, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

interface SidebarLink {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const LINKS: SidebarLink[] = [
  { to: "/rh/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/rh/candidatos", label: "Candidatos", icon: Users },
  { to: "/rh/vagas", label: "Vagas", icon: Briefcase },
  { to: "/rh/cadastrar", label: "Cadastrar Candidato", icon: UserPlus },
];

export function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-60 flex-shrink-0 bg-ink text-white flex flex-col h-screen sticky top-0">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
        <span className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center">
          <Briefcase size={16} />
        </span>
        <span className="font-display font-semibold text-lg">TalentBase</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {LINKS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                isActive ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-3 py-2 mb-1">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-xs text-white/40 truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-sm text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  );
}
