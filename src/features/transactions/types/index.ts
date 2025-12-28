export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  description: string
  amount: number
  type: TransactionType
  category: string
  date: string
  created_at: string
}

export interface CreateTransactionDTO {
  description: string
  amount: number
  type: TransactionType
  category: string
  date: string // ISO string YYYY-MM-DD
  user_id?: string
}
