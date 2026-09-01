import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";

import { PublicLayout } from "../layouts/PublicLayout";
import { HRLayout } from "../layouts/HRLayout";
import { CandidateLayout } from "../layouts/CandidateLayout";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import JobsBoardPage from "../pages/JobsBoardPage";
import JobDetailPage from "../pages/JobDetailPage";

import DashboardPage from "../pages/hr/DashboardPage";
import CandidatesPage from "../pages/hr/CandidatesPage";
import JobsPage from "../pages/hr/JobsPage";
import RegisterCandidatePage from "../pages/hr/RegisterCandidatePage";

import ProfilePage from "../pages/candidate/ProfilePage";
import ApplicationsPage from "../pages/candidate/ApplicationsPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Autenticação — sem layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      {/* Vitrine pública de vagas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<JobsBoardPage />} />
        <Route path="/vaga/:id" element={<JobDetailPage />} />
      </Route>

      {/* Painel de RH */}
      <Route
        path="/rh"
        element={
          <ProtectedRoute role="RH">
            <HRLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/rh/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="candidatos" element={<CandidatesPage />} />
        <Route path="vagas" element={<JobsPage />} />
        <Route path="cadastrar" element={<RegisterCandidatePage />} />
      </Route>

      {/* Portal do candidato */}
      <Route
        path="/candidato"
        element={
          <ProtectedRoute role="Candidato">
            <CandidateLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/candidato/perfil" replace />} />
        <Route path="perfil" element={<ProfilePage />} />
        <Route path="candidaturas" element={<ApplicationsPage />} />
      </Route>

      {/* Rota não encontrada */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
