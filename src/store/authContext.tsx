import React, { createContext, useContext, useState, useEffect } from 'react';
import { Usuario, PerfilUsuario } from '../types';

interface AuthContextType {
  usuario: Usuario;
  setUsuario: (u: Usuario) => void;
  alternarPerfil: (perfil: PerfilUsuario) => void;
  alternarSocio: (socioNumero: 1 | 2) => void;
  isSocio: boolean;
  isColaborador: boolean;
  temaEscuro: boolean;
  alternarTema: () => void;
  logout: () => void;
}

const USUARIO_PADRAO: Usuario = {
  id: 'usr-1',
  nome: 'Maurício',
  email: 'mauricio@makerpixel.com.br',
  perfil: 'SOCIO',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario>(() => {
    try {
      const saved = localStorage.getItem('mp_usuario_ativo');
      return saved ? JSON.parse(saved) : USUARIO_PADRAO;
    } catch {
      return USUARIO_PADRAO;
    }
  });

  const [temaEscuro, setTemaEscuro] = useState<boolean>(() => {
    return localStorage.getItem('mp_dark_mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mp_usuario_ativo', JSON.stringify(usuario));
  }, [usuario]);

  useEffect(() => {
    localStorage.setItem('mp_dark_mode', String(temaEscuro));
    if (temaEscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [temaEscuro]);

  const alternarPerfil = (perfil: PerfilUsuario) => {
    setUsuario(prev => ({
      ...prev,
      perfil,
      nome: perfil === 'SOCIO' ? 'Maurício (Sócio)' : 'Carla (Colaboradora)',
      email: perfil === 'SOCIO' ? 'mauricio@makerpixel.com.br' : 'carla@makerpixel.com.br',
    }));
  };

  const alternarSocio = (socioNumero: 1 | 2) => {
    if (socioNumero === 1) {
      setUsuario({
        id: 'usr-1',
        nome: 'Maurício',
        email: 'mauricio@makerpixel.com.br',
        perfil: 'SOCIO',
      });
    } else {
      setUsuario({
        id: 'usr-2',
        nome: 'Felipe',
        email: 'felipe@makerpixel.com.br',
        perfil: 'SOCIO',
      });
    }
  };

  const alternarTema = () => setTemaEscuro(prev => !prev);

  const logout = () => {
    setUsuario(USUARIO_PADRAO);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        setUsuario,
        alternarPerfil,
        alternarSocio,
        isSocio: usuario.perfil === 'SOCIO',
        isColaborador: usuario.perfil === 'COLABORADOR',
        temaEscuro,
        alternarTema,
        logout,
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
