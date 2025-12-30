import { Card, CardContent } from '@/components/ui/card'
import type { Transaction } from '@/features/transactions/types'
import { TrendingUp, TrendingDown, Target, PiggyBank } from 'lucide-react'

interface ChartsSummaryCardsProps {
    transactions: Transaction[]
}

export function ChartsSummaryCards({ transactions }: ChartsSummaryCardsProps) {
    // Calcular métricas usando as transações filtradas
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const netBalance = totalIncome - totalExpense
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0
    const totalCategories = [...new Set(transactions.map(t => t.category))].length

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Lucro Líquido Total */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">Lucro Líquido</p>
                            <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {formatCurrency(netBalance)}
                            </p>
                            <p className="text-xs text-muted-foreground">Total acumulado</p>
                        </div>
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${netBalance >= 0 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800' : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'}`}>
                            {netBalance >= 0 ? (
                                <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                                <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total de Receitas */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">Total Receitas</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(totalIncome)}
                            </p>
                            <p className="text-xs text-muted-foreground">Entradas no período</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900 dark:to-sky-800 flex items-center justify-center">
                            <PiggyBank className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Taxa de Economia */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">Taxa de Economia</p>
                            <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {savingsRate.toFixed(1)}%
                            </p>
                            <p className="text-xs text-muted-foreground">Do total de receitas</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 dark:from-violet-900 dark:to-violet-800 flex items-center justify-center">
                            <Target className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Total de Categorias */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground font-medium">Categorias Ativas</p>
                            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {totalCategories}
                            </p>
                            <p className="text-xs text-muted-foreground">Categorias utilizadas</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center">
                            <div className="grid grid-cols-2 gap-0.5">
                                <div className="w-2 h-2 rounded-sm bg-amber-600 dark:bg-amber-400"></div>
                                <div className="w-2 h-2 rounded-sm bg-amber-400 dark:bg-amber-500"></div>
                                <div className="w-2 h-2 rounded-sm bg-amber-400 dark:bg-amber-500"></div>
                                <div className="w-2 h-2 rounded-sm bg-amber-600 dark:bg-amber-400"></div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
