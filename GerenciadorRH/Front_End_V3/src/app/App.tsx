import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { Toaster } from "sonner";
import { AppProvider } from "./context";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import RhLayout from "./layouts/RhLayout";
import CandidatoLayout from "./layouts/CandidatoLayout";

// Public pages
import LoginPage from "./pages/LoginPage";
import CadastroPage from "./pages/CadastroPage";
import VitrinePage from "./pages/VitrinePage";
import VagaDetailPage from "./pages/VagaDetailPage";

// RH pages
import DashboardPage from "./pages/rh/DashboardPage";
import CandidatosPage from "./pages/rh/CandidatosPage";
import VagasPage from "./pages/rh/VagasPage";
import CadastrarPage from "./pages/rh/CadastrarPage";

// Candidato pages
import PerfilPage from "./pages/candidato/PerfilPage";
import CandidaturasPage from "./pages/candidato/CandidaturasPage";

const router = createBrowserRouter([
  // Login / Cadastro (standalone, no layout wrapper)
  { path: "/login", element: <LoginPage /> },
  { path: "/cadastro", element: <CadastroPage /> },

  // Public vitrine
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <VitrinePage /> },
      { path: "/vaga/:id", element: <VagaDetailPage /> },
    ],
  },

  // RH panel
  {
    path: "/rh",
    element: <RhLayout />,
    children: [
      { index: true, element: <Navigate to="/rh/dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "candidatos", element: <CandidatosPage /> },
      { path: "vagas", element: <VagasPage /> },
      { path: "cadastrar", element: <CadastrarPage /> },
    ],
  },

  // Candidato portal
  {
    path: "/candidato",
    element: <CandidatoLayout />,
    children: [
      { index: true, element: <Navigate to="/candidato/perfil" replace /> },
      { path: "perfil", element: <PerfilPage /> },
      { path: "candidaturas", element: <CandidaturasPage /> },
    ],
  },

  // Catch-all
  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  );
}
