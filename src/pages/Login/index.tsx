import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Download,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react';
import { useAuth } from '../../store/authContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, temaEscuro, alternarTema, canInstallPWA, instalarPWA, isStandalone } = useAuth();

  const [email, setEmail] = useState('mauriciogoulart.deoliveira37@gmail.com');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    setTimeout(() => {
      const res = login(email, senha, lembrar);
      if (res.sucesso) {
        navigate('/');
      } else {
        setErro(res.mensagem || 'Falha na autenticação');
        setCarregando(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-[#0E1726] text-slate-100 relative overflow-hidden font-sans">
      {/* Elementos visuais de fundo (Blur e Grade MakerPixel) */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-maker-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Barra superior de utilidades */}
      <header className="relative z-10 p-4 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Logo MakerPixel */}
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 p-1.5 flex flex-wrap gap-1 items-center justify-center shadow-lg shadow-maker-primary/10">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2F5BEA]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0F7A4A]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#B45309]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#2F5BEA]" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white block">MakerPixel</span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">Gestão Interna</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canInstallPWA && !isStandalone && (
            <button
              onClick={instalarPWA}
              className="px-3 py-1.5 rounded-xl bg-maker-primary/20 border border-maker-primary/40 text-maker-primary hover:bg-maker-primary/30 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Instalar no Computador como Aplicativo PWA"
            >
              <Laptop className="w-3.5 h-3.5" /> Instalar App no PC
            </button>
          )}

          <button
            onClick={alternarTema}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors"
            title={temaEscuro ? 'Modo claro' : 'Modo escuro'}
          >
            {temaEscuro ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Caixa de Login Central */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/60">
          {/* Header da Caixa */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-maker-primary/10 border border-maker-primary/30 text-maker-primary flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Acesso Exclusivo
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Painel Operacional & Societário do Titular Único
            </p>
          </div>

          {/* Banner de Erro */}
          {erro && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{erro}</span>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo E-mail */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                E-mail Cadastrado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-maker-primary focus:ring-1 focus:ring-maker-primary min-h-[44px] transition-colors"
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Senha de Acesso
                </label>
                <span className="text-[11px] text-slate-400">Titular Único</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full pl-10 pr-11 py-2.5 text-xs rounded-xl border border-slate-700 bg-slate-950 text-white placeholder-slate-500 focus:outline-none focus:border-maker-primary focus:ring-1 focus:ring-maker-primary min-h-[44px] transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  title={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Lembrar-me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={e => setLembrar(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-maker-primary focus:ring-maker-primary focus:ring-offset-slate-900"
                />
                <span>Lembrar neste computador (PWA)</span>
              </label>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={carregando}
              className="w-full min-h-[46px] mt-2 px-5 py-2.5 rounded-xl bg-maker-primary hover:bg-maker-primaryHover text-white text-xs font-bold transition-all shadow-lg shadow-maker-primary/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {carregando ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando credenciais...
                </span>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Dica de Segurança e PWA */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/60 px-3 py-1 rounded-full border border-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ambiente Protegido • Acesso Unipessoal</span>
            </div>

            {canInstallPWA && !isStandalone && (
              <p className="text-[11px] text-slate-400">
                💡 Você pode instalar este sistema como aplicativo no Mac/PC usando o botão no topo ou o ícone na barra do Chrome.
              </p>
            )}
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <footer className="relative z-10 p-4 text-center text-[11px] text-slate-500">
        MakerPixel Soluções Tecnológicas Ltda • Tubarão / SC • Todos os direitos reservados
      </footer>
    </div>
  );
};
