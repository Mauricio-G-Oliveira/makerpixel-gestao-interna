import React, { useState } from 'react';
import {
  Settings,
  Users,
  Sliders,
  History,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Save,
  Lock,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { useAppData } from '../../store/storage';
import { useAuth } from '../../store/authContext';
import { Socio, ParametrosEmpresa } from '../../types';
import { formatarDataHora } from '../../lib/utils';

export const ConfiguracoesPage: React.FC = () => {
  const { usuario } = useAuth();
  const {
    socios,
    parametros,
    auditoria,
    salvarSocios,
    setParametros,
  } = useAppData();

  const [aba, setAba] = useState<'socios' | 'parametros' | 'auditoria'>('socios');

  // Estado dos Sócios
  const [listaSocios, setListaSocios] = useState<Socio[]>(socios);
  const [erroSocios, setErroSocios] = useState<string | null>(null);
  const [sucessoSocios, setSucessoSocios] = useState(false);

  // Estado dos Parâmetros
  const [formParametros, setFormParametros] = useState<ParametrosEmpresa>(parametros);
  const [sucessoParametros, setSucessoParametros] = useState(false);

  // Filtro de Auditoria
  const [filtroAuditoria, setFiltroAuditoria] = useState('');

  const somaParticipacao = listaSocios.reduce((acc, s) => acc + (Number(s.participacao) || 0), 0);

  const handleSalvarSocios = (e: React.FormEvent) => {
    e.preventDefault();
    setErroSocios(null);
    setSucessoSocios(false);

    try {
      salvarSocios(listaSocios);
      setSucessoSocios(true);
      setTimeout(() => setSucessoSocios(false), 3000);
    } catch (err: any) {
      setErroSocios(err.message || 'Erro ao salvar sócios');
    }
  };

  const handleSalvarParametros = (e: React.FormEvent) => {
    e.preventDefault();
    setParametros(formParametros);
    setSucessoParametros(true);
    setTimeout(() => setSucessoParametros(false), 3000);
  };

  const auditoriaFiltrada = auditoria.filter(
    item =>
      item.resumo.toLowerCase().includes(filtroAuditoria.toLowerCase()) ||
      item.quem.toLowerCase().includes(filtroAuditoria.toLowerCase()) ||
      item.entidade.toLowerCase().includes(filtroAuditoria.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-maker-primary" /> Configurações & Auditoria do Sistema
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sócios da MakerPixel (50% / 50%), regras de reserva técnica, vigências e trilha completa de auditoria.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-maker-border dark:border-maker-darkBorder">
        <button
          onClick={() => setAba('socios')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-1.5 ${
            aba === 'socios'
              ? 'text-maker-primary border-b-2 border-maker-primary'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" /> Cadastro de Sócios & Quotas
        </button>

        <button
          onClick={() => setAba('parametros')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-1.5 ${
            aba === 'parametros'
              ? 'text-maker-primary border-b-2 border-maker-primary'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" /> Parâmetros da Empresa
        </button>

        <button
          onClick={() => setAba('auditoria')}
          className={`pb-3 px-4 text-xs font-bold transition-all flex items-center gap-1.5 ${
            aba === 'auditoria'
              ? 'text-maker-primary border-b-2 border-maker-primary'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <History className="w-4 h-4" /> Trilha de Auditoria ({auditoria.length})
        </button>
      </div>

      {/* ABA SÓCIOS */}
      {aba === 'socios' && (
        <form onSubmit={handleSalvarSocios} className="space-y-5">
          {erroSocios && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{erroSocios}</span>
            </div>
          )}

          {sucessoSocios && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Sócios e participações salvos com sucesso!</span>
            </div>
          )}

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-white block">
                Regra Estatutária de Participação
              </span>
              <span className="text-slate-500">
                A soma das participações vigentes precisa totalizar exatamente 100%. Mudar a participação não altera cálculos de meses anteriores.
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block font-semibold">Soma Atual</span>
              <span
                className={`text-lg font-mono font-extrabold ${
                  Math.abs(somaParticipacao - 100) < 0.01
                    ? 'text-maker-success'
                    : 'text-maker-danger'
                }`}
              >
                {somaParticipacao}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listaSocios.map((s, idx) => (
              <div
                key={s.id}
                className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-maker-border dark:border-maker-darkBorder">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    Sócio {idx + 1}
                  </span>
                  <Badge variant="primary" size="sm">
                    {s.participacao}%
                  </Badge>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={s.nome}
                    onChange={e => {
                      const novo = [...listaSocios];
                      novo[idx].nome = e.target.value;
                      setListaSocios(novo);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail Corporativo *
                  </label>
                  <input
                    type="email"
                    required
                    value={s.email}
                    onChange={e => {
                      const novo = [...listaSocios];
                      novo[idx].email = e.target.value;
                      setListaSocios(novo);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Participação (%) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      required
                      value={s.participacao}
                      onChange={e => {
                        const novo = [...listaSocios];
                        novo[idx].participacao = Number(e.target.value) || 0;
                        setListaSocios(novo);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Vigência (AAAA-MM) *
                    </label>
                    <input
                      type="text"
                      required
                      value={s.vigenciaInicio}
                      onChange={e => {
                        const novo = [...listaSocios];
                        novo[idx].vigenciaInicio = e.target.value;
                        setListaSocios(novo);
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Pró-Labore Mensal (Despesa Operacional R$)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={s.proLaboreMensal || 6000}
                    onChange={e => {
                      const novo = [...listaSocios];
                      novo[idx].proLaboreMensal = Number(e.target.value) || 0;
                      setListaSocios(novo);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-3">
            <button
              type="submit"
              className="min-h-[44px] px-6 py-2.5 bg-maker-primary hover:bg-maker-primaryHover text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-maker-primary/20"
            >
              <Save className="w-4 h-4" /> Salvar Quotas dos Sócios
            </button>
          </div>
        </form>
      )}

      {/* ABA PARÂMETROS */}
      {aba === 'parametros' && (
        <form onSubmit={handleSalvarParametros} className="space-y-4 max-w-2xl">
          {sucessoParametros && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Parâmetros da empresa atualizados com sucesso!</span>
            </div>
          )}

          <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Percentual da Reserva da Empresa (%) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formParametros.reservaPercentual}
                  onChange={e =>
                    setFormParametros(p => ({
                      ...p,
                      reservaPercentual: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Padrão 20% retido</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Índice de Reajuste Padrão *
                </label>
                <input
                  type="text"
                  value={formParametros.indiceReajustePadrao}
                  onChange={e =>
                    setFormParametros(p => ({ ...p, indiceReajustePadrao: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Multa por Atraso (%) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formParametros.multaAtrasoPercentual}
                  onChange={e =>
                    setFormParametros(p => ({
                      ...p,
                      multaAtrasoPercentual: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Padrão 2% fixo</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Juros ao Mês (%) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formParametros.jurosMesPercentual}
                  onChange={e =>
                    setFormParametros(p => ({
                      ...p,
                      jurosMesPercentual: Number(e.target.value) || 0,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">Padrão 1% ao mês</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Limite da Fila da Semana (Leads)
                </label>
                <input
                  type="number"
                  min="5"
                  max="30"
                  value={formParametros.limiteLeadSemana}
                  onChange={e =>
                    setFormParametros(p => ({
                      ...p,
                      limiteLeadSemana: Number(e.target.value) || 10,
                    }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Cidade Sede (Prioridade Regional)
                </label>
                <input
                  type="text"
                  value={formParametros.cidadeSede}
                  onChange={e =>
                    setFormParametros(p => ({ ...p, cidadeSede: e.target.value }))
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-slate-50 dark:bg-maker-darkBg text-slate-800 dark:text-white min-h-[44px]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="min-h-[44px] px-6 py-2.5 bg-maker-primary hover:bg-maker-primaryHover text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-maker-primary/20"
              >
                <Save className="w-4 h-4" /> Salvar Parâmetros
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ABA AUDITORIA */}
      {aba === 'auditoria' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500">
              Registro imutável de eventos sensíveis (fechar/reabrir mês, aprovação dupla de lucros, reajustes e contratos).
            </span>

            <input
              type="text"
              placeholder="Filtrar por ação, autor ou resumo..."
              value={filtroAuditoria}
              onChange={e => setFiltroAuditoria(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white min-w-[260px] min-h-[44px]"
            />
          </div>

          <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-semibold text-[11px] border-b border-maker-border dark:border-maker-darkBorder">
                  <th className="py-3 px-4">Data e Hora</th>
                  <th className="py-3 px-4">Autor</th>
                  <th className="py-3 px-4">Entidade</th>
                  <th className="py-3 px-4">Ação</th>
                  <th className="py-3 px-4">Resumo da Operação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder font-mono text-[11px]">
                {auditoriaFiltrada.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {formatarDataHora(item.quando)}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      {item.quem}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {item.entidade}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="neutral" size="sm">
                        {item.acao}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-sans text-xs text-slate-700 dark:text-slate-200">
                      {item.resumo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
