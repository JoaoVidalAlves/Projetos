import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { UserCheck, UserPlus } from "lucide-react";
import { useAuth } from "../context";
import { toast } from "sonner";
import { DEPARTMENTS } from "../data";

interface FormData {
  name: string;
  email: string;
  password: string;
  cidade: string;
  estado: string;
  posicaoDesejada: string;
  department: string;
  lgpd: boolean;
}

export default function CadastroPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { lgpd: false } });

  function onSubmit(data: FormData) {
    if (!data.lgpd) {
      setError("lgpd", { message: "Você precisa aceitar o tratamento de dados para continuar." });
      return;
    }
    // Only the demo email creates a real session in the mock; new registrations simulate success
    if (data.email.toLowerCase() === "ana.mendes@email.com") {
      const result = login(data.email, data.password);
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
    <div className="min-h-screen bg-[#0D0D14] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded bg-[#00C566] flex items-center justify-center">
              <UserCheck size={14} className="text-white" />
            </div>
            <span className="font-display text-base font-semibold text-white">TalentBase</span>
          </Link>
        </div>

        <h1 className="text-2xl font-display font-semibold text-white mb-1">Criar conta de candidato</h1>
        <p className="text-sm text-white/50 mb-8">Preencha seus dados para começar a se candidatar às vagas.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1.5">Nome completo</label>
              <input
                {...register("name", { required: "Informe seu nome" })}
                placeholder="Ana Carolina Mendes"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1.5">E-mail</label>
              <input
                type="email"
                {...register("email", { required: "Informe seu e-mail" })}
                placeholder="seu@email.com"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1.5">Senha</label>
              <input
                type="password"
                {...register("password", { required: "Crie uma senha", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Cidade</label>
              <input
                {...register("cidade", { required: "Informe sua cidade" })}
                placeholder="São Paulo"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.cidade && <p className="mt-1 text-xs text-red-400">{errors.cidade.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Estado (UF)</label>
              <input
                {...register("estado", { required: "Informe o estado", maxLength: { value: 2, message: "Use a sigla (ex: SP)" } })}
                placeholder="SP"
                maxLength={2}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.estado && <p className="mt-1 text-xs text-red-400">{errors.estado.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1.5">Posição desejada</label>
              <input
                {...register("posicaoDesejada", { required: "Informe a posição que busca" })}
                placeholder="Ex: Desenvolvedora Frontend"
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.posicaoDesejada && <p className="mt-1 text-xs text-red-400">{errors.posicaoDesejada.message}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1.5">Área de atuação</label>
              <select
                {...register("department", { required: "Selecione uma área" })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00C566] transition-colors appearance-none"
              >
                <option value="" className="bg-[#1A1A2E]">Selecione a área</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-[#1A1A2E]">{d}</option>
                ))}
              </select>
              {errors.department && <p className="mt-1 text-xs text-red-400">{errors.department.message}</p>}
            </div>
          </div>

          {/* LGPD Consent — Section 3 */}
          <div className="p-4 bg-white/5 rounded border border-white/10">
            <label className="flex gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("lgpd")}
                className="mt-0.5 w-4 h-4 rounded border-white/20 accent-[#00C566] flex-shrink-0"
              />
              <span className="text-xs text-white/60 leading-relaxed">
                Autorizo o tratamento dos meus dados pessoais pelo TalentBase conforme a{" "}
                <span className="text-[#00C566]">Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018)</span>, exclusivamente para fins de recrutamento e seleção.
              </span>
            </label>
            {errors.lgpd && <p className="mt-2 text-xs text-red-400">{errors.lgpd.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-[#00C566] hover:bg-[#00B05A] text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-60"
          >
            <UserPlus size={15} />
            {isSubmitting ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="text-center text-xs text-white/40 mt-6">
          Já tem conta?{" "}
          <Link to="/login" className="text-[#00C566] hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
