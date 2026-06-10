export interface Category {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  bg: string
  is_default: boolean
  display_order: number
}

export interface Expense {
  id: number
  user_id: string
  category_id: string
  amount: number
  description: string | null
  date: string
  pay_method: 'credit' | 'pix'
  created_at: string
}

export interface Settings {
  user_id: string
  monthly_limit: number
  cycle_mode: 'standard' | 'invoice'
  invoice_day: number
  sheets_url: string | null
}

export interface CategoryLimit {
  user_id: string
  category_id: string
  limit_amount: number
}
