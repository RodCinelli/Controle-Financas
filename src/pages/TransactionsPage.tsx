import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { fetchTransactions } from "@/features/transactions/api"
import { DataTable } from "@/features/transactions/components/data-table"
import { columns } from "@/features/transactions/components/columns"
import { AddTransactionModal } from "@/features/transactions/components/add-transaction-modal"
import { Loader2, Tag } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { ColumnFiltersState } from "@tanstack/react-table"

export function TransactionsPage() {
    const { data: transactions, isLoading, error } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions
    })

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    // Extract unique categories from transactions
    const categories = useMemo(() => {
        if (!transactions) return []
        const uniqueCategories = [...new Set(transactions.map(t => t.category))]
        return uniqueCategories.sort((a, b) => a.localeCompare(b))
    }, [transactions])

    // Get current category filter value
    const currentCategoryFilter = columnFilters.find(f => f.id === 'category')?.value as string | undefined

    // Handle category filter change
    const handleCategoryChange = (value: string) => {
        if (value === 'all') {
            setColumnFilters(filters => filters.filter(f => f.id !== 'category'))
        } else {
            setColumnFilters(filters => {
                const otherFilters = filters.filter(f => f.id !== 'category')
                return [...otherFilters, { id: 'category', value }]
            })
        }
    }

    // Clear category filter
    const clearCategoryFilter = () => {
        setColumnFilters(filters => filters.filter(f => f.id !== 'category'))
    }

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

            {/* Category Filter */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-muted-foreground">Filtrar por categoria:</span>
                </div>
                <div className="flex items-center gap-4">
                    <Select
                        value={currentCategoryFilter || 'all'}
                        onValueChange={handleCategoryChange}
                    >
                        <SelectTrigger className="w-[200px] h-9 bg-white dark:bg-background border-2 focus:ring-emerald-500 focus:border-emerald-500">
                            <SelectValue placeholder="Todas as categorias" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                <span className="flex items-center gap-2">
                                    <span className="text-muted-foreground">Todas as categorias</span>
                                </span>
                            </SelectItem>
                            {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {currentCategoryFilter && (
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                            Mostrando: {currentCategoryFilter}
                        </span>
                    )}

                    {currentCategoryFilter && (
                        <Button
                            size="sm"
                            className="h-9 px-3 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm border-2 border-sky-600"
                            onClick={clearCategoryFilter}
                        >
                            Limpar Filtro
                        </Button>
                    )}
                </div>
            </div>

            <DataTable
                columns={columns}
                data={transactions || []}
                columnFilters={columnFilters}
                onColumnFiltersChange={setColumnFilters}
            />
        </div>
    )
}
