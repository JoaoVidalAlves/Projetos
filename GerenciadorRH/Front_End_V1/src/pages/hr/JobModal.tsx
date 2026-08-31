import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { Job, JobStatus, NewJobInput, UpdateJobInput } from "../../types";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";
import { DEPARTMENTS, MODALITIES, JOB_TYPES, ALL_JOB_STATUSES } from "../../utils/domainOptions";

interface JobFormData {
  title: string;
  department: string;
  location: string;
  modality: string;
  type: string;
  openings: number;
  status: JobStatus;
  minExperienceMonths: number;
  description: string;
  skills: string;
}

interface JobModalProps {
  job: Job | null;
  onClose: () => void;
  onCreate: (data: NewJobInput) => Promise<void>;
  onUpdate: (id: string, data: UpdateJobInput) => Promise<void>;
}

export function JobModal({ job, onClose, onCreate, onUpdate }: JobModalProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<JobFormData>({
    defaultValues: job
      ? {
          title: job.title,
          department: job.department,
          location: job.location,
          modality: job.modality,
          type: job.type,
          openings: job.openings,
          status: job.status,
          minExperienceMonths: job.minExperienceMonths,
          description: job.description ?? "",
          skills: (job.skills ?? []).join(", "),
        }
      : { status: "Aberta", modality: "Híbrido", type: "CLT", openings: 1, minExperienceMonths: 24 },
  });

  async function onSubmit(data: JobFormData) {
    const payload = {
      ...data,
      openings: Number(data.openings),
      minExperienceMonths: Number(data.minExperienceMonths),
      skills: data.skills.split(",").map((s) => s.trim()).filter(Boolean),
    };
    if (job) {
      await onUpdate(job.id, payload);
      toast.success("Vaga atualizada com sucesso!");
    } else {
      await onCreate(payload);
      toast.success("Vaga criada com sucesso!");
    }
    onClose();
  }

  return (
    <Modal title={job ? "Editar vaga" : "Nova vaga"} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <Input label="Título da vaga" placeholder="Ex: Desenvolvedor Frontend" {...register("title", { required: true })} />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Departamento" placeholder="Selecione" {...register("department", { required: true })}>
            {DEPARTMENTS.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </Select>
          <Input label="Localização" placeholder="São Paulo, SP" {...register("location", { required: true })} />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Select label="Modalidade" {...register("modality")}>
            {MODALITIES.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
          <Select label="Contrato" {...register("type")}>
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
          <Input label="Vagas" type="number" min={1} {...register("openings")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Status" {...register("status")}>
            {ALL_JOB_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <Input label="Exp. mínima (meses)" type="number" min={0} {...register("minExperienceMonths")} />
        </div>

        <Input label="Habilidades (separadas por vírgula)" placeholder="React, TypeScript, CSS" {...register("skills")} />
        <Textarea label="Descrição" rows={3} placeholder="Descreva a vaga..." {...register("description")} />

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {job ? "Salvar alterações" : "Criar vaga"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
