import React, { useState } from 'react';
import {
  GraduationCap,
  Award,
  Users,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Clock,
  Printer,
  Sparkles,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { useAppData } from '../../store/storage';
import { TurmaTreinamento, AlunoTreinamento } from '../../types';
import { formatarDataHora, formatarData } from '../../lib/utils';
import { MakerPixelLogo } from '../../components/visual/MakerPixelLogo';

export const TreinamentosPage: React.FC = () => {
  const { treinamentos, clientes, atualizarPresencaAluno, emitirCertificadoAluno } = useAppData();

  const [turmaSelecionada, setTurmaSelecionada] = useState<TurmaTreinamento>(treinamentos[0]);
  const [alunoCertificado, setAlunoCertificado] = useState<{
    aluno: AlunoTreinamento;
    turma: TurmaTreinamento;
  } | null>(null);

  const turmaAtual = treinamentos.find(t => t.id === (turmaSelecionada?.id || treinamentos[0]?.id)) || treinamentos[0];
  const clienteTurma = clientes.find(c => c.id === turmaAtual?.clienteId);

  const handleEmitirCertificado = (aluno: AlunoTreinamento) => {
    // Validação da regra de 75% ou mais
    if (aluno.percentualPresenca < 75) {
      alert(`Certificado Bloqueado: O aluno possui apenas ${aluno.percentualPresenca}% de frequência. A regra exige no mínimo 75% da carga horária.`);
      return;
    }
    emitirCertificadoAluno(turmaAtual.id, aluno.id);
    setAlunoCertificado({ aluno, turma: turmaAtual });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-maker-primary" /> Treinamentos & Certificados Oficiais
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Capacitação técnica do software <strong>MakerPixel Contábil</strong> & integração SCI Único com emissão de certificados oficiais (&ge; 75% presença).
          </p>
        </div>

        {/* Seletor de Turma */}
        <div className="flex items-center gap-2">
          <select
            value={turmaAtual?.id}
            onChange={e => {
              const t = treinamentos.find(item => item.id === e.target.value);
              if (t) setTurmaSelecionada(t);
            }}
            className="px-3 py-2 text-xs font-bold rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkCard text-slate-800 dark:text-white min-h-[44px]"
          >
            {treinamentos.map(t => (
              <option key={t.id} value={t.id}>
                {t.tema}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Detalhes da Turma Selecionada */}
      <div className="bg-white dark:bg-maker-darkCard border border-maker-border dark:border-maker-darkBorder rounded-[12px] p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-maker-border dark:border-maker-darkBorder">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">
                {turmaAtual.modalidade}
              </Badge>
              <Badge variant="neutral" size="sm">
                {turmaAtual.tipo === 'CONTRATO' ? 'Incluso no Contrato' : 'Turma Avulsa'}
              </Badge>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mt-2">
              {turmaAtual.tema}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Cliente: {clienteTurma?.nomeFantasia || 'Turma Aberta'} • {clienteTurma?.cidade}/{clienteTurma?.uf}
            </p>
          </div>

          <div className="text-right text-xs space-y-1">
            <span className="text-slate-500 block">
              <Calendar className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
              {formatarDataHora(turmaAtual.dataHora)}
            </span>
            <span className="text-slate-500 block">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-slate-400" /> Carga Horária: {turmaAtual.cargaHorariaHoras}h
            </span>
          </div>
        </div>

        {/* Tabela de Alunos / Presença e Emissão de Certificados */}
        <div className="mt-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Controle de Frequência & Alunos Inscritos
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Regra: Certificado liberado apenas com &gt;= 75% de presença
            </span>
          </div>

          <div className="border border-maker-border dark:border-maker-darkBorder rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/40 text-slate-500 font-semibold text-[11px] border-b border-maker-border dark:border-maker-darkBorder">
                  <th className="py-3 px-4">Nome do Aluno</th>
                  <th className="py-3 px-4">CPF / Documento</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Frequência (%)</th>
                  <th className="py-3 px-4 text-right">Certificado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-maker-border dark:divide-maker-darkBorder">
                {turmaAtual.alunos.map(aluno => {
                  const atendeRequisito = aluno.percentualPresenca >= 75;

                  return (
                    <tr key={aluno.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {aluno.nome}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono">{aluno.cpf}</td>
                      <td className="py-3 px-4 text-slate-500">{aluno.email}</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            step="5"
                            value={aluno.percentualPresenca}
                            onChange={e =>
                              atualizarPresencaAluno(
                                turmaAtual.id,
                                aluno.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-24 accent-maker-primary"
                          />
                          <span
                            className={`font-bold font-mono ${
                              atendeRequisito
                                ? 'text-maker-success'
                                : 'text-maker-danger'
                            }`}
                          >
                            {aluno.percentualPresenca}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {atendeRequisito ? (
                          <button
                            onClick={() => handleEmitirCertificado(aluno)}
                            className="px-3 py-1.5 rounded-lg bg-maker-primary hover:bg-maker-primaryHover text-white text-[11px] font-bold flex items-center gap-1.5 ml-auto shadow-sm"
                          >
                            <Award className="w-3.5 h-3.5" />
                            {aluno.certificadoEmitido ? 'Visualizar Certificado' : 'Emitir Certificado'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Abaixo de 75% (Bloqueado)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL DE CERTIFICADO OFICIAL MAKERPIXEL (IMPRESSÃO / VISUALIZAÇÃO) */}
      {alunoCertificado && (
        <Modal
          isOpen={Boolean(alunoCertificado)}
          onClose={() => setAlunoCertificado(null)}
          title="Certificado Oficial MakerPixel"
          subtitle="Documento com autenticação e assinatura dos instrutores"
          maxWidth="xl"
        >
          <div className="space-y-4">
            {/* Certificado Estilizado para Impressão */}
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-4 border-double border-maker-primary/40 shadow-xl text-center space-y-4 text-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <MakerPixelLogo />
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  CÓDIGO: {alunoCertificado.aluno.codigoValidacao || 'MP-CERT-2026-7890'}
                </span>
              </div>

              <div className="space-y-2 py-4">
                <span className="text-xs uppercase font-extrabold tracking-widest text-maker-primary block">
                  CERTIFICADO DE CAPACITAÇÃO PROFISSIONAL
                </span>
                <p className="text-xs text-slate-500">Certificamos com louvor que</p>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-serif">
                  {alunoCertificado.aluno.nome}
                </h3>
                <p className="text-xs text-slate-500">
                  portador(a) do documento CPF nº {alunoCertificado.aluno.cpf}, concluiu com êxito o treinamento
                </p>
                <h4 className="text-base font-bold text-slate-800 max-w-lg mx-auto">
                  "{alunoCertificado.turma.tema}"
                </h4>
                <p className="text-xs text-slate-500">
                  com carga horária de {alunoCertificado.turma.cargaHorariaHoras} horas e frequência de{' '}
                  <strong className="text-maker-success">
                    {alunoCertificado.aluno.percentualPresenca}%
                  </strong>
                  .
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-600">
                <div>
                  <div className="w-32 h-0.5 bg-slate-300 mx-auto mb-1" />
                  <p className="font-bold">Maurício</p>
                  <p className="text-[10px] text-slate-400">Diretor de Tecnologia • MakerPixel</p>
                </div>
                <div>
                  <div className="w-32 h-0.5 bg-slate-300 mx-auto mb-1" />
                  <p className="font-bold">Felipe</p>
                  <p className="text-[10px] text-slate-400">Diretor de Operações • MakerPixel</p>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400">
                Tubarão/SC • Emitido em {formatarData(new Date())}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setAlunoCertificado(null)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="min-h-[44px] px-5 py-2 text-xs font-bold rounded-xl bg-maker-primary text-white flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-4 h-4" /> Imprimir Certificado
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
