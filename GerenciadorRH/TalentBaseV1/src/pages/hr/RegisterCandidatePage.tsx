import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppData } from "../../hooks/useAppData";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { DEPARTMENTS } from "../../utils/domainOptions";
import { EXPERIENCE_RANGE_TO_MONTHS } from "../../utils/experience";
import type { NewCandidateInput } from "../../types";

type FormData = Omit<NewCandidateInput, "skills"> & { skillsRaw: string };

export default function RegisterCandidatePage() {
  const { createCandidate } = useAppData();
  const [done, setDone] = useState(false);
  const [lastName, setLastName] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  async function onSubmit(data: FormData) {
    await createCandidate({
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
      <div className="max-w-md mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-accent-soft border-2 border-accent/20 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-accent-dark" />
        </div>
        <h2 className="font-display text-2xl font-semibold mb-2">Cadastro concluído!</h2>
        <p className="text-sm text-muted mb-8">
          O currículo de <strong>{lastName}</strong> foi adicionado à base de candidatos.
        </p>
        <Button onClick={handleNew}>Cadastrar outro</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold">Cadastrar Currículo</h1>
        <p className="text-xs text-muted mt-0.5">Adicione um novo candidato à base de talentos</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-line rounded-sm p-6 space-y-5">
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Dados pessoais</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Nome completo *" placeholder="Ana Carolina Mendes" error={errors.name?.message} {...register("name", { required: "Nome é obrigatório" })} />
            </div>
            <Input label="E-mail *" type="email" placeholder="ana@email.com" error={errors.email?.message} {...register("email", { required: "E-mail é obrigatório" })} />
            <Input label="Telefone" placeholder="(11) 99999-9999" {...register("phone")} />
            <div className="sm:col-span-2">
              <Input label="Localização" placeholder="São Paulo, SP" {...register("location")} />
            </div>
          </div>
        </div>

        <div className="border-t border-line" />

        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Informações profissionais</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="Cargo / Posição *" placeholder="Desenvolvedora Frontend" error={errors.position?.message} {...register("position", { required: "Posição é obrigatória" })} />
            </div>
            <Select label="Departamento *" placeholder="Selecione" error={errors.department?.message} {...register("department", { required: "Departamento é obrigatório" })}>
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
            <Select label="Experiência (Caminho B)" placeholder="Selecione" defaultValue="" {...register("experience")}>
              {Object.keys(EXPERIENCE_RANGE_TO_MONTHS).map((k) => (
                <option key={k} value={k}>{k}</option>
              ))}
            </Select>
            <div className="sm:col-span-2">
              <Input label="Habilidades (separadas por vírgula)" placeholder="React, TypeScript, Figma" {...register("skillsRaw")} />
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          <UserPlus size={15} />
          {isSubmitting ? "Cadastrando..." : "Cadastrar candidato"}
        </Button>
      </form>
    </div>
  );
}
