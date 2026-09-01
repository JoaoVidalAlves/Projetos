import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Users, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "../hooks/useAppData";
import { useAuth } from "../hooks/useAuth";
import { JobStatusBadge, ModalityBadge } from "../components/domain";
import { Loading } from "../components/ui/Loading";
import { Button } from "../components/ui/Button";
import { formatDate } from "../utils/formatters";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs, applications, applyToJob, loading } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  if (loading) return <Loading label="Carregando vaga..." />;

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <Briefcase size={48} className="mx-auto mb-4 text-muted opacity-30" />
        <h2 className="text-lg font-display font-semibold mb-2">Vaga não encontrada.</h2>
        <Link to="/" className="text-sm text-accent hover:underline">
          Voltar para vagas
        </Link>
      </div>
    );
  }

  const alreadyApplied = Boolean(user && applications.some((a) => a.candidateId === user.id && a.jobId === job.id));
  const months = job.minExperienceMonths;
  const expDisplay = months >= 12 ? `${Math.floor(months / 12)} ano${Math.floor(months / 12) > 1 ? "s" : ""}` : `${months} meses`;

  async function handleApply() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "RH") {
      toast.error("O painel RH não pode se candidatar a vagas.");
      return;
    }
    setApplying(true);
    const result = await applyToJob(job!.id);
    setApplying(false);
    if (result.ok) {
      toast.success("Candidatura enviada com sucesso!");
    } else {
      toast.error(result.error ?? "Erro ao enviar candidatura.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition-colors mb-6">
        <ArrowLeft size={14} />
        Voltar para vagas
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <div className="flex-1">
                <p className="text-sm text-muted mb-1">{job.department}</p>
                <h1 className="font-display text-3xl font-semibold leading-tight">{job.title}</h1>
              </div>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="text-xs font-mono text-muted mb-4">Processo Nº {job.id.padStart(6, "0").toUpperCase()}</p>

            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                Publicada em {formatDate(job.postedDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {job.candidatesCount} candidatos
              </span>
            </div>
          </div>

          {job.description && (
            <div className="bg-white border border-line rounded-sm p-6">
              <h2 className="font-display font-semibold text-base mb-3">Sobre a vaga</h2>
              <p className="text-sm text-ink/80 leading-relaxed">{job.description}</p>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="bg-white border border-line rounded-sm p-6">
              <h2 className="font-display font-semibold text-base mb-4">Habilidades desejadas</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-medium rounded-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-line rounded-sm p-5 sticky top-20">
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Modalidade</span>
                <ModalityBadge modality={job.modality} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Contrato</span>
                <span className="font-medium">{job.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Vagas</span>
                <span className="font-medium">{job.openings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Exp. mínima</span>
                <span className="font-medium">{expDisplay}</span>
              </div>
            </div>

            {job.status === "Encerrada" ? (
              <div className="flex items-center gap-2 text-sm text-muted bg-stone-50 border border-line rounded-sm p-3">
                <AlertCircle size={15} />
                Vaga encerrada
              </div>
            ) : alreadyApplied ? (
              <div className="flex items-center gap-2 text-sm text-accent-dark bg-accent-soft border border-accent/20 rounded-sm p-3">
                <CheckCircle2 size={15} />
                Você já se candidatou
              </div>
            ) : (
              <Button onClick={handleApply} disabled={applying} className="w-full">
                {applying ? "Enviando..." : user ? "Candidatar-se" : "Entrar para candidatar-se"}
              </Button>
            )}

            {!user && (
              <p className="text-xs text-muted text-center mt-3">
                <Link to="/cadastro" className="text-accent hover:underline">
                  Criar conta
                </Link>{" "}
                gratuitamente
              </p>
            )}

            {user?.role === "Candidato" && !alreadyApplied && job.status !== "Encerrada" && (
              <p className="text-[10px] text-muted text-center mt-2">Sua candidatura ficará disponível no seu perfil.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
