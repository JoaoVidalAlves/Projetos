import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { DEPARTMENTS } from "../utils/domainOptions";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  city: string;
  state: string;
  desiredPosition: string;
  department: string;
  lgpd: boolean;
}

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({ defaultValues: { lgpd: false } });

  async function onSubmit(data: RegisterFormData) {
    if (!data.lgpd) {
      setError("lgpd", { message: "Você precisa aceitar o tratamento de dados para continuar." });
      return;
    }

    // Sem back-end real ainda: só o e-mail de demonstração autentica de fato.
    if (data.email.toLowerCase() === "ana.mendes@email.com") {
      const result = await login(data.email, data.password);
      if (result.ok) {
        toast.success("Conta criada com sucesso! Bem-vinda, Ana.");
        navigate("/candidato/perfil");
        return;
      }
    }
    toast.success("Cadastro realizado! Faça login para continuar.");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2.5 mb-8 hover:opacity-80 transition-opacity w-fit">
          <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center">
            <Briefcase size={14} className="text-white" />
          </div>
          <span className="font-display text-base font-semibold text-white">TalentBase</span>
        </Link>

        <h1 className="text-2xl font-display font-semibold text-white mb-1">Criar conta de candidato</h1>
        <p className="text-sm text-white/50 mb-8">Preencha seus dados para começar a se candidatar às vagas.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input
                dark
                label="Nome completo"
                placeholder="Ana Carolina Mendes"
                error={errors.name?.message}
                {...register("name", { required: "Informe seu nome" })}
              />
            </div>
            <div className="col-span-2">
              <Input
                dark
                type="email"
                label="E-mail"
                placeholder="seu@email.com"
                error={errors.email?.message}
                {...register("email", { required: "Informe seu e-mail" })}
              />
            </div>
            <div className="col-span-2">
              <Input
                dark
                type="password"
                label="Senha"
                placeholder="Mínimo 6 caracteres"
                error={errors.password?.message}
                {...register("password", { required: "Crie uma senha", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
              />
            </div>
            <Input
              dark
              label="Cidade"
              placeholder="São Paulo"
              error={errors.city?.message}
              {...register("city", { required: "Informe sua cidade" })}
            />
            <Input
              dark
              label="Estado (UF)"
              placeholder="SP"
              maxLength={2}
              error={errors.state?.message}
              {...register("state", { required: "Informe o estado", maxLength: { value: 2, message: "Use a sigla (ex: SP)" } })}
            />
            <div className="col-span-2">
              <Input
                dark
                label="Posição desejada"
                placeholder="Ex: Desenvolvedora Frontend"
                error={errors.desiredPosition?.message}
                {...register("desiredPosition", { required: "Informe a posição que busca" })}
              />
            </div>
            <div className="col-span-2">
              <Select
                dark
                label="Área de atuação"
                placeholder="Selecione a área"
                error={errors.department?.message}
                {...register("department", { required: "Selecione uma área" })}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-ink-2">
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-sm border border-white/10">
            <label className="flex gap-3 cursor-pointer">
              <input type="checkbox" {...register("lgpd")} className="mt-0.5 w-4 h-4 rounded-sm border-white/20 accent-accent flex-shrink-0" />
              <span className="text-xs text-white/60 leading-relaxed">
                Autorizo o tratamento dos meus dados pessoais pelo TalentBase conforme a{" "}
                <span className="text-accent">Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</span>, exclusivamente para fins de
                recrutamento e seleção.
              </span>
            </label>
            {errors.lgpd && <p className="mt-2 text-xs text-red-400">{errors.lgpd.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            <UserPlus size={15} />
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
