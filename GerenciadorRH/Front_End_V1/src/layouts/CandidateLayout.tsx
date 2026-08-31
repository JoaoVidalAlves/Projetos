import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

export function CandidateLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <Navbar
        links={[
          { to: "/", label: "Vagas" },
          { to: "/candidato/perfil", label: "Meu Perfil" },
          { to: "/candidato/candidaturas", label: "Minhas Candidaturas" },
        ]}
      />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
