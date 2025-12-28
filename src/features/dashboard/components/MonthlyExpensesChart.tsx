import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/features/transactions/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Custom legend component to control order
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
    </div>
)

export function MonthlyExpensesChart({ transactions }: { transactions: Transaction[] }) {
    const dataMap = new Map<string, { name: string, income: number, expense: number, order: number }>()

    transactions.forEach(t => {
        let date: Date
        try {
             const parts = t.date.split('-')
             date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
        } catch {
             date = new Date()
        }
        
        const monthKey = format(date, 'MMM yyyy', { locale: ptBR })

        if (!dataMap.has(monthKey)) {
            const sortTime = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
            dataMap.set(monthKey, { name: monthKey, income: 0, expense: 0, order: sortTime })
        }

        const entry = dataMap.get(monthKey)!
        if (t.type === 'income') entry.income += Number(t.amount)
        else entry.expense += Number(t.amount)
    })

    const data = Array.from(dataMap.values()).sort((a, b) => a.order - b.order)

    return (
        <Card className="w-full border-2 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                    Visão Geral Mensal
                </CardTitle>
                <CardDescription>
                    Comparativo de receitas e despesas por mês
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                        <XAxis
                            dataKey="name"
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="hsl(var(--muted-foreground))"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip 
                            formatter={(value: number | undefined) => {
                                if (value === undefined) return ""
                                return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
                            }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                            }}
                            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.1 }}
                            itemSorter={(item) => item.dataKey === 'income' ? -1 : 1}
                        />
                        <Legend content={<CustomLegend />} />
                        <Bar 
                            dataKey="income" 
                            fill="hsl(142.1 76.2% 36.3%)" 
                            radius={[8, 8, 0, 0]} 
                            name="Receitas"
                            className="drop-shadow-sm"
                        />
                        <Bar 
                            dataKey="expense" 
                            fill="hsl(0 84.2% 60.2%)" 
                            radius={[8, 8, 0, 0]} 
                            name="Despesas"
                            className="drop-shadow-sm"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}

