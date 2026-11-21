import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../types';

export interface AuthContextType {
  autenticado: boolean;
  usuario: Usuario;
  login: (email: string, senha: string, lembrar?: boolean) => { sucesso: boolean; mensagem?: string };
  logout: () => void;
  isSocio: boolean;
  isColaborador: boolean;
  temaEscuro: boolean;
  alternarTema: () => void;
  // PWA (Desktop / Mobile Installation)
  canInstallPWA: boolean;
  isStandalone: boolean;
  instalarPWA: () => Promise<void>;
}

// Credenciais e perfil oficial do Titular Único
const CREDENCIAIS_OFICIAIS = {
  emailsValidos: [
    'mauriciogoulart.deoliveira37@gmail.com',
    'mauricio@makerpixel.com.br',
  ],
  senhaValida: 'xb100pro',
};

export const USUARIO_TITULAR: Usuario = {
  id: 'usr-mauricio',
  nome: 'Mauricio goulart de oliveira',
  email: 'mauriciogoulart.deoliveira37@gmail.com',
  perfil: 'SOCIO',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const AUTH_STORAGE_KEY = 'mp_auth_session_v3';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Verifica se já existe sessão salva
  const [autenticado, setAutenticado] = useState<boolean>(() => {
    try {
      const savedSession = localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        return Boolean(parsed?.autenticado);
      }
      return false;
    } catch {
      return false;
    }
  });

  const [usuario, setUsuario] = useState<Usuario>(USUARIO_TITULAR);

  const [temaEscuro, setTemaEscuro] = useState<boolean>(() => {
    return localStorage.getItem('mp_dark_mode') === 'true';
  });

  // Estado PWA (Instalação no PC / Desktop)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    );
  });

  // Listener para capturar o evento de instalação do PWA
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    const handleAppInstalled = () => {
      setCanInstallPWA(false);
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const instalarPWA = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setCanInstallPWA(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn('Erro ao disparar prompt PWA:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('mp_dark_mode', String(temaEscuro));
    if (temaEscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [temaEscuro]);

  // Função de Login Exclusiva para o Titular
  const login = (email: string, senha: string, lembrar: boolean = true) => {
    const emailLimpo = email.trim().toLowerCase();
    const senhaLimpa = senha.trim();

    const emailEhValido = CREDENCIAIS_OFICIAIS.emailsValidos.some(
      e => e.toLowerCase() === emailLimpo
    );

    if (emailEhValido && senhaLimpa === CREDENCIAIS_OFICIAIS.senhaValida) {
      const sessao = {
        autenticado: true,
        email: emailLimpo,
        nome: USUARIO_TITULAR.nome,
        logadoEm: new Date().toISOString(),
        lembrar,
      };

      if (lembrar) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessao));
      } else {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessao));
      }

      setUsuario({
        ...USUARIO_TITULAR,
        email: emailLimpo,
      });
      setAutenticado(true);
      return { sucesso: true };
    }

    return {
      sucesso: false,
      mensagem: 'Credenciais inválidas. O acesso a este sistema é restrito ao titular único da MakerPixel.',
    };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAutenticado(false);
  };

  const alternarTema = () => setTemaEscuro(prev => !prev);

  return (
    <AuthContext.Provider
      value={{
        autenticado,
        usuario,
        login,
        logout,
        isSocio: true,
        isColaborador: false,
        temaEscuro,
        alternarTema,
        canInstallPWA,
        isStandalone,
        instalarPWA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
