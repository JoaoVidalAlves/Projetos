import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface LoginFormData {
  email: string;
  password: string;
}

const DEMO_ACCOUNTS = [
  { email: "rh@empresa.com.br", label: "Painel RH" },
  { email: "ana.mendes@email.com", label: "Candidato" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    const result = await login(data.email, data.password);
    if (!result.ok) {
      setError("email", { message: result.error });
      return;
    }
    toast.success("Bem-vindo de volta!");
    const isHr = data.email.toLowerCase() === "rh@empresa.com.br";
    navigate(isHr ? "/rh/dashboard" : "/candidato/perfil");
  }

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Painel esquerdo — identidade da marca */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-gradient-to-br from-ink to-ink-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-sm bg-accent flex items-center justify-center">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-semibold text-white tracking-tight">TalentBase</span>
        </div>
        <div>
          <p className="text-4xl font-display font-semibold text-white leading-snug mb-4">
            Cada candidatura,
            <br />
            uma ficha bem cuidada.
          </p>
          <p className="text-sm text-white/50 max-w-sm">
            Gerencie processos seletivos, acompanhe candidaturas e encontre o candidato ideal com um painel só seu.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-accent">90+</p>
            <p className="text-xs text-white/40 mt-0.5">Candidatos</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-accent">7</p>
            <p className="text-xs text-white/40 mt-0.5">Vagas Abertas</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-display font-semibold text-accent">11</p>
            <p className="text-xs text-white/40 mt-0.5">Contratações</p>
          </div>
        </div>
      </div>

      {/* Painel direito — formulário */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-7 h-7 rounded-sm bg-accent flex items-center justify-center">
              <Briefcase size={14} className="text-white" />
            </div>
            <span className="font-display text-base font-semibold text-white">TalentBase</span>
          </div>

          <h1 className="text-2xl font-display font-semibold text-white mb-1">Entrar na conta</h1>
          <p className="text-sm text-white/50 mb-8">Acesse o painel de RH ou o portal do candidato.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              dark
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register("email", { required: "Informe seu e-mail" })}
            />
            <Input
              dark
              label="Senha"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", { required: "Informe sua senha" })}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
              <LogIn size={15} />
              {isSubmitting ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="text-center text-xs text-white/40 mt-6">
            Candidato sem conta?{" "}
            <Link to="/cadastro" className="text-accent hover:underline">
              Criar conta grátis
            </Link>
          </p>

          <div className="mt-8 p-4 bg-white/5 rounded-sm border border-white/10">
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-3">Contas demo</p>
            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((account) => (
                <div key={account.email}>
                  <p className="text-xs font-medium text-accent">{account.label}</p>
                  <p className="text-xs text-white/60 font-mono">{account.email}</p>
                </div>
              ))}
              <p className="text-[10px] text-white/30">Qualquer senha funciona.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
