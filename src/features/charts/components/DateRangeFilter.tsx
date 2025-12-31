import { useState, useMemo } from 'react'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

export type DateFilterType = 'all' | 'month' | 'custom'

export interface DateRange {
    from: Date | null
    to: Date | null
}

interface DateRangeFilterProps {
    onFilterChange: (range: DateRange, label: string) => void
}

export function DateRangeFilter({ onFilterChange }: DateRangeFilterProps) {
    const [filterType, setFilterType] = useState<DateFilterType>('all')
    const [selectedMonth, setSelectedMonth] = useState(new Date())

    // Gerar lista de meses (últimos 12 meses)
    const monthOptions = useMemo(() => {
        const months = []
        for (let i = 0; i < 12; i++) {
            const date = subMonths(new Date(), i)
            months.push({
                value: format(date, 'yyyy-MM'),
                label: format(date, 'MMMM yyyy', { locale: ptBR }),
                date: date
            })
        }
        return months
    }, [])

    const handleFilterTypeChange = (type: string) => {
        const newType = type as DateFilterType
        setFilterType(newType)

        if (newType === 'all') {
            onFilterChange({ from: null, to: null }, 'Todo o período')
        } else if (newType === 'month') {
            const start = startOfMonth(selectedMonth)
            const end = endOfMonth(selectedMonth)
            const label = format(selectedMonth, 'MMMM yyyy', { locale: ptBR })
            onFilterChange({ from: start, to: end }, label)
        }
    }

    const handleMonthChange = (monthValue: string) => {
        const monthOption = monthOptions.find(m => m.value === monthValue)
        if (monthOption) {
            setSelectedMonth(monthOption.date)
            const start = startOfMonth(monthOption.date)
            const end = endOfMonth(monthOption.date)
            onFilterChange({ from: start, to: end }, monthOption.label)
        }
    }

    const navigateMonth = (direction: 'prev' | 'next') => {
        const newMonth = direction === 'prev'
            ? subMonths(selectedMonth, 1)
            : subMonths(selectedMonth, -1)

        setSelectedMonth(newMonth)

        if (filterType === 'month') {
            const start = startOfMonth(newMonth)
            const end = endOfMonth(newMonth)
            const label = format(newMonth, 'MMMM yyyy', { locale: ptBR })
            onFilterChange({ from: start, to: end }, label)
        }
    }

    const handleClear = () => {
        setFilterType('all')
        setSelectedMonth(new Date())
        onFilterChange({ from: null, to: null }, 'Todo o período')
    }

    const isFiltered = filterType !== 'all'

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Ícone e Label */}
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-medium text-muted-foreground">
                    Filtrar por período:
                </span>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {/* Seletor de Tipo de Filtro */}
                <Select value={filterType} onValueChange={handleFilterTypeChange}>
                    <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm bg-white dark:bg-background border-2 focus:ring-emerald-500 focus:border-emerald-500">
                        <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            <span className="text-muted-foreground">Todo o período</span>
                        </SelectItem>
                        <SelectItem value="month">Por mês</SelectItem>
                    </SelectContent>
                </Select>

                {/* Seletor de Mês (aparece quando filterType === 'month') */}
                {filterType === 'month' && (
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => navigateMonth('prev')}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <Select
                            value={format(selectedMonth, 'yyyy-MM')}
                            onValueChange={handleMonthChange}
                        >
                            <SelectTrigger className="w-full sm:w-[200px] h-9 text-sm bg-white dark:bg-background border-2 focus:ring-emerald-500 focus:border-emerald-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((month) => (
                                    <SelectItem key={month.value} value={month.value}>
                                        <span className="capitalize">{month.label}</span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={() => navigateMonth('next')}
                            disabled={format(selectedMonth, 'yyyy-MM') === format(new Date(), 'yyyy-MM')}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Botão Limpar Filtro */}
                {isFiltered && (
                    <Button
                        size="sm"
                        className="h-9 px-3 bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm border-2 border-sky-600"
                        onClick={handleClear}
                    >
                        Limpar Filtro
                    </Button>
                )}
            </div>
        </div>
    )
}
