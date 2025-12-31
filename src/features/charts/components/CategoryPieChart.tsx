import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Transaction } from '@/features/transactions/types'

// Paleta de cores para Receitas (tons frios - verdes e azuis)
const INCOME_COLORS = [
    'hsl(142.1 76.2% 36.3%)',  // Emerald
    'hsl(162.9 93.5% 24.3%)',  // Teal-600
    'hsl(199 89% 48%)',        // Sky Blue
    'hsl(172.7 66% 50.2%)',    // Teal
    'hsl(142.1 70.6% 45.3%)',  // Green
    'hsl(187.7 85.7% 44.1%)',  // Cyan
    'hsl(221.2 83.2% 53.3%)',  // Blue
    'hsl(210 100% 50%)',       // Azure
    'hsl(167.2 76.1% 41.8%)',  // Emerald-500
    'hsl(192.9 82.3% 31.0%)',  // Cyan-700
]

// Paleta de cores para Despesas (tons quentes - vermelhos e laranjas)
const EXPENSE_COLORS = [
    'hsl(0 84.2% 60.2%)',      // Red
    'hsl(24.6 95% 53.1%)',     // Orange
    'hsl(346.8 77.2% 49.8%)',  // Rose
    'hsl(15 100% 60%)',        // Orange-Red
    'hsl(4.9 90.2% 58.4%)',    // Red-500
    'hsl(38.3 92.1% 50.2%)',   // Amber
    'hsl(350.4 89.2% 60.2%)',  // Rose-500
    'hsl(25.3 93.0% 52.5%)',   // Orange-500
    'hsl(0 72.2% 50.6%)',      // Red-600
    'hsl(32.1 94.6% 43.7%)',   // Amber-600
]

// Paleta genérica para "all"
const ALL_COLORS = [
    'hsl(142.1 76.2% 36.3%)',  // Emerald
    'hsl(0 84.2% 60.2%)',      // Red
    'hsl(199 89% 48%)',        // Sky Blue
    'hsl(24.6 95% 53.1%)',     // Orange
    'hsl(262 83% 58%)',        // Violet
    'hsl(346.8 77.2% 49.8%)',  // Rose
    'hsl(172.7 66% 50.2%)',    // Teal
    'hsl(38.3 92.1% 50.2%)',   // Amber
    'hsl(221.2 83.2% 53.3%)',  // Blue
    'hsl(292.2 84.1% 60.6%)',  // Fuchsia
]

interface CategoryData {
    name: string
    value: number
    percentage: number
    [key: string]: string | number
}

interface CategoryPieChartProps {
    transactions: Transaction[]
    type?: 'expense' | 'income' | 'all'
}

export function CategoryPieChart({ transactions, type = 'expense' }: CategoryPieChartProps) {
    // Selecionar paleta de cores baseada no tipo
    const colors = type === 'income' ? INCOME_COLORS : type === 'expense' ? EXPENSE_COLORS : ALL_COLORS

    const data = useMemo(() => {
        // Filtrar transações por tipo
        const filteredTransactions = type === 'all'
            ? transactions
            : transactions.filter(t => t.type === type)

        // Agrupar por categoria
        const categoryMap = new Map<string, number>()
        filteredTransactions.forEach(t => {
            const current = categoryMap.get(t.category) || 0
            categoryMap.set(t.category, current + Number(t.amount))
        })

        // Calcular total
        const total = Array.from(categoryMap.values()).reduce((acc, val) => acc + val, 0)

        // Converter para array e calcular percentuais
        const result: CategoryData[] = Array.from(categoryMap.entries())
            .map(([name, value]) => ({
                name,
                value,
                percentage: total > 0 ? (value / total) * 100 : 0
            }))
            .sort((a, b) => b.value - a.value)

        return result
    }, [transactions, type])

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    const totalValue = data.reduce((acc, item) => acc + item.value, 0)

    const title = type === 'expense'
        ? 'Despesas por Categoria'
        : type === 'income'
            ? 'Receitas por Categoria'
            : 'Transações por Categoria'

    const description = type === 'expense'
        ? 'Distribuição das suas despesas'
        : type === 'income'
            ? 'Distribuição das suas receitas'
            : 'Distribuição de todas as transações'

    if (data.length === 0) {
        return (
            <Card className="border-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                        {title}
                    </CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[350px]">
                    <p className="text-muted-foreground">Nenhuma transação encontrada</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-2 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center gap-4">
                    <ResponsiveContainer width="100%" height={220}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={85}
                                paddingAngle={3}
                                dataKey="value"
                                animationBegin={0}
                                animationDuration={800}
                            >
                                {data.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index % colors.length]}
                                        className="drop-shadow-md hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number | undefined) => value !== undefined ? formatCurrency(value) : ''}
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legenda customizada abaixo do gráfico */}
                <div className="mt-4 pt-4 border-t">
                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                        {data.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-1.5">
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                <span className="text-xs sm:text-sm">
                                    {item.name}
                                    <span className="text-muted-foreground ml-1">({item.percentage.toFixed(1)}%)</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total */}
                <div className="mt-4 pt-4 border-t flex justify-center">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className={`text-xl sm:text-2xl font-bold ${type === 'expense' ? 'text-red-600 dark:text-red-400' : type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-blue-600 dark:text-blue-400'}`}>
                            {formatCurrency(totalValue)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
