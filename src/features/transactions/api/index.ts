import { supabase } from '@/lib/supabase'
import type { Transaction, CreateTransactionDTO } from '../types'

export async function fetchTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as Transaction[]
}

export async function addTransaction(transaction: CreateTransactionDTO) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data as Transaction
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(error.message)
  }
}
