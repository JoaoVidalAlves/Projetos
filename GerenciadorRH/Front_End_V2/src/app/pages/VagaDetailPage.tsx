import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Clock, Users, Briefcase, CheckCircle2, AlertCircle } from "lucide-react";
import { useAppData } from "../context";
import { useAuth } from "../context";
import { JobStatusBadge, ModalityBadge } from "../components/Shared";
import { formatDate } from "../data";
import { toast } from "sonner";
import { useState } from "react";

export default function VagaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { jobs, applyToJob, candidaturas } = useAppData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <Briefcase size={48} className="mx-auto mb-4 text-muted-foreground opacity-30" />
        <h2 className="text-lg font-display font-semibold mb-2">Vaga não encontrada.</h2>
        <Link to="/" className="text-sm text-[#00C566] hover:underline">Voltar para vagas</Link>
      </div>
    );
  }

  const alreadyApplied = user && candidaturas.some((c) => c.candidatoId === user.id && c.vagaId === id);
  const meses = job.experienciaMinimaMeses;
  const expDisplay = meses >= 12 ? `${Math.floor(meses / 12)} ano${Math.floor(meses / 12) > 1 ? "s" : ""}` : `${meses} meses`;

  function handleApply() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role === "RH") {
      toast.error("O painel RH não pode se candidatar a vagas.");
      return;
    }
    setApplying(true);
    const result = applyToJob(job.id);
    setApplying(false);
    if (result.ok) {
      toast.success("Candidatura enviada com sucesso!");
    } else {
      toast.error(result.error ?? "Erro ao enviar candidatura.");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft size={14} />
        Voltar para vagas
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">{job.department}</p>
                <h1 className="font-display text-3xl font-semibold text-foreground leading-tight">{job.title}</h1>
              </div>
              <JobStatusBadge status={job.status} />
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />Publicada em {formatDate(job.postedDate)}</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{job.candidates} candidatos</span>
            </div>
          </div>

          {job.description && (
            <div className="bg-white border border-border rounded p-6">
              <h2 className="font-display font-semibold text-base mb-3">Sobre a vaga</h2>
              <p className="text-sm text-foreground/80 leading-relaxed">{job.description}</p>
            </div>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="bg-white border border-border rounded p-6">
              <h2 className="font-display font-semibold text-base mb-4">Habilidades desejadas</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-medium rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Apply card */}
          <div className="bg-white border border-border rounded p-5 sticky top-4">
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Modalidade</span>
                <ModalityBadge modality={job.modality} />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contrato</span>
                <span className="font-medium">{job.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vagas</span>
                <span className="font-medium">{job.openings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exp. mínima</span>
                <span className="font-medium">{expDisplay}</span>
              </div>
            </div>

            {job.status === "Encerrada" ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-slate-50 border border-border rounded p-3">
                <AlertCircle size={15} />
                Vaga encerrada
              </div>
            ) : alreadyApplied ? (
              <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded p-3">
                <CheckCircle2 size={15} />
                Você já se candidatou
              </div>
            ) : (
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-[#00C566] hover:bg-[#00B05A] text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-60"
              >
                {applying ? "Enviando..." : user ? "Candidatar-se" : "Entrar para candidatar-se"}
              </button>
            )}

            {!user && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                <Link to="/cadastro" className="text-[#00C566] hover:underline">Criar conta</Link> gratuitamente
              </p>
            )}

            {user?.role === "Candidato" && !alreadyApplied && job.status !== "Encerrada" && (
              <p className="text-[10px] text-muted-foreground text-center mt-2">
                Sua candidatura ficará disponível no seu perfil.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
