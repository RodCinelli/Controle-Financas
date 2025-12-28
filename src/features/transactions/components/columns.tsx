import type { ColumnDef } from "@tanstack/react-table"
import type { Transaction } from "../types"
import { DeleteTransactionButton } from "./delete-transaction-button"

// Fix date parsing to avoid timezone issues
function formatDate(dateStr: string): string {
  try {
    // Parse date string directly without creating Date object to avoid timezone issues
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  } catch {
    return dateStr
  }
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Data",
    cell: ({ row }) => {
      return formatDate(row.getValue("date"))
    }
  },
  {
    accessorKey: "description",
    header: "Descrição",
  },
  {
    accessorKey: "category",
    header: "Categoria",
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            type === 'income' 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {type === 'income' ? 'Receita' : 'Despesa'}
          </span>
        )
    }
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const type = row.original.type
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount)
      return (
        <div className={`font-semibold ${type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
          {type === 'income' ? '+' : '-'} {formatted}
        </div>
      )
    },
  },
  {
      id: "actions",
      header: "",
      cell: ({ row }) => {
          const transaction = row.original
          return <DeleteTransactionButton transaction={transaction} />
      }
  }
]


