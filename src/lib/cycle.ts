export type CycleMode = 'standard' | 'invoice'

export interface Cycle {
  startStr: string
  endStr: string
  label: string
  shortLabel: string
  rangeStr: string
  badge: string
  daysLeft: number
  isCurrent: boolean
}

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function daysUntil(endDate: Date): number {
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diff = Math.round((end.getTime() - today.getTime()) / 86400000)
  return Math.max(0, diff)
}

function standardCycle(offset: number): Cycle {
  const now = new Date()
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const start = new Date(d.getFullYear(), d.getMonth(), 1)
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return {
    startStr: toStr(start),
    endStr: toStr(end),
    label: MONTHS_PT[start.getMonth()] + ' ' + start.getFullYear(),
    shortLabel: MONTHS_SHORT[start.getMonth()] + ' ' + start.getFullYear(),
    rangeStr: `1/${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()}/${MONTHS_SHORT[end.getMonth()]}`,
    badge: 'Mês corrido',
    daysLeft: offset === 0 ? daysUntil(end) : 0,
    isCurrent: offset === 0,
  }
}

function invoiceCycle(invoiceDay: number, offset: number): Cycle {
  const day = Math.max(1, Math.min(28, invoiceDay || 1))
  const now = new Date()
  const today = now.getDate()

  let baseYear = now.getFullYear()
  let baseMonth = now.getMonth()
  if (today < day) {
    baseMonth -= 1
    if (baseMonth < 0) { baseMonth = 11; baseYear -= 1 }
  }

  let startMonth = baseMonth + offset
  let startYear = baseYear
  while (startMonth < 0) { startMonth += 12; startYear -= 1 }
  while (startMonth > 11) { startMonth -= 12; startYear += 1 }

  const cycleStart = new Date(startYear, startMonth, day)
  const realEnd = day === 1
    ? new Date(startYear, startMonth + 1, 0)
    : new Date(startYear, startMonth + 1, day - 1)

  const fmtD = (d: Date) => `${String(d.getDate()).padStart(2,'0')}/${MONTHS_SHORT[d.getMonth()]}`

  return {
    startStr: toStr(cycleStart),
    endStr: toStr(realEnd),
    label: `${fmtD(cycleStart)} a ${fmtD(realEnd)}`,
    shortLabel: `${fmtD(cycleStart)}–${fmtD(realEnd)}`,
    rangeStr: `${fmtD(cycleStart)} – ${fmtD(realEnd)} de ${realEnd.getFullYear()}`,
    badge: 'Fatura',
    daysLeft: offset === 0 ? daysUntil(realEnd) : 0,
    isCurrent: offset === 0,
  }
}

export function getCycle(mode: CycleMode, invoiceDay: number, offset = 0): Cycle {
  if (mode === 'invoice') return invoiceCycle(invoiceDay, offset)
  return standardCycle(offset)
}

export function pcolorHero(pct: number): string {
  if (pct >= 100) return '#FCA5A5'
  if (pct >= 90)  return '#FDB88A'
  if (pct >= 70)  return '#FDE68A'
  return '#D4A373'
}

export function pcolor(pct: number): string {
  if (pct >= 100) return '#B91C1C'
  if (pct >= 90)  return '#B04A10'
  if (pct >= 70)  return '#B07D10'
  return '#0F3D3E'
}

export function pcls(pct: number): string {
  if (pct >= 100) return 'over'
  if (pct >= 90)  return 'danger'
  if (pct >= 70)  return 'warn'
  return 'safe'
}

export function brl(n: number): string {
  return 'R$ ' + n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function todayStr(): string {
  const d = new Date()
  return toStr(d)
}

export function prettyDate(s: string): string {
  const today = todayStr()
  if (s === today) return 'Hoje'
  const yd = new Date()
  yd.setDate(yd.getDate() - 1)
  if (s === toStr(yd)) return 'Ontem'
  const [y, m, day] = s.split('-')
  return `${day}/${m}/${y}`
}
