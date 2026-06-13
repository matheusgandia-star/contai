import type { Category } from './types'

// Keyword map: category icon id / common names → keywords in Portuguese
const KEYWORD_MAP: Record<string, string[]> = {
  food:              ['pizza', 'lanche', 'hamburguer', 'burguer', 'sanduiche', 'hot dog', 'hotdog', 'salgado', 'pastel', 'coxinha', 'esfiha', 'tapioca', 'crepe', 'waffle', 'açaí', 'acai', 'sorvete', 'gelato', 'doceria', 'confeitaria', 'padaria', 'padoca', 'café', 'cafe', 'cafeteria', 'restaurante', 'almoço', 'almoco', 'jantar', 'janta', 'marmita', 'delivery', 'ifood', 'rappi', 'refeição', 'refeicao', 'prato', 'comida'],
  groceries:        ['mercado', 'supermercado', 'feira', 'hortifruti', 'verdura', 'fruta', 'legume', 'carne', 'frango', 'peixe', 'leite', 'queijo', 'iogurte', 'manteiga', 'ovo', 'ovos', 'pão', 'pao', 'arroz', 'feijão', 'feijao', 'massa', 'macarrao', 'macarrão', 'farinha', 'açúcar', 'acucar', 'sal', 'azeite', 'óleo', 'oleo', 'molho', 'compras do mes', 'compras da semana', 'carrefour', 'extra', 'pão de açúcar', 'atacadão', 'atacadao', 'assaí', 'assai', 'sams club'],
  transportation:   ['uber', '99', 'táxi', 'taxi', 'ônibus', 'onibus', 'metro', 'metrô', 'trem', 'van', 'mototaxi', 'passagem', 'condução', 'conducao', 'transporte', 'brt', 'lotação', 'lotacao'],
  fuel:             ['gasolina', 'combustivel', 'combustível', 'etanol', 'diesel', 'posto', 'abasteci', 'abastecer', 'tanque', 'litro'],
  car:              ['estacionamento', 'parking', 'ipva', 'seguro do carro', 'revisão', 'revisao', 'oficina', 'mecânico', 'mecanico', 'pneu', 'troca de óleo', 'lavagem', 'lava rapido'],
  health:           ['farmácia', 'farmacia', 'remédio', 'remedio', 'medicamento', 'consulta', 'médico', 'medico', 'dentista', 'exame', 'laboratorio', 'laboratório', 'hospital', 'clinica', 'clínica', 'plano de saude', 'plano de saúde', 'drogaria', 'droga'],
  gym:              ['academia', 'gym', 'crossfit', 'pilates', 'yoga', 'natação', 'natacao', 'personal', 'musculação', 'musculacao'],
  entertainment:    ['cinema', 'teatro', 'show', 'ingresso', 'evento', 'parque', 'netflix', 'spotify', 'amazon prime', 'disney', 'hbo', 'streaming', 'jogo', 'game', 'playstation', 'xbox', 'steam', 'clube'],
  shopping:         ['roupa', 'calçado', 'calcado', 'tênis', 'tenis', 'camiseta', 'camisa', 'calça', 'calca', 'vestido', 'saia', 'blusa', 'jaqueta', 'casaco', 'meia', 'cueca', 'sutiã', 'sutia', 'bolsa', 'mochila', 'acessório', 'acessorio', 'zara', 'renner', 'riachuelo', 'c&a', 'shein', 'shopee', 'magazine', 'magalu', 'americanas', 'amazon'],
  home:             ['aluguel', 'condomínio', 'condominio', 'conta de luz', 'energia', 'agua', 'água', 'gas', 'gás', 'internet', 'tv a cabo', 'mobilia', 'móvel', 'movel', 'sofá', 'sofa', 'cama', 'guarda roupa', 'geladeira', 'fogão', 'fogao', 'microondas', 'ar condicionado', 'faxina', 'diarista', 'limpeza'],
  education:        ['curso', 'faculdade', 'escola', 'colégio', 'colegio', 'mensalidade', 'livro', 'apostila', 'material escolar', 'papelaria', 'udemy', 'alura', 'coursera', 'inglês', 'ingles', 'idioma'],
  pets:             ['pet shop', 'ração', 'racao', 'veterinário', 'veterinario', 'banho do pet', 'banho do cachorro', 'banho do gato', 'coleira', 'vacina do pet', 'remédio do pet'],
  gifts_and_donations: ['presente', 'gift', 'doação', 'doacao', 'aniversário', 'aniversario', 'natal', 'dia das mães', 'dia dos pais'],
  investments:      ['investimento', 'aplicação', 'aplicacao', 'poupança', 'poupanca', 'tesouro', 'ação', 'acao', 'fundo', 'cdb', 'lci', 'lca', 'bitcoin', 'cripto'],
  salary:           ['salário', 'salario', 'pagamento', 'recebi', 'renda', 'freelance', 'freela', 'honorário', 'honorario'],
  spa:              ['salão', 'salao', 'barbearia', 'manicure', 'pedicure', 'massagem', 'estética', 'estetica', 'spa', 'depilação', 'depilacao', 'sobrancelha', 'cabelo', 'corte de cabelo'],
  clothing:         ['moda', 'look', 'outfit', 'bijuteria', 'joia', 'jóia', 'relógio', 'relogio', 'oculos', 'óculos', 'perfume', 'cosmético', 'cosmetico'],
  family_and_children: ['creche', 'escola infantil', 'brinquedo', 'fraldas', 'fralda', 'baby', 'bebê', 'bebe'],
  debts_and_loans:  ['parcela', 'prestação', 'prestacao', 'financiamento', 'empréstimo', 'emprestimo', 'dívida', 'divida', 'cartão', 'cartao', 'fatura'],
  airplane:         ['passagem aérea', 'passagem aerea', 'voo', 'vôo', 'avião', 'aviao', 'viagem', 'hotel', 'hospedagem', 'airbnb', 'booking'],
  mug:              ['café da manhã', 'cafe da manha', 'lanchonete', 'quiosque', 'bar', 'birosca', 'boteco', 'cerveja', 'bebida', 'drink'],
  briefcase:        ['trabalho', 'escritório', 'escritorio', 'material de trabalho', 'uniforme'],
}

