import React, { useState, useMemo } from 'react';
import {
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  Phone,
  MessageCircle,
  Share2,
  CheckSquare,
  Square,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Users,
  Building,
  MapPin,
  X,
  FileCode,
  Smartphone,
} from 'lucide-react';
import { Modal } from './Modal';
import { Badge } from './Badge';
import {
  ContatoTubarao,
  CONTATOS_TUBARAO_RAW,
  exportarContatosParaCSV,
  exportarContatosParaJSON,
  exportarContatosParaVCard,
  gerarTextoDisparoWhatsApp,
  baixarCSVOriginalTubarao,
} from '../../store/contatosTubarao';
import { formatarTelefone } from '../../lib/utils';

interface ExportadorContatosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportarNovos?: (contatosImportados: ContatoTubarao[]) => void;
}

export const ExportadorContatosModal: React.FC<ExportadorContatosModalProps> = ({
  isOpen,
  onClose,
  onImportarNovos,
}) => {
  const [abaAtiva, setAbaAtiva] = useState<'exportar' | 'importar'>('exportar');

  // Filtros
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'TODOS' | 'CELULAR' | 'FIXO'>('TODOS');
  const [filtroBairro, setFiltroBairro] = useState<string>('TODOS');
  const [ignorarOrprocon, setIgnorarOrprocon] = useState<boolean>(true);

  // Seleção de contatos (IDs)
  const [selecionados, setSelecionados] = useState<Set<string>>(() => {
    // Inicialmente seleciona todos exceto Orprocon
    const initial = new Set<string>();
    CONTATOS_TUBARAO_RAW.forEach(c => {
      if (!c.isOrprocon) initial.add(c.id);
    });
    return initial;
  });

  // Toast de feedback
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);

  // Estado do Importador
  const [textoImportacao, setTextoImportacao] = useState('');
  const [erroImportacao, setErroImportacao] = useState<string | null>(null);

  // Lista única de bairros
  const bairrosDisponiveis = useMemo(() => {
    const set = new Set<string>();
    CONTATOS_TUBARAO_RAW.forEach(c => {
      if (c.bairro) set.add(c.bairro);
    });
    return Array.from(set).sort();
  }, []);

  // Filtragem dos contatos
  const contatosFiltrados = useMemo(() => {
    return CONTATOS_TUBARAO_RAW.filter(c => {
      if (ignorarOrprocon && c.isOrprocon) return false;

      // Filtro de busca
      const termo = busca.toLowerCase();
      const matchBusca =
        !busca ||
        c.nome.toLowerCase().includes(termo) ||
        c.bairro.toLowerCase().includes(termo) ||
        c.endereco.toLowerCase().includes(termo) ||
        c.telefone.includes(termo) ||
        c.telefoneOriginal.includes(termo);

      // Filtro de tipo
      let matchTipo = true;
      if (filtroTipo === 'CELULAR') matchTipo = c.hasWhatsapp;
      if (filtroTipo === 'FIXO') matchTipo = !c.hasWhatsapp && Boolean(c.telefone);

      // Filtro de bairro
      const matchBairro = filtroBairro === 'TODOS' || c.bairro === filtroBairro;

      return matchBusca && matchTipo && matchBairro;
    });
  }, [busca, filtroTipo, filtroBairro, ignorarOrprocon]);

  // Contatos efetivamente selecionados
  const contatosSelecionadosLista = useMemo(() => {
    return CONTATOS_TUBARAO_RAW.filter(c => selecionados.has(c.id));
  }, [selecionados]);

  // Controles de seleção
  const handleToggleSelecionar = (id: string) => {
    setSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelecionarTodosVisiveis = () => {
    setSelecionados(prev => {
      const next = new Set(prev);
      contatosFiltrados.forEach(c => next.add(c.id));
      return next;
    });
  };

  const handleDesmarcarTodos = () => {
    setSelecionados(new Set());
  };

  const mostrarToast = (msg: string) => {
    setToastMensagem(msg);
    setTimeout(() => setToastMensagem(null), 3000);
  };

  // Ações de exportação
  const handleExportarCSV = () => {
    if (contatosSelecionadosLista.length === 0) {
      alert('Selecione pelo menos um contato para exportar.');
      return;
    }
    exportarContatosParaCSV(contatosSelecionadosLista);
    mostrarToast(`Exportado arquivo CSV com ${contatosSelecionadosLista.length} contatos!`);
  };

  const handleExportarJSON = () => {
    if (contatosSelecionadosLista.length === 0) {
      alert('Selecione pelo menos um contato para exportar.');
      return;
    }
    exportarContatosParaJSON(contatosSelecionadosLista);
    mostrarToast(`Exportado arquivo JSON com ${contatosSelecionadosLista.length} contatos!`);
  };

  const handleExportarVCard = () => {
    if (contatosSelecionadosLista.length === 0) {
      alert('Selecione pelo menos um contato para exportar.');
      return;
    }
    exportarContatosParaVCard(contatosSelecionadosLista);
    mostrarToast(`Exportado arquivo vCard (.vcf) para agenda do celular!`);
  };

  const handleCopiarDisparoWhatsApp = () => {
    if (contatosSelecionadosLista.length === 0) {
      alert('Selecione pelo menos um contato para exportar.');
      return;
    }
    const texto = gerarTextoDisparoWhatsApp(contatosSelecionadosLista);
    navigator.clipboard.writeText(texto);
    mostrarToast(`Lista de ${contatosSelecionadosLista.length} contatos copiada para o WhatsApp!`);
  };

  // Ação de Importação
  const handleProcessarImportacao = () => {
    if (!textoImportacao.trim()) {
      setErroImportacao('Cole o texto dos contatos antes de importar.');
      return;
    }
    setErroImportacao(null);

    try {
      const linhas = textoImportacao.trim().split('\n');
      const importados: ContatoTubarao[] = [];
      let index = CONTATOS_TUBARAO_RAW.length + 1;

      linhas.forEach(linha => {
        const partes = linha.split(/[,;\t]/).map(p => p.trim());
        if (partes.length >= 2 && partes[0] && partes[0] !== 'Escritório' && partes[0] !== '#') {
          const nome = partes[0];
          const telRaw = partes[1] || '';
          const telClean = telRaw.replace(/\D/g, '');
          const bairro = partes[2] || 'Centro';
          const endereco = partes[3] || `Tubarão - ${bairro}`;

          importados.push({
            id: `cli-imp-${Date.now()}-${index}`,
            numero: index++,
            nome,
            telefone: telClean,
            telefoneOriginal: telRaw,
            tipo: telClean.length === 11 && telClean[2] === '9' ? 'Celular' : 'Fixo',
            hasWhatsapp: telClean.length === 11 && telClean[2] === '9',
            endereco,
            bairro,
            cidade: 'Tubarão',
            uf: 'SC',
            isOrprocon: nome.toLowerCase().includes('orprocon'),
            observacoes: 'Importado manualmente',
          });
        }
      });

      if (importados.length === 0) {
        setErroImportacao('Nenhum contato válido encontrado. Formato esperado: Nome, Telefone, Bairro, Endereço');
        return;
      }

      if (onImportarNovos) {
        onImportarNovos(importados);
      }

      mostrarToast(`Sucesso! ${importados.length} novos contatos processados.`);
      setTextoImportacao('');
      setAbaAtiva('exportar');
    } catch (err: any) {
      setErroImportacao(err.message || 'Erro ao processar contatos.');
    }
  };

  const todosVisiveisSelecionados =
    contatosFiltrados.length > 0 && contatosFiltrados.every(c => selecionados.has(c.id));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportador & Gerenciador de Contatos em Massa"
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Toast Notificação */}
        {toastMensagem && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {toastMensagem}
            </span>
            <button onClick={() => setToastMensagem(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Abas */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAbaAtiva('exportar')}
              className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-all ${
                abaAtiva === 'exportar'
                  ? 'text-maker-primary border-b-2 border-maker-primary'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" /> Exportar em Massa ({CONTATOS_TUBARAO_RAW.length} contatos)
            </button>
            <button
              onClick={() => setAbaAtiva('importar')}
              className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 transition-all ${
                abaAtiva === 'importar'
                  ? 'text-maker-primary border-b-2 border-maker-primary'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="w-4 h-4" /> Importar Novos Contatos (CSV / Texto)
            </button>
          </div>

          {/* Download Rápido do CSV Original */}
          <button
            onClick={baixarCSVOriginalTubarao}
            className="text-xs font-semibold text-maker-primary hover:underline flex items-center gap-1 pb-2"
            title="Baixar lista pura dos 47 escritórios de Tubarão em CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> Baixar CSV Original (47 Escritórios)
          </button>
        </div>

        {abaAtiva === 'exportar' ? (
          <>
            {/* Banner de Estatísticas */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Base</span>
                <span className="text-base font-extrabold text-slate-900 dark:text-white">
                  {CONTATOS_TUBARAO_RAW.length} escritórios
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-maker-primary block">Selecionados</span>
                <span className="text-base font-extrabold text-maker-primary">
                  {contatosSelecionadosLista.length} de {CONTATOS_TUBARAO_RAW.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-maker-success block">Com WhatsApp</span>
                <span className="text-base font-extrabold text-maker-success">
                  {CONTATOS_TUBARAO_RAW.filter(c => c.hasWhatsapp).length} números
                </span>
              </div>
              <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-center">
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Não Abordar</span>
                <span className="text-base font-extrabold text-rose-600">
                  Orprocon (Trabalho)
                </span>
              </div>
            </div>

            {/* Barra de Filtros */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                {/* Input de Busca */}
                <div className="sm:col-span-5 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    placeholder="Buscar por escritório, bairro, endereço..."
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary"
                  />
                </div>

                {/* Filtro por Tipo */}
                <div className="sm:col-span-3">
                  <select
                    value={filtroTipo}
                    onChange={e => setFiltroTipo(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary"
                  >
                    <option value="TODOS">Todos os Telefones</option>
                    <option value="CELULAR">Apenas WhatsApp (Celular)</option>
                    <option value="FIXO">Apenas Telefones Fixos</option>
                  </select>
                </div>

                {/* Filtro por Bairro */}
                <div className="sm:col-span-4">
                  <select
                    value={filtroBairro}
                    onChange={e => setFiltroBairro(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary"
                  >
                    <option value="TODOS">Todos os Bairros de Tubarão</option>
                    {bairrosDisponiveis.map(b => (
                      <option key={b} value={b}>
                        Bairro: {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botões de Ação de Seleção e Proteção Orprocon */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelecionarTodosVisiveis}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    Selecionar Todos Filtrados ({contatosFiltrados.length})
                  </button>
                  <button
                    onClick={handleDesmarcarTodos}
                    className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
                  >
                    Desmarcar Todos
                  </button>
                </div>

                {/* Checkbox de Proteção da Orprocon */}
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={ignorarOrprocon}
                    onChange={e => setIgnorarOrprocon(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500 w-3.5 h-3.5"
                  />
                  <span className="text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Ocultar Orprocon (Empresa onde trabalho)
                  </span>
                </label>
              </div>
            </div>

            {/* Tabela de Contatos */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold sticky top-0 z-10">
                  <tr>
                    <th className="p-2.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={todosVisiveisSelecionados}
                        onChange={() => {
                          if (todosVisiveisSelecionados) {
                            handleDesmarcarTodos();
                          } else {
                            handleSelecionarTodosVisiveis();
                          }
                        }}
                        className="rounded text-maker-primary focus:ring-maker-primary w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="p-2.5"># Escritório Contábil</th>
                    <th className="p-2.5">Telefone</th>
                    <th className="p-2.5">Bairro</th>
                    <th className="p-2.5">Endereço</th>
                    <th className="p-2.5 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {contatosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        Nenhum escritório contábil encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  ) : (
                    contatosFiltrados.map(c => {
                      const isSel = selecionados.has(c.id);
                      return (
                        <tr
                          key={c.id}
                          className={`transition-colors ${
                            c.isOrprocon
                              ? 'bg-rose-50/50 dark:bg-rose-950/20'
                              : isSel
                              ? 'bg-blue-50/40 dark:bg-blue-950/20'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="p-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSel}
                              disabled={c.isOrprocon}
                              onChange={() => handleToggleSelecionar(c.id)}
                              className="rounded text-maker-primary focus:ring-maker-primary w-4 h-4 cursor-pointer disabled:opacity-40"
                            />
                          </td>
                          <td className="p-2.5 font-semibold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-slate-400 text-[11px]">#{c.numero}</span>
                              <span className="truncate max-w-[200px]" title={c.nome}>
                                {c.nome}
                              </span>
                              {c.isOrprocon && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-200 font-bold whitespace-nowrap">
                                  Trabalho (Não Abordar)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-2.5 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono">
                                {c.telefone ? formatarTelefone(c.telefone) : c.telefoneOriginal || 'Não informado'}
                              </span>
                              {c.hasWhatsapp ? (
                                <Badge variant="success" size="sm">
                                  WhatsApp
                                </Badge>
                              ) : (
                                <Badge variant="neutral" size="sm">
                                  {c.tipo}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-2.5 whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {c.bairro}
                          </td>
                          <td className="p-2.5 text-slate-500 dark:text-slate-400 truncate max-w-[220px]" title={c.endereco}>
                            {c.endereco}
                          </td>
                          <td className="p-2.5 text-center whitespace-nowrap">
                            {c.hasWhatsapp && c.telefone && !c.isOrprocon ? (
                              <a
                                href={`https://wa.me/55${c.telefone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" /> Abrir WA
                              </a>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Painel de Formatos de Exportação (4 Opções) */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-maker-primary" /> Escolha o Formato de Exportação dos {contatosSelecionadosLista.length} Contatos Selecionados:
                </span>
                <span className="text-[11px] text-slate-400">
                  Pronto para Excel, CRM ou Disparo
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. CSV Excel */}
                <button
                  onClick={handleExportarCSV}
                  className="p-3 rounded-xl bg-white dark:bg-maker-darkCard border border-slate-200 dark:border-slate-700 hover:border-maker-primary hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[90px] group"
                >
                  <div className="flex items-center justify-between text-maker-primary">
                    <FileSpreadsheet className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                      Planilha
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-maker-primary">
                      Planilha CSV (Excel)
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      BOM UTF-8 para abrir com acentuação perfeita
                    </p>
                  </div>
                </button>

                {/* 2. Lista WhatsApp / Disparo */}
                <button
                  onClick={handleCopiarDisparoWhatsApp}
                  className="p-3 rounded-xl bg-white dark:bg-maker-darkCard border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[90px] group"
                >
                  <div className="flex items-center justify-between text-emerald-600">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                      Disparador
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600">
                      Copiar Lista WhatsApp
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Formato direto `55DDDNumero;Nome;Bairro`
                    </p>
                  </div>
                </button>

                {/* 3. vCard para Celular */}
                <button
                  onClick={handleExportarVCard}
                  className="p-3 rounded-xl bg-white dark:bg-maker-darkCard border border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[90px] group"
                >
                  <div className="flex items-center justify-between text-purple-600">
                    <Smartphone className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded">
                      Agenda Celular
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600">
                      Exportar vCard (.vcf)
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Importa todos contatos no iPhone ou Android
                    </p>
                  </div>
                </button>

                {/* 4. JSON Completo */}
                <button
                  onClick={handleExportarJSON}
                  className="p-3 rounded-xl bg-white dark:bg-maker-darkCard border border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col justify-between min-h-[90px] group"
                >
                  <div className="flex items-center justify-between text-amber-500">
                    <FileCode className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">
                      Estruturado
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-500">
                      Exportar JSON
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Para scripts ou automação do backend
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* ABA: IMPORTADOR EM MASSA */
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-maker-primary mb-1 flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> Como importar novos contatos em massa
              </h4>
              <p>
                Cole abaixo uma lista de escritórios contábeis. Cada linha deve conter:
                <br />
                <code className="font-mono font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded mt-1 inline-block">
                  Nome do Escritório, Telefone, Bairro, Endereço
                </code>
              </p>
            </div>

            {erroImportacao && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
                {erroImportacao}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Cole os dados dos contatos (CSV ou texto delimitado por vírgula):
              </label>
              <textarea
                value={textoImportacao}
                onChange={e => setTextoImportacao(e.target.value)}
                rows={8}
                placeholder={`Exemplo:\nContabilidade Estrela, 48999887766, Centro, Rua das Flores 100\nSoluções Fiscais Sul, 4836224400, Oficinas, Av. Principal 50`}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-maker-darkCard text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAbaAtiva('exportar')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleProcessarImportacao}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-maker-primary hover:bg-maker-primaryHover text-white shadow-md shadow-maker-primary/20 flex items-center gap-1.5 min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4" /> Processar e Importar Contatos
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
