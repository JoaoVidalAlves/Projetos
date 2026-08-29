import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { UserCheck, LogIn } from "lucide-react";
import { useAuth } from "../context";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const DEMO = [
    { email: "rh@empresa.com.br", role: "RH" },
    { email: "ana.mendes@email.com", role: "Candidato" },
  ];

  function onSubmit(data: FormData) {
    const result = login(data.email, data.password);
    if (!result.ok) {
      setError("email", { message: result.error });
      return;
    }
    const matched = DEMO.find((d) => d.email.toLowerCase() === data.email.toLowerCase());
    toast.success("Bem-vindo de volta!");
    if (matched?.role === "RH") navigate("/rh/dashboard");
    else navigate("/candidato/perfil");
  }

  return (
    <div className="min-h-screen bg-[#0D0D14] flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-[#0D0D14] to-[#1A1A2E]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#00C566] flex items-center justify-center">
            <UserCheck size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-white tracking-tight">TalentBase</span>
        </div>
        <div>
          <p className="text-4xl font-display font-semibold text-white leading-snug mb-4">
            Conectando talentos<br />às melhores oportunidades.
          </p>
          <p className="text-sm text-white/50 max-w-sm">
            Gerencie processos seletivos, acompanhe candidaturas e encontre o candidato ideal com eficiência.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-[#00C566]">90+</p>
            <p className="text-xs text-white/40 mt-0.5">Candidatos</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-[#00C566]">7</p>
            <p className="text-xs text-white/40 mt-0.5">Vagas Abertas</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-[#00C566]">11</p>
            <p className="text-xs text-white/40 mt-0.5">Contratações</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded bg-[#00C566] flex items-center justify-center">
              <UserCheck size={14} className="text-white" />
            </div>
            <span className="font-display text-base font-semibold text-white">TalentBase</span>
          </div>

          <h1 className="text-2xl font-display font-semibold text-white mb-1">Entrar na conta</h1>
          <p className="text-sm text-white/50 mb-8">Acesse o painel RH ou o portal do candidato.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">E-mail</label>
              <input
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                {...register("email", { required: "Informe seu e-mail" })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Senha</label>
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                {...register("password", { required: "Informe sua senha" })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#00C566] transition-colors"
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-[#00C566] hover:bg-[#00B05A] text-white text-sm font-medium py-2.5 rounded transition-colors disabled:opacity-60 mt-2"
            >
              <LogIn size={15} />
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-xs text-white/40 mt-6">
            Candidato sem conta?{" "}
            <Link to="/cadastro" className="text-[#00C566] hover:underline">Criar conta grátis</Link>
          </p>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-white/5 rounded border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Contas demo</p>
            <div className="space-y-2.5">
              <div>
                <p className="text-xs font-medium text-[#00C566]">Painel RH</p>
                <p className="text-xs text-white/60 font-mono">rh@empresa.com.br</p>
              </div>
              <div>
                <p className="text-xs font-medium text-blue-400">Candidato</p>
                <p className="text-xs text-white/60 font-mono">ana.mendes@email.com</p>
              </div>
              <p className="text-[10px] text-white/30">Qualquer senha funciona.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
