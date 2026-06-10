'use client'

import { CATEGORY_ICONS } from '@/lib/categoryIcons'

interface Props {
  emoji: string   // pode ser emoji "🛒" ou id de ícone SVG "groceries"
  color?: string  // cor para ícones SVG
  size?: number
}

export default function CategoryIcon({ emoji, color = '#ffffff', size = 22 }: Props) {
  const svgIcon = CATEGORY_ICONS.find(i => i.id === emoji)
  if (svgIcon) {
    return (
      <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size }}>
        {svgIcon.svg(color)}
      </span>
    )
  }
  return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>{emoji}</span>
}
