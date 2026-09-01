import { useForm } from "react-hook-form";
import type { Experience } from "../../types";
import type { NewExperienceInput } from "../../services/userService";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { Button } from "../../components/ui/Button";

interface ExperienceFormValues {
  companyName: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface ExperienceFormModalProps {
  experience: Experience | null;
  onClose: () => void;
  onSave: (data: NewExperienceInput) => Promise<void>;
}

export function ExperienceFormModal({ experience, onClose, onSave }: ExperienceFormModalProps) {
  const { register, handleSubmit, watch } = useForm<ExperienceFormValues>({
    defaultValues: experience
      ? {
          companyName: experience.companyName,
          role: experience.role,
          startDate: experience.startDate,
          endDate: experience.endDate ?? "",
          current: experience.endDate === null,
          description: experience.description ?? "",
        }
      : { current: false },
  });

  const isCurrent = watch("current");

  async function onSubmit(data: ExperienceFormValues) {
    await onSave({
      companyName: data.companyName,
      role: data.role,
      startDate: data.startDate,
      endDate: data.current ? null : data.endDate || null,
      description: data.description || undefined,
    });
    onClose();
  }

  return (
    <Modal title={experience ? "Editar experiência" : "Adicionar experiência"} onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
        <Input label="Empresa *" placeholder="Startup XYZ" {...register("companyName", { required: true })} />
        <Input label="Cargo *" placeholder="Desenvolvedora Pleno" {...register("role", { required: true })} />

        <div className="grid grid-cols-2 gap-3">
          <Input label="Início *" type="month" {...register("startDate", { required: true })} />
          <Input label="Fim" type="month" disabled={isCurrent} {...register("endDate")} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("current")} className="rounded-sm accent-accent" />
          <span className="text-xs font-medium">Trabalho aqui atualmente</span>
        </label>

        <Textarea label="Descrição (opcional)" rows={2} placeholder="Principais responsabilidades..." {...register("description")} />

        <div className="flex gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" className="flex-1">
            Salvar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
