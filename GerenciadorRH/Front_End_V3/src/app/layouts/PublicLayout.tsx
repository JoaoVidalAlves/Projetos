import { Outlet, Link, useNavigate } from "react-router";
import { UserCheck, LogIn, User } from "lucide-react";
import { useAuth } from "../context";

export default function PublicLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleEnter() {
    if (user?.role === "RH") navigate("/rh/dashboard");
    else if (user?.role === "Candidato") navigate("/candidato");
    else navigate("/login");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded bg-[#00C566] flex items-center justify-center">
              <UserCheck size={14} className="text-white" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold tracking-tight leading-none">TalentBase</p>
              <p className="text-[10px] text-muted-foreground">Vitrine de Vagas</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={handleEnter}
                className="flex items-center gap-2 px-3.5 py-2 bg-foreground text-primary-foreground text-xs font-medium rounded hover:opacity-90 transition-opacity"
              >
                <User size={13} />
                {user.role === "RH" ? "Painel RH" : "Minha Conta"}
              </button>
            ) : (
              <>
                <Link
                  to="/cadastro"
                  className="px-3.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Criar conta
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-foreground text-primary-foreground text-xs font-medium rounded hover:opacity-90 transition-opacity"
                >
                  <LogIn size={13} />
                  Entrar
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2026 TalentBase — Todos os direitos reservados.</p>
          <p className="text-xs text-muted-foreground">LGPD: seus dados são tratados conforme nossa política de privacidade.</p>
        </div>
      </footer>
    </div>
  );
}
