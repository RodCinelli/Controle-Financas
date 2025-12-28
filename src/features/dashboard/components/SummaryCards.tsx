import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/features/transactions/types"
import { TrendingDown, TrendingUp, Wallet } from "lucide-react"

export function SummaryCards({ transactions }: { transactions: Transaction[] }) {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)
    
    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)
    
    const balance = income - expense

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value)
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Saldo Total */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Total</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(balance)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {balance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
                    </p>
                </CardContent>
            </Card>

            {/* Receitas */}
            <Card className="border-2 border-emerald-100 dark:border-emerald-900 hover:shadow-lg hover:shadow-emerald-500/10 transition-shadow bg-gradient-to-br from-emerald-50/50 to-white dark:from-emerald-950/20 dark:to-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Receitas</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(income)}
                    </div>
                    <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                        Total de entradas
                    </p>
                </CardContent>
            </Card>

            {/* Despesas */}
            <Card className="border-2 border-red-100 dark:border-red-900 hover:shadow-lg hover:shadow-red-500/10 transition-shadow bg-gradient-to-br from-red-50/50 to-white dark:from-red-950/20 dark:to-background">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Despesas</CardTitle>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                        {formatCurrency(expense)}
                    </div>
                    <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                        Total de saídas
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
