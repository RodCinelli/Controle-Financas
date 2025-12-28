import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "@/features/transactions/api"
import { DataTable } from "@/features/transactions/components/data-table"
import { columns } from "@/features/transactions/components/columns"
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal"
import { Loader2 } from "lucide-react"

export function TransactionsPage() {
    const { data: transactions, isLoading, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions
    })

    if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
    if (error) return <div className="text-center text-destructive">Erro ao carregar transações</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                     <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">Transações</h2>
                     <p className="text-muted-foreground mt-1">Gerencie suas receitas e despesas</p>
                </div>
                <AddTransactionModal />
            </div>
            <DataTable columns={columns} data={transactions || []} />
        </div>
    )
}
