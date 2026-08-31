import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, Check, Clock, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "../../hooks/useAppData";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Loading } from "../../components/ui/Loading";
import { ExperienceFormModal } from "./ExperienceFormModal";
import { DEPARTMENTS } from "../../utils/domainOptions";
import { formatMonthYear } from "../../utils/formatters";
import type { Experience } from "../../types";

interface ProfileFormData {
  name: string;
  phone: string;
  city: string;
  state: string;
  desiredPosition: string;
  department: string;
  skillsRaw: string;
}

export default function ProfilePage() {
  const { candidateProfile, updateCandidateProfile, addExperience, updateExperience, deleteExperience, totalExperienceMonths, loading } =
    useAppData();
  const [editingExp, setEditingExp] = useState<Experience | null | "new">(null);
  const [profileEditing, setProfileEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    values: {
      name: candidateProfile.name,
      phone: candidateProfile.phone,
      city: candidateProfile.city,
      state: candidateProfile.state,
      desiredPosition: candidateProfile.desiredPosition,
      department: candidateProfile.department,
      skillsRaw: candidateProfile.skills.join(", "),
    },
  });

  if (loading) return <Loading label="Carregando perfil..." />;

  async function onProfileSave(data: ProfileFormData) {
    await updateCandidateProfile({
      name: data.name,
      phone: data.phone,
      city: data.city,
      state: data.state,
      desiredPosition: data.desiredPosition,
      department: data.department,
      skills: data.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setProfileEditing(false);
    toast.success("Perfil atualizado!");
  }

  async function handleExpSave(data: Parameters<typeof addExperience>[0]) {
    if (editingExp && editingExp !== "new") {
      await updateExperience(editingExp.id, data);
      toast.success("Experiência atualizada.");
    } else {
      await addExperience(data);
      toast.success("Experiência adicionada.");
    }
  }

  async function handleDeleteExp(id: string) {
    await deleteExperience(id);
    toast.success("Experiência removida.");
  }

  const totalYears = Math.floor(totalExperienceMonths / 12);
  const remainingMonths = totalExperienceMonths % 12;

  return (
    <div className="space-y-6">
      {editingExp !== null && (
        <ExperienceFormModal experience={editingExp === "new" ? null : editingExp} onClose={() => setEditingExp(null)} onSave={handleExpSave} />
      )}

      <div className="bg-white border border-line rounded-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold">Dados pessoais</h2>
          {!profileEditing && (
            <button onClick={() => setProfileEditing(true)} className="text-xs text-accent hover:underline flex items-center gap-1">
              <Pencil size={12} />
              Editar
            </button>
          )}
        </div>

        {profileEditing ? (
          <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input label="Nome" {...register("name")} />
              </div>
              <Input label="Telefone" {...register("phone")} />
              <Select label="Área de atuação" {...register("department")}>
                {DEPARTMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </Select>
              <Input label="Cidade" {...register("city")} />
              <Input label="Estado (UF)" maxLength={2} {...register("state")} />
              <div className="sm:col-span-2">
                <Input label="Posição desejada" {...register("desiredPosition")} />
              </div>
              <div className="sm:col-span-2">
                <Input label="Habilidades (vírgula)" {...register("skillsRaw")} />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  reset();
                  setProfileEditing(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                <Check size={13} />
                Salvar
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div>
              <span className="text-xs text-muted block">Nome</span>
              {candidateProfile.name}
            </div>
            <div>
              <span className="text-xs text-muted block">E-mail</span>
              {candidateProfile.email}
            </div>
            <div>
              <span className="text-xs text-muted block">Telefone</span>
              {candidateProfile.phone || "—"}
            </div>
            <div>
              <span className="text-xs text-muted block">Localização</span>
              {candidateProfile.city}, {candidateProfile.state}
            </div>
            <div>
              <span className="text-xs text-muted block">Posição desejada</span>
              {candidateProfile.desiredPosition}
            </div>
            <div>
              <span className="text-xs text-muted block">Área</span>
              {candidateProfile.department}
            </div>
            <div className="sm:col-span-2">
              <span className="text-xs text-muted block mb-1.5">Habilidades</span>
              <div className="flex flex-wrap gap-1.5">
                {candidateProfile.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border border-line rounded-sm p-5">
        <h2 className="font-display font-semibold mb-3">Currículo (PDF)</h2>
        <div className="border-2 border-dashed border-line rounded-sm p-6 text-center">
          <Upload size={24} className="mx-auto mb-2 text-muted" />
          <p className="text-sm text-muted mb-1">Arraste e solte ou clique para fazer upload</p>
          <p className="text-xs text-muted">PDF até 5MB</p>
          <button onClick={() => toast.info("Upload de currículo será integrado ao backend.")} className="mt-3 text-xs text-accent hover:underline">
            Selecionar arquivo
          </button>
        </div>
      </div>

      <div className="bg-white border border-line rounded-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold">Experiências profissionais</h2>
            {totalExperienceMonths > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={12} className="text-accent-dark" />
                <span className="text-xs text-accent-dark font-medium">
                  Total calculado: {totalYears > 0 ? `${totalYears}a ` : ""}
                  {remainingMonths > 0 ? `${remainingMonths}m` : ""}
                  {totalYears === 0 && remainingMonths === 0 ? "0m" : ""}
                </span>
              </div>
            )}
          </div>
          <Button size="sm" variant="secondary" onClick={() => setEditingExp("new")}>
            <Plus size={13} />
            Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {candidateProfile.experiences.length === 0 && <p className="text-sm text-muted py-6 text-center">Nenhuma experiência cadastrada.</p>}
          {candidateProfile.experiences.map((exp) => (
            <div key={exp.id} className="flex gap-4 p-4 border border-line rounded-sm">
              <div className="w-1 rounded-full bg-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{exp.role}</p>
                    <p className="text-xs text-muted">{exp.companyName}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {formatMonthYear(exp.startDate)} —{" "}
                      {exp.endDate ? formatMonthYear(exp.endDate) : <span className="text-accent-dark font-medium">Atual</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button onClick={() => setEditingExp(exp)} className="p-1.5 text-muted hover:text-ink hover:bg-paper rounded-sm transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDeleteExp(exp.id)} className="p-1.5 text-muted hover:text-danger hover:bg-danger-soft rounded-sm transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {exp.description && <p className="text-xs text-muted mt-2">{exp.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
