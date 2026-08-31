import { Link, NavLink } from "react-router-dom";
import { Briefcase, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

interface NavbarLink {
  to: string;
  label: string;
}

interface NavbarProps {
  links?: NavbarLink[];
}

export function Navbar({ links = [] }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-line bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-sm bg-ink flex items-center justify-center">
            <Briefcase size={16} className="text-white" />
          </span>
          <span className="font-display font-semibold text-lg">TalentBase</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-accent" : "text-muted hover:text-ink"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-muted">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut size={14} />
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button size="sm">Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
