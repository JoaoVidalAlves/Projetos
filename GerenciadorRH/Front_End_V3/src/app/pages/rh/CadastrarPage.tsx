import { useForm } from "react-hook-form";
import { UserPlus, CheckCircle } from "lucide-react";
import { useAppData } from "../../context";
import { DEPARTMENTS, ALL_STATUSES, EXP_TO_MONTHS } from "../../data";
import type { Candidate } from "../../types";
import { toast } from "sonner";
import { useState } from "react";

type FormData = Omit<Candidate, "id" | "status" | "appliedDate"> & { skillsRaw: string };

export default function CadastrarPage() {
  const { addCandidate } = useAppData();
  const [done, setDone] = useState(false);
  const [lastName, setLastName] = useState("");
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  function onSubmit(data: FormData) {
    addCandidate({
      name: data.name,
      position: data.position,
      department: data.department,
      email: data.email,
      phone: data.phone,
      experience: data.experience,
      skills: data.skillsRaw.split(",").map((s) => s.trim()).filter(Boolean),
      location: data.location,
    });
    setLastName(data.name);
    setDone(true);
    toast.success(`Currículo de ${data.name} cadastrado com sucesso!`);
  }

  function handleNew() {
    reset();
    setDone(false);
  }

  if (done) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-full bg-[#00C566]/10 border-2 border-[#00C566]/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-[#00C566]" />
          </div>
          <h2 className="font-display text-2xl font-semibold mb-2">Cadastro concluído!</h2>
          <p className="text-sm text-muted-foreground mb-8">
            O currículo de <strong>{lastName}</strong> foi adicionado à base de candidatos.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleNew} className="px-5 py-2.5 bg-[#00C566] text-white text-sm font-medium rounded hover:bg-[#00B05A] transition-colors">
              Cadastrar outro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-2xl">
        <div className="mb-6">
          <h1 className="font-display text-xl font-semibold">Cadastrar Currículo</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Adicione um novo candidato à base de talentos</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-border rounded p-6 space-y-5">
          {/* Personal info */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Dados pessoais</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Nome completo *</label>
                <input
                  {...register("name", { required: "Nome é obrigatório" })}
                  placeholder="Ana Carolina Mendes"
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">E-mail *</label>
                <input
                  type="email"
                  {...register("email", { required: "E-mail é obrigatório" })}
                  placeholder="ana@email.com"
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Telefone</label>
                <input
                  {...register("phone")}
                  placeholder="(11) 99999-9999"
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Localização</label>
                <input
                  {...register("location")}
                  placeholder="São Paulo, SP"
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Professional */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Informações profissionais</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Cargo / Posição *</label>
                <input
                  {...register("position", { required: "Posição é obrigatória" })}
                  placeholder="Desenvolvedora Frontend"
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                />
                {errors.position && <p className="mt-1 text-xs text-red-500">{errors.position.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Departamento *</label>
                <select
                  {...register("department", { required: "Departamento é obrigatório" })}
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                >
                  <option value="">Selecione</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
                {errors.department && <p className="mt-1 text-xs text-red-500">{errors.department.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5">Experiência (Caminho B)</label>
                <select
                  {...register("experience")}
                  defaultValue=""
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                >
                  <option value="">Selecione</option>
                  {Object.keys(EXP_TO_MONTHS).map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium mb-1.5">Habilidades (separadas por vírgula)</label>
                <input
                  {...register("skillsRaw")}
                  placeholder="React, TypeScript, Figma"
                  className="w-full text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00C566]"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#00C566] hover:bg-[#00B05A] text-white text-sm font-medium py-2.5 rounded transition-colors"
            >
              <UserPlus size={15} />
              Cadastrar candidato
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