export interface ParsedExpense {
  amount: number
  description: string
  category_id: string
  confidence: 'high' | 'low'
}

function normalize(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractAmount(text: string): number | null {
  // Matches patterns like: 50, 50.00, 50,00, R$50, R$ 50, 50 reais
  const match = text.match(/R?\$?\s*(\d{1,6}(?:[.,]\d{1,2})?)/i)
  if (!match) return null
  return parseFloat(match[1].replace(',', '.'))
}

function removeAmount(text: string): string {
  return text
    .replace(/R?\$?\s*\d{1,6}(?:[.,]\d{1,2})?\s*(reais?|conto?s?)?/gi, '')
    .replace(/\b(gastei|paguei|comprei|custou|foi|custa|vale|valeu|num?|no|na|em|de|com|por|pro|pra|uns?|umas?)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function scoreCategory(catId: string, catName: string, words: string[]): number {
  let score = 0
  const normName = normalize(catName)

  for (const word of words) {
    if (word.length < 3) continue
    // Direct name match
    if (normName.includes(word) || word.includes(normName)) score += 10
    // Keyword map match
    const keywords = KEYWORD_MAP[catId] ?? []
    for (const kw of keywords) {
      const normKw = normalize(kw)
      if (normKw === word) { score += 8; break }
      if (normKw.includes(word) || word.includes(normKw)) { score += 4; break }
    }
  }
  return score
}

export function parseExpense(text: string, categories: Category[]): ParsedExpense | null {
  const amount = extractAmount(text)
  if (!amount || amount <= 0) return null

  const cleanText = removeAmount(normalize(text))
  const words = cleanText.split(' ').filter(w => w.length >= 2)
  const description = cleanText.replace(/\s+/g, ' ').trim()

  let bestId = categories[0]?.id ?? ''
  let bestScore = 0

  for (const cat of categories) {
    const s = scoreCategory(cat.id, cat.name, words)
    if (s > bestScore) { bestScore = s; bestId = cat.id }
  }

  return {
    amount,
    description,
    category_id: bestId,
    confidence: bestScore >= 4 ? 'high' : 'low',
  }
}
