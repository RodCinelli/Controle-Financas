import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "@/features/transactions/api"
import { SummaryCards } from "@/features/dashboard/components/SummaryCards"
import { MonthlyExpensesChart } from "@/features/dashboard/components/MonthlyExpensesChart"
import { Loader2 } from "lucide-react"

export function DashboardPage() {
    const { data: transactions, isLoading, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions
    })

    if (isLoading) return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
    if (error) return <div className="text-center text-destructive">Erro ao carregar dados do dashboard</div>

    const safeTransactions = transactions || []

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">Dashboard</h2>
                <p className="text-muted-foreground mt-1">Visão geral das suas finanças</p>
            </div>
            <SummaryCards transactions={safeTransactions} />
            <div className="w-full">
                <MonthlyExpensesChart transactions={safeTransactions} />
            </div>
        </div>
    )
}
