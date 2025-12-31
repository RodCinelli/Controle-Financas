import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "@/features/transactions/api"
import {
    CategoryPieChart,
    BalanceEvolutionChart,
    ChartsSummaryCards,
    DateRangeFilter,
    type DateRange
} from "@/features/charts/components"
import { Loader2 } from "lucide-react"

export function ChartsPage() {
    const { data: transactions, isLoading, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions
    })

    const [dateFilter, setDateFilter] = useState<DateRange>({ from: null, to: null })
    const [filterLabel, setFilterLabel] = useState('Todo o período')

    // Filtrar transações pelo período selecionado
    const filteredTransactions = useMemo(() => {
        const safeTransactions = transactions || []

        if (!dateFilter.from || !dateFilter.to) {
            return safeTransactions
        }

        return safeTransactions.filter(t => {
            const transactionDate = new Date(t.date)
            return transactionDate >= dateFilter.from! && transactionDate <= dateFilter.to!
        })
    }, [transactions, dateFilter])

    const handleFilterChange = (range: DateRange, label: string) => {
        setDateFilter(range)
        setFilterLabel(label)
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center text-destructive">
                Erro ao carregar dados dos gráficos
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                        Gráficos
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Análise detalhada das suas finanças
                        {filterLabel !== 'Todo o período' && (
                            <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-medium">
                                • {filterLabel}
                            </span>
                        )}
                    </p>
                </div>
            </div>

            {/* Filtro de Período */}
            <DateRangeFilter onFilterChange={handleFilterChange} />

            {/* Cards de Resumo */}
            <ChartsSummaryCards transactions={filteredTransactions} />

            {/* Grid de gráficos de pizza */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Gráfico de Pizza - Receitas por Categoria */}
                <CategoryPieChart transactions={filteredTransactions} type="income" />

                {/* Gráfico de Pizza - Despesas por Categoria */}
                <CategoryPieChart transactions={filteredTransactions} type="expense" />
            </div>

            {/* Gráfico de Evolução do Saldo - Full Width */}
            <div className="w-full">
                <BalanceEvolutionChart transactions={filteredTransactions} />
            </div>
        </div>
    )
}
