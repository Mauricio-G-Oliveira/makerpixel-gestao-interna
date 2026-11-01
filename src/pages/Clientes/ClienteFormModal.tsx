import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Cliente, OrigemCliente, SituacaoCliente } from '../../types';
import { buscarCnpjNaReceita } from '../../lib/brasilApi';
import { formatarDocumento, formatarTelefone, validarDocumento, apenasDigitos } from '../../lib/utils';

interface ClienteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteParaEditar?: Cliente | null;
  onSalvar: (dados: Omit<Cliente, 'id' | 'criadoEm' | 'historicoInteracoes'> & { id?: string }) => void;
}

export const ClienteFormModal: React.FC<ClienteFormModalProps> = ({
  isOpen,
  onClose,
  clienteParaEditar,
  onSalvar,
}) => {
  const [documento, setDocumento] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [contato, setContato] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SC');
  const [endereco, setEndereco] = useState('');
  const [cnae, setCnae] = useState('');
  const [origem, setOrigem] = useState<OrigemCliente>('PROSPECCAO');
  const [situacao, setSituacao] = useState<SituacaoCliente>('LEAD');
  const [situacaoReceita, setSituacaoReceita] = useState<string>('ATIVA');
  const [observacoes, setObservacoes] = useState('');

  const [buscandoReceita, setBuscandoReceita] = useState(false);
  const [alertaReceita, setAlertaReceita] = useState<string | null>(null);
  const [erroValidacao, setErroValidacao] = useState<string | null>(null);

  useEffect(() => {
    if (clienteParaEditar) {
      setDocumento(clienteParaEditar.documento);
      setRazaoSocial(clienteParaEditar.razaoSocial);
      setNomeFantasia(clienteParaEditar.nomeFantasia);
      setContato(clienteParaEditar.contato);
      setEmail(clienteParaEditar.email);
      setTelefone(clienteParaEditar.telefone);
      setCidade(clienteParaEditar.cidade);
      setUf(clienteParaEditar.uf);
      setEndereco(clienteParaEditar.endereco || '');
      setCnae(clienteParaEditar.cnae || '');
      setOrigem(clienteParaEditar.origem);
      setSituacao(clienteParaEditar.situacao);
      setSituacaoReceita(clienteParaEditar.situacaoReceita || 'ATIVA');
      setObservacoes(clienteParaEditar.observacoes || '');
    } else {
      setDocumento('');
      setRazaoSocial('');
      setNomeFantasia('');
      setContato('');
      setEmail('');
      setTelefone('');
      setCidade('Tubarão');
      setUf('SC');
      setEndereco('');
      setCnae('');
      setOrigem('PROSPECCAO');
      setSituacao('LEAD');
      setSituacaoReceita('ATIVA');
      setObservacoes('');
    }
    setAlertaReceita(null);
    setErroValidacao(null);
  }, [clienteParaEditar, isOpen]);

  // Consulta à Receita Federal via BrasilAPI preenchendo apenas campos vazios!
  const handleBuscarReceita = async () => {
    const limpo = apenasDigitos(documento);
    if (limpo.length !== 14) {
      setErroValidacao('Para buscar na Receita, informe um CNPJ válido com 14 dígitos.');
      return;
    }

    setBuscandoReceita(true);
    setAlertaReceita(null);
    setErroValidacao(null);

    const res = await buscarCnpjNaReceita(limpo);
    setBuscandoReceita(false);

    if (!res.sucesso || !res.dados) {
      setErroValidacao(res.mensagem || 'Não foi possível consultar os dados na Receita.');
      return;
    }

    const { dados } = res;
    setSituacaoReceita(dados.situacaoCadastral);

    // Regra: situação diferente de ATIVA mostra alerta em destaque
    if (dados.situacaoCadastral && dados.situacaoCadastral.toUpperCase() !== 'ATIVA') {
      setAlertaReceita(
        `Atenção: Situação cadastral na Receita é "${dados.situacaoCadastral}". Verifique pendências fiscais!`
      );
    }

    // Regra: Preenche SÓ os campos que estão vazios
    if (!razaoSocial.trim() && dados.razaoSocial) setRazaoSocial(dados.razaoSocial);
    if (!nomeFantasia.trim() && dados.nomeFantasia) setNomeFantasia(dados.nomeFantasia);
    if (!cidade.trim() && dados.cidade) setCidade(dados.cidade);
    if (!uf.trim() && dados.uf) setUf(dados.uf);
    if (!telefone.trim() && dados.telefone) setTelefone(dados.telefone);
    if (!endereco.trim() && dados.endereco) setEndereco(dados.endereco);
    if (!cnae.trim() && dados.cnae) setCnae(dados.cnae);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErroValidacao(null);

    // Validação real de dígitos de CNPJ ou CPF
    if (!validarDocumento(documento)) {
      setErroValidacao('Documento inválido. Informe um CNPJ ou CPF com dígitos verificadores válidos.');
      return;
    }

    if (!razaoSocial.trim()) {
      setErroValidacao('Razão social é obrigatória.');
      return;
    }

    onSalvar({
      id: clienteParaEditar?.id,
      documento: apenasDigitos(documento),
      razaoSocial,
      nomeFantasia: nomeFantasia || razaoSocial,
      contato,
      email,
      telefone: apenasDigitos(telefone),
      cidade,
      uf,
      endereco,
      cnae,
      origem,
      situacao,
      situacaoReceita,
      observacoes,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clienteParaEditar ? 'Editar Cliente' : 'Novo Cliente / Lead'}
      subtitle="Dados cadastrais completos com consulta integrada à Receita Federal"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {erroValidacao && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{erroValidacao}</span>
          </div>
        )}

        {alertaReceita && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
            <span>{alertaReceita}</span>
          </div>
        )}

        {/* Linha 1: Documento + Botão Buscar na Receita */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            CNPJ ou CPF (único) *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={formatarDocumento(documento)}
              onChange={e => setDocumento(e.target.value)}
              placeholder="00.000.000/0000-00 ou 000.000.000-00"
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
            <button
              type="button"
              onClick={handleBuscarReceita}
              disabled={buscandoReceita}
              className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
              title="Preenche apenas campos vazios via BrasilAPI"
            >
              {buscandoReceita ? (
                <Loader2 className="w-4 h-4 animate-spin text-maker-primary" />
              ) : (
                <Search className="w-4 h-4 text-maker-primary" />
              )}
              Buscar na Receita
            </button>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            A busca preenche automaticamente apenas os campos vazios e valida a situação cadastral.
          </span>
        </div>

        {/* Linha 2: Razão Social e Nome Fantasia */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Razão Social *
            </label>
            <input
              type="text"
              required
              value={razaoSocial}
              onChange={e => setRazaoSocial(e.target.value)}
              placeholder="Ex: ESCRITÓRIO MODELO CONTÁBIL LTDA"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nome Fantasia
            </label>
            <input
              type="text"
              value={nomeFantasia}
              onChange={e => setNomeFantasia(e.target.value)}
              placeholder="Ex: Modelo Contabilidade"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
        </div>

        {/* Linha 3: Contato Principal, E-mail e Telefone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nome do Contato
            </label>
            <input
              type="text"
              value={contato}
              onChange={e => setContato(e.target.value)}
              placeholder="Ex: João da Silva"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="contato@escritorio.com.br"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={formatarTelefone(telefone)}
              onChange={e => setTelefone(e.target.value)}
              placeholder="(48) 99999-9999"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
        </div>

        {/* Linha 4: Cidade, UF e Endereço */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Cidade *
            </label>
            <input
              type="text"
              required
              value={cidade}
              onChange={e => setCidade(e.target.value)}
              placeholder="Tubarão"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              UF *
            </label>
            <input
              type="text"
              maxLength={2}
              required
              value={uf}
              onChange={e => setUf(e.target.value.toUpperCase())}
              placeholder="SC"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Situação *
            </label>
            <select
              value={situacao}
              onChange={e => setSituacao(e.target.value as SituacaoCliente)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            >
              <option value="LEAD">LEAD (Prospecção)</option>
              <option value="PROPOSTA">PROPOSTA Enviada</option>
              <option value="CLIENTE">CLIENTE Ativo</option>
              <option value="EX_CLIENTE">EX_CLIENTE</option>
            </select>
          </div>
        </div>

        {/* Linha 5: Origem e CNAE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Origem do Cliente
            </label>
            <select
              value={origem}
              onChange={e => setOrigem(e.target.value as OrigemCliente)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            >
              <option value="PROSPECCAO">Prospecção Ativa (MakerPixel)</option>
              <option value="INDICACAO">Indicação de Parceiro</option>
              <option value="SITE">Site / Orgânico</option>
              <option value="EVENTO">Evento Contábil / Workshop</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              CNAE
            </label>
            <input
              type="text"
              value={cnae}
              onChange={e => setCnae(e.target.value)}
              placeholder="6920-6/01 - Atividades de contabilidade"
              className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30 min-h-[44px]"
            />
          </div>
        </div>

        {/* Linha 6: Observações */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Observações
          </label>
          <textarea
            rows={2}
            value={observacoes}
            onChange={e => setObservacoes(e.target.value)}
            placeholder="Informações adicionais sobre o escritório, software utilizado, quantidade de colaboradores..."
            className="w-full px-3 py-2 text-xs rounded-xl border border-maker-border dark:border-maker-darkBorder bg-white dark:bg-maker-darkBg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-maker-primary/30"
          />
        </div>

        {/* Botões do Rodapé */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-maker-border dark:border-maker-darkBorder">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="min-h-[44px] px-6 py-2.5 text-xs font-bold rounded-xl bg-maker-primary hover:bg-maker-primaryHover text-white transition-all shadow-md shadow-maker-primary/20"
          >
            Salvar Cliente
          </button>
        </div>
      </form>
    </Modal>
  );
};
