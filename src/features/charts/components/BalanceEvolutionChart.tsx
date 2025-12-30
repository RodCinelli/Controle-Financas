import { useMemo, useState } from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Transaction } from '@/features/transactions/types'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface BalanceEvolutionChartProps {
    transactions: Transaction[]
}

type ViewMode = 'daily' | 'monthly'

interface DailyDataPoint {
    name: string
    fullDate: string
    income: number
    expense: number
    balance: number
    order: number
    incomeTransactions: Array<{ description: string; amount: number }>
    expenseTransactions: Array<{ description: string; amount: number }>
    [key: string]: string | number | Array<{ description: string; amount: number }>
}

interface CustomTooltipProps {
    active?: boolean
    payload?: Array<{ payload: DailyDataPoint }>
    label?: string
}

// Custom legend
const CustomLegend = () => (
    <div className="flex justify-center gap-6 pt-5">
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(142.1 76.2% 36.3%)' }} />
            <span className="text-sm text-emerald-600 font-medium">Receitas</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(0 84.2% 60.2%)' }} />
            <span className="text-sm text-red-500 font-medium">Despesas</span>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(199 89% 48%)' }} />
            <span className="text-sm text-sky-500 font-medium">Saldo</span>
        </div>
    </div>
)

// Custom tooltip com detalhes das transações
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0]?.payload as DailyDataPoint
    if (!data) return null

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value)
    }

    return (
        <div className="bg-background border-2 rounded-xl p-4 shadow-xl min-w-[280px] max-w-[350px]">
            {/* Cabeçalho com data */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b">
                <span className="text-lg">📅</span>
                <span className="font-bold text-sm text-foreground">
                    {data.fullDate || label}
                </span>
            </div>

            {/* Receitas */}
            {data.income > 0 && (
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                            ↗ Receitas
                        </span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                            {formatCurrency(data.income)}
                        </span>
                    </div>
                    <div className="space-y-1.5 pl-3 border-l-2 border-emerald-200 dark:border-emerald-800">
                        {data.incomeTransactions?.slice(0, 3).map((t, i) => (
                            <div key={i} className="flex items-start justify-between gap-3">
                                <span className="text-xs text-muted-foreground flex-1 break-words">
                                    {t.description}
                                </span>
                                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                                    {formatCurrency(t.amount)}
                                </span>
                            </div>
                        ))}
                        {data.incomeTransactions && data.incomeTransactions.length > 3 && (
                            <p className="text-xs text-muted-foreground italic">
                                + {data.incomeTransactions.length - 3} transação(ões)
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Despesas */}
            {data.expense > 0 && (
                <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-red-500 dark:text-red-400 font-semibold text-sm">
                            ↙ Despesas
                        </span>
                        <span className="text-red-500 dark:text-red-400 font-bold text-sm">
                            {formatCurrency(data.expense)}
                        </span>
                    </div>
                    <div className="space-y-1.5 pl-3 border-l-2 border-red-200 dark:border-red-800">
                        {data.expenseTransactions?.slice(0, 3).map((t, i) => (
                            <div key={i} className="flex items-start justify-between gap-3">
                                <span className="text-xs text-muted-foreground flex-1 break-words">
                                    {t.description}
                                </span>
                                <span className="text-xs font-medium text-red-500 dark:text-red-400 whitespace-nowrap">
                                    {formatCurrency(t.amount)}
                                </span>
                            </div>
                        ))}
                        {data.expenseTransactions && data.expenseTransactions.length > 3 && (
                            <p className="text-xs text-muted-foreground italic">
                                + {data.expenseTransactions.length - 3} transação(ões)
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Saldo */}
            <div className="pt-3 border-t-2">
                <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm text-muted-foreground">
                        💰 Saldo Acumulado
                    </span>
                    <span className={`font-bold text-base ${data.balance >= 0 ? 'text-sky-500' : 'text-red-500'}`}>
                        {formatCurrency(data.balance)}
                    </span>
                </div>
            </div>
        </div>
    )
}

export function BalanceEvolutionChart({ transactions }: BalanceEvolutionChartProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('daily')

    const data = useMemo(() => {
        // Ordenar transações por data
        const sortedTransactions = [...transactions].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )

        if (viewMode === 'daily') {
            // Agrupar por dia
            const dailyData = new Map<string, DailyDataPoint>()

            let cumulativeBalance = 0

            sortedTransactions.forEach(t => {
                let date: Date
                try {
                    const parts = t.date.split('-')
                    date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                } catch {
                    date = new Date()
                }

                const dayKey = format(date, 'yyyy-MM-dd')
                const dayLabel = format(date, 'dd/MM', { locale: ptBR })
                const fullDateLabel = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                const sortTime = date.getTime()

                if (!dailyData.has(dayKey)) {
                    dailyData.set(dayKey, {
                        name: dayLabel,
                        fullDate: fullDateLabel,
                        income: 0,
                        expense: 0,
                        balance: 0,
                        order: sortTime,
                        incomeTransactions: [],
                        expenseTransactions: []
                    })
                }

                const entry = dailyData.get(dayKey)!
                const amount = Number(t.amount)

                if (t.type === 'income') {
                    entry.income += amount
                    entry.incomeTransactions.push({ description: t.description, amount })
                    cumulativeBalance += amount
                } else {
                    entry.expense += amount
                    entry.expenseTransactions.push({ description: t.description, amount })
                    cumulativeBalance -= amount
                }
                entry.balance = cumulativeBalance
            })

            // Recalcular saldo acumulado corretamente
            let runningBalance = 0
            return Array.from(dailyData.values())
                .sort((a, b) => a.order - b.order)
                .map(item => {
                    runningBalance += item.income - item.expense
                    return {
                        ...item,
                        balance: runningBalance
                    }
                })
        } else {
            // Agrupar por mês (comportamento original)
            const monthlyData = new Map<string, DailyDataPoint>()

            sortedTransactions.forEach(t => {
                let date: Date
                try {
                    const parts = t.date.split('-')
                    date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
                } catch {
                    date = new Date()
                }

                const monthKey = format(date, 'MM/yyyy')
                const monthLabel = format(date, 'MMM yyyy', { locale: ptBR })
                const sortTime = new Date(date.getFullYear(), date.getMonth(), 1).getTime()

                if (!monthlyData.has(monthKey)) {
                    monthlyData.set(monthKey, {
                        name: monthLabel,
                        fullDate: monthLabel,
                        income: 0,
                        expense: 0,
                        balance: 0,
                        order: sortTime,
                        incomeTransactions: [],
                        expenseTransactions: []
                    })
                }

                const entry = monthlyData.get(monthKey)!
                const amount = Number(t.amount)

                if (t.type === 'income') {
                    entry.income += amount
                    entry.incomeTransactions.push({ description: t.description, amount })
                } else {
                    entry.expense += amount
                    entry.expenseTransactions.push({ description: t.description, amount })
                }
            })

            // Recalcular saldo acumulado
            let runningBalance = 0
            return Array.from(monthlyData.values())
                .sort((a, b) => a.order - b.order)
                .map(item => {
                    runningBalance += item.income - item.expense
                    return {
                        ...item,
                        balance: runningBalance
                    }
                })
        }
    }, [transactions, viewMode])

    if (data.length === 0) {
        return (
            <Card className="border-2 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                        Evolução do Saldo
                    </CardTitle>
                    <CardDescription>Acompanhe a evolução do seu saldo ao longo do tempo</CardDescription>
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                            Evolução do Saldo
                        </CardTitle>
                        <CardDescription>
                            Acompanhe a evolução do seu saldo ao longo do tempo
                            <span className="ml-2 text-emerald-600 font-medium">
                                • Passe o mouse para ver detalhes
                            </span>
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={viewMode === 'daily' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('daily')}
                            className={viewMode === 'daily' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                        >
                            Por Dia
                        </Button>
                        <Button
                            variant={viewMode === 'monthly' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setViewMode('monthly')}
                            className={viewMode === 'monthly' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
                        >
                            Por Mês
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(142.1 76.2% 36.3%)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(0 84.2% 60.2%)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(199 89% 48%)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="hsl(199 89% 48%)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            interval={viewMode === 'daily' && data.length > 15 ? Math.floor(data.length / 10) : 0}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="hsl(142.1 76.2% 36.3%)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            name="income"
                            dot={viewMode === 'daily' && data.length <= 31}
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="hsl(0 84.2% 60.2%)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                            name="expense"
                            dot={viewMode === 'daily' && data.length <= 31}
                        />
                        <Area
                            type="monotone"
                            dataKey="balance"
                            stroke="hsl(199 89% 48%)"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorBalance)"
                            name="balance"
                            dot={viewMode === 'daily' && data.length <= 31}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
