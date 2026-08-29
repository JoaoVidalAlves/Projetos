import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Trash2, X, Check, Clock, Upload } from "lucide-react";
import { useAppData } from "../../context";
import { useAuth } from "../../context";
import { DEPARTMENTS } from "../../data";
import type { Experiencia } from "../../types";
import { toast } from "sonner";

// ---- Experience Form ----
interface ExpForm {
  nomeEmpresa: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  atual: boolean;
  descricao: string;
}

function ExperienciaFormModal({
  exp,
  onClose,
  onSave,
}: {
  exp: Experiencia | null;
  onClose: () => void;
  onSave: (data: Omit<Experiencia, "id" | "candidatoId">) => void;
}) {
  const { register, handleSubmit, watch } = useForm<ExpForm>({
    defaultValues: exp
      ? {
          nomeEmpresa: exp.nomeEmpresa,
          cargo: exp.cargo,
          dataInicio: exp.dataInicio,
          dataFim: exp.dataFim ?? "",
          atual: exp.dataFim === null,
          descricao: exp.descricao ?? "",
        }
      : { atual: false },
  });

  const isAtual = watch("atual");

  function onSubmit(data: ExpForm) {
    onSave({
      nomeEmpresa: data.nomeEmpresa,
      cargo: data.cargo,
      dataInicio: data.dataInicio,
      dataFim: data.atual ? null : data.dataFim || null,
      descricao: data.descricao || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-display font-semibold text-sm">{exp ? "Editar experiência" : "Adicionar experiência"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Empresa *</label>
            <input {...register("nomeEmpresa", { required: true })} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" placeholder="Startup XYZ" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Cargo *</label>
            <input {...register("cargo", { required: true })} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" placeholder="Desenvolvedora Pleno" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">Início *</label>
              <input type="month" {...register("dataInicio", { required: true })} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Fim</label>
              <input
                type="month"
                {...register("dataFim")}
                disabled={isAtual}
                className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566] disabled:opacity-40"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register("atual")} className="rounded accent-[#00C566]" />
            <span className="text-xs font-medium">Trabalho aqui atualmente</span>
          </label>

          <div>
            <label className="block text-xs font-medium mb-1.5">Descrição (opcional)</label>
            <textarea {...register("descricao")} rows={2} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566] resize-none" placeholder="Principais responsabilidades..." />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2 border border-border rounded text-sm hover:bg-muted transition-colors">Cancelar</button>
            <button type="submit" className="flex-1 py-2 bg-[#00C566] text-white rounded text-sm font-medium hover:bg-[#00B05A] transition-colors">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---- Profile Form ----
interface ProfileFormData {
  name: string;
  phone: string;
  cidade: string;
  estado: string;
  posicaoDesejada: string;
  department: string;
  skillsRaw: string;
}

// ---- Main Page ----
export default function PerfilPage() {
  const { user } = useAuth();
  const { candidatoProfile, updateCandidatoProfile, addExperiencia, updateExperiencia, deleteExperiencia, experienciasTotalMeses } = useAppData();
  const [editingExp, setEditingExp] = useState<Experiencia | null | "new">(null);
  const [profileEditing, setProfileEditing] = useState(false);

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      name: candidatoProfile.name,
      phone: candidatoProfile.phone,
      cidade: candidatoProfile.cidade,
      estado: candidatoProfile.estado,
      posicaoDesejada: candidatoProfile.posicaoDesejada,
      department: candidatoProfile.department,
      skillsRaw: candidatoProfile.skills.join(", "),
    },
  });

  function onProfileSave(data: ProfileFormData) {
    updateCandidatoProfile({
      name: data.name,
      phone: data.phone,
      cidade: data.cidade,
      estado: data.estado,
      posicaoDesejada: data.posicaoDesejada,
      department: data.department,
      skills: data.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    setProfileEditing(false);
    toast.success("Perfil atualizado!");
  }

  function handleExpSave(data: Omit<Experiencia, "id" | "candidatoId">) {
    if (editingExp && editingExp !== "new") {
      updateExperiencia(editingExp.id, data);
      toast.success("Experiência atualizada.");
    } else {
      addExperiencia(data);
      toast.success("Experiência adicionada.");
    }
  }

  function handleDeleteExp(id: string) {
    deleteExperiencia(id);
    toast.success("Experiência removida.");
  }

  const totalAnos = Math.floor(experienciasTotalMeses / 12);
  const totalMesesResto = experienciasTotalMeses % 12;

  function formatDateMonthYear(dateStr: string) {
    const [year, month] = dateStr.split("-");
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${months[parseInt(month) - 1]}/${year}`;
  }

  return (
    <div className="space-y-6">
      {/* Experience modal */}
      {editingExp !== null && (
        <ExperienciaFormModal
          exp={editingExp === "new" ? null : editingExp}
          onClose={() => setEditingExp(null)}
          onSave={handleExpSave}
        />
      )}

      {/* Profile card */}
      <div className="bg-white border border-border rounded p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold">Dados pessoais</h2>
          {!profileEditing && (
            <button onClick={() => setProfileEditing(true)} className="text-xs text-[#00C566] hover:underline flex items-center gap-1">
              <Pencil size={12} />Editar
            </button>
          )}
        </div>

        {profileEditing ? (
          <form onSubmit={handleSubmit(onProfileSave)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Nome</label>
                <input {...register("name")} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Telefone</label>
                <input {...register("phone")} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Área de atuação</label>
                <select {...register("department")} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]">
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Cidade</label>
                <input {...register("cidade")} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Estado (UF)</label>
                <input {...register("estado")} maxLength={2} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Posição desejada</label>
                <input {...register("posicaoDesejada")} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Habilidades (vírgula)</label>
                <input {...register("skillsRaw")} className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => { reset(); setProfileEditing(false); }} className="px-4 py-2 border border-border rounded text-xs hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button type="submit" className="px-4 py-2 bg-[#00C566] text-white rounded text-xs font-medium hover:bg-[#00B05A] transition-colors flex items-center gap-1.5">
                <Check size={13} />Salvar
              </button>
            </div>
          </form>
        ) : (
          <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <div><span className="text-xs text-muted-foreground block">Nome</span>{candidatoProfile.name}</div>
            <div><span className="text-xs text-muted-foreground block">E-mail</span>{candidatoProfile.email}</div>
            <div><span className="text-xs text-muted-foreground block">Telefone</span>{candidatoProfile.phone || "—"}</div>
            <div><span className="text-xs text-muted-foreground block">Localização</span>{candidatoProfile.cidade}, {candidatoProfile.estado}</div>
            <div><span className="text-xs text-muted-foreground block">Posição desejada</span>{candidatoProfile.posicaoDesejada}</div>
            <div><span className="text-xs text-muted-foreground block">Área</span>{candidatoProfile.department}</div>
            <div className="sm:col-span-2">
              <span className="text-xs text-muted-foreground block mb-1.5">Habilidades</span>
              <div className="flex flex-wrap gap-1.5">
                {candidatoProfile.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded font-medium">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CV upload (mock) */}
      <div className="bg-white border border-border rounded p-5">
        <h2 className="font-display font-semibold mb-3">Currículo (PDF)</h2>
        <div className="border-2 border-dashed border-border rounded p-6 text-center">
          <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">Arraste e solte ou clique para fazer upload</p>
          <p className="text-xs text-muted-foreground">PDF até 5MB</p>
          <button
            onClick={() => toast.info("Upload de currículo será integrado ao backend.")}
            className="mt-3 text-xs text-[#00C566] hover:underline"
          >
            Selecionar arquivo
          </button>
        </div>
      </div>

      {/* Experiences */}
      <div className="bg-white border border-border rounded p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold">Experiências profissionais</h2>
            {experienciasTotalMeses > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <Clock size={12} className="text-[#00C566]" />
                <span className="text-xs text-[#00C566] font-medium">
                  Total calculado (Seção 5.2): {totalAnos > 0 ? `${totalAnos}a ` : ""}{totalMesesResto > 0 ? `${totalMesesResto}m` : ""}
                  {totalAnos === 0 && totalMesesResto === 0 ? "0m" : ""}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setEditingExp("new")}
            className="flex items-center gap-1.5 text-xs bg-foreground text-primary-foreground px-3 py-2 rounded hover:opacity-90 transition-opacity"
          >
            <Plus size={13} />Adicionar
          </button>
        </div>

        <div className="space-y-4">
          {candidatoProfile.experiencias.length === 0 && (
            <p className="text-sm text-muted-foreground py-6 text-center">Nenhuma experiência cadastrada.</p>
          )}
          {candidatoProfile.experiencias.map((exp) => (
            <div key={exp.id} className="flex gap-4 p-4 border border-border rounded">
              <div className="w-1 rounded-full bg-[#00C566] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{exp.cargo}</p>
                    <p className="text-xs text-muted-foreground">{exp.nomeEmpresa}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateMonthYear(exp.dataInicio)} — {exp.dataFim ? formatDateMonthYear(exp.dataFim) : <span className="text-[#00C566] font-medium">Atual</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                    <button onClick={() => setEditingExp(exp)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => handleDeleteExp(exp.id)} className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {exp.descricao && <p className="text-xs text-muted-foreground mt-2">{exp.descricao}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
