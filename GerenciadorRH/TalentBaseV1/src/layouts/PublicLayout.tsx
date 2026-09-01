import { Outlet } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar links={[{ to: "/", label: "Vagas" }]} />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-line py-6 text-center text-xs text-muted">
        TalentBase — conectando talentos a oportunidades.
      </footer>
    </div>
  );
}
