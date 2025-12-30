"use client"

import { useState } from "react"
import type { Transaction } from "../types"
import { Trash2, AlertTriangle, X } from "lucide-react"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTransaction } from "../api"
import { queryClient } from "@/lib/react-query"

export function DeleteTransactionButton({ transaction }: { transaction: Transaction }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteTransaction(transaction.id)
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setOpen(false)
      toast.success('Transação excluída!', {
        description: `"${transaction.description}" foi removida com sucesso.`,
        style: {
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          border: 'none',
          color: 'white',
        },
      })
    } catch (error) {
      console.error("Falha ao excluir", error)
      toast.error('Erro ao excluir transação', {
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        style: {
          background: 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)',
          border: 'none',
          color: 'white',
        },
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-red-600 dark:hover:bg-red-600 transition-all"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[440px] p-0 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white relative">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 h-8 w-8 rounded-full flex items-center justify-center bg-white/20 hover:bg-white/30 text-white transition-all"
          >
            <X className="h-4 w-4" />
          </button>
          <AlertDialogHeader>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <AlertTriangle className="h-7 w-7" />
              </div>
              <div>
                <AlertDialogTitle className="text-2xl font-bold text-white">
                  Excluir Transação
                </AlertDialogTitle>
                <AlertDialogDescription className="text-red-100 mt-1">
                  Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="p-4 rounded-xl bg-muted/50 border-2 border-dashed">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
              Transação a ser excluída
            </p>
            <p className="font-semibold text-lg">{transaction.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                {transaction.type === 'income' ? 'Receita' : 'Despesa'}
              </span>
              <span className={`font-bold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                {transaction.type === 'income' ? '+' : '-'} {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(transaction.amount))}
              </span>
            </div>
          </div>

          <AlertDialogFooter className="mt-6 gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 h-11">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 h-11 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25"
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Excluindo...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Sim, excluir
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

