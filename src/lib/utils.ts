// Utilitários de formatação e regras de negócio de precisão

export function formatarMoeda(valor: number | undefined | null): string {
  if (valor === undefined || valor === null || isNaN(valor)) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
}

export function formatarData(dataStr?: string | Date | null): string {
  if (!dataStr) return '-';
  const d = typeof dataStr === 'string' ? new Date(dataStr.length === 10 ? `${dataStr}T12:00:00` : dataStr) : dataStr;
  if (isNaN(d.getTime())) return '-';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataHora(dataStr?: string | null): string {
  if (!dataStr) return '-';
  const d = new Date(dataStr);
  if (isNaN(d.getTime())) return '-';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  const hora = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${ano} às ${hora}:${min}`;
}

export function formatarCompetencia(competencia: string): string {
  if (!competencia || !competencia.includes('-')) return competencia;
  const [ano, mes] = competencia.split('-');
  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const mesNome = meses[parseInt(mes, 10) - 1] || mes;
  return `${mesNome} de ${ano}`;
}

export function getCompetenciaAtual(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  return `${ano}-${mes}`;
}

// Limpa caracteres especiais mantendo apenas dígitos
export function apenasDigitos(str?: string): string {
  return (str || '').replace(/\D/g, '');
}

// Validação real de dígitos verificadores de CPF
export function validarCPF(cpf: string): boolean {
  const clean = apenasDigitos(cpf);
  if (clean.length !== 11) return false;
  if (/^(\d)\1+$/.test(clean)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(clean.charAt(i), 10) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(clean.charAt(9), 10)) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(clean.charAt(i), 10) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(clean.charAt(10), 10);
}

// Validação real de dígitos verificadores de CNPJ
export function validarCNPJ(cnpj: string): boolean {
  const clean = apenasDigitos(cnpj);
  if (clean.length !== 14) return false;
  if (/^(\d)\1+$/.test(clean)) return false;

  let tamanho = 12;
  let numeros = clean.substring(0, tamanho);
  const digitos = clean.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0), 10)) return false;

  tamanho = 13;
  numeros = clean.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1), 10);
}

export function validarDocumento(doc: string): boolean {
  const limpo = apenasDigitos(doc);
  if (limpo.length === 11) return validarCPF(limpo);
  if (limpo.length === 14) return validarCNPJ(limpo);
  return false;
}

export function formatarDocumento(doc: string): string {
  const clean = apenasDigitos(doc);
  if (clean.length === 11) {
    return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  if (clean.length === 14) {
    return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return doc;
}

export function formatarTelefone(tel?: string): string {
  if (!tel) return '';
  const clean = apenasDigitos(tel);
  if (clean.length === 11) {
    return clean.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (clean.length === 10) {
    return clean.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return tel;
}

// Cálculo do primeiro mês proporcional (valor ÷ dias do mês × dias a partir do início)
export function calcularValorProporcional(valorMensal: number, dataInicioStr: string): number {
  const dataInicio = new Date(`${dataInicioStr}T12:00:00`);
  const ano = dataInicio.getFullYear();
  const mes = dataInicio.getMonth();
  const ultimoDiaMes = new Date(ano, mes + 1, 0).getDate();
  const diaInicio = dataInicio.getDate();
  const diasRestantes = ultimoDiaMes - diaInicio + 1;

  if (diasRestantes <= 0 || diasRestantes >= ultimoDiaMes) {
    return valorMensal;
  }
  const valorProporcional = (valorMensal / ultimoDiaMes) * diasRestantes;
  return Math.round(valorProporcional * 100) / 100;
}

// Método do Maior Resto para distribuição de lucros exata em centavos
export function distribuirComMaiorResto(
  valorTotalCentavos: number,
  participacoes: { id: string; percentual: number }[]
): { [socioId: string]: number } {
  if (valorTotalCentavos <= 0) {
    const res: { [socioId: string]: number } = {};
    participacoes.forEach(p => (res[p.id] = 0));
    return res;
  }

  const exato = participacoes.map(p => {
    const share = (valorTotalCentavos * p.percentual) / 100;
    const inteiro = Math.floor(share);
    const resto = share - inteiro;
    return { id: p.id, inteiro, resto };
  });

  const somaInteiros = exato.reduce((acc, curr) => acc + curr.inteiro, 0);
  let diferenca = valorTotalCentavos - somaInteiros;

  // Ordena pelo maior resto decrescente
  const ordenado = [...exato].sort((a, b) => b.resto - a.resto);

  const resultado: { [id: string]: number } = {};
  exato.forEach(e => {
    resultado[e.id] = e.inteiro;
  });

  // Distribui os centavos restantes
  for (let i = 0; i < diferenca; i++) {
    const target = ordenado[i % ordenado.length];
    resultado[target.id] += 1;
  }

  // Converte de volta para reais
  const resultadoReais: { [id: string]: number } = {};
  Object.keys(resultado).forEach(id => {
    resultadoReais[id] = resultado[id] / 100;
  });

  return resultadoReais;
}
