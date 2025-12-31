"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from "date-fns"
import { CalendarIcon, Loader2, Pencil, FileText, Tag, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { NumericFormat } from 'react-number-format'
import { toast } from 'sonner'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import type { Transaction } from "../types"
import { supabase } from "@/lib/supabase"
import { useQueryClient } from '@tanstack/react-query'

const formSchema = z.object({
    description: z.string().min(2, "A descrição deve ter pelo menos 2 caracteres"),
    amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "O valor deve ser positivo",
    }),
    type: z.enum(["income", "expense"]),
    category: z.string().min(2, "A categoria é obrigatória"),
    date: z.date(),
})

interface EditTransactionModalProps {
    transaction: Transaction
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditTransactionModal({ transaction, open, onOpenChange }: EditTransactionModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const queryClient = useQueryClient()

    // Parse date from string
    const parseDate = (dateStr: string): Date => {
        const [year, month, day] = dateStr.split('-').map(Number)
        return new Date(year, month - 1, day)
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: transaction.description,
            amount: String(transaction.amount),
            type: transaction.type,
            category: transaction.category,
            date: parseDate(transaction.date),
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        try {
            const { error } = await supabase
                .from('transactions')
                .update({
                    description: values.description,
                    amount: Number(values.amount),
                    type: values.type,
                    category: values.category,
                    date: format(values.date, 'yyyy-MM-dd'),
                })
                .eq('id', transaction.id)

            if (error) throw error

            queryClient.invalidateQueries({ queryKey: ['transactions'] })
            onOpenChange(false)
            toast.success('Transação atualizada!', {
                description: 'As alterações foram salvas com sucesso.',
                style: {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                    border: 'none',
                    color: 'white',
                },
            })
        } catch (error) {
            console.error("Erro ao atualizar transação", error)
            toast.error('Erro ao atualizar transação', {
                description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
                style: {
                    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    border: 'none',
                    color: 'white',
                },
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[520px] max-h-[90vh] overflow-y-auto p-0">
                <div className={`p-6 text-white ${transaction.type === 'income'
                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600'
                    }`}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Pencil className="h-5 w-5" />
                            </div>
                            Editar Transação
                        </DialogTitle>
                        <DialogDescription className={transaction.type === 'income' ? 'text-emerald-100' : 'text-red-100'}>
                            Atualize os dados da sua {transaction.type === 'income' ? 'receita' : 'despesa'}.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-4 sm:p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            Descrição
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Compras no mercado, Salário mensal..." className="h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                                Valor
                                            </FormLabel>
                                            <FormControl>
                                                <NumericFormat
                                                    customInput={Input}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    prefix="R$ "
                                                    placeholder="R$ 0,00"
                                                    className="h-11"
                                                    onValueChange={(values) => {
                                                        field.onChange(values.value)
                                                    }}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                                {field.value === 'income' ? (
                                                    <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                                                ) : (
                                                    <ArrowDownCircle className="h-4 w-4 text-red-500" />
                                                )}
                                                Tipo
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="h-11">
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="income">
                                                        <span className="flex items-center gap-2">
                                                            <ArrowUpCircle className="h-4 w-4 text-emerald-600" />
                                                            Receita
                                                        </span>
                                                    </SelectItem>
                                                    <SelectItem value="expense">
                                                        <span className="flex items-center gap-2">
                                                            <ArrowDownCircle className="h-4 w-4 text-red-500" />
                                                            Despesa
                                                        </span>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            Categoria
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: Alimentação, Transporte, Lazer..." className="h-11" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            Data
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full h-11 pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "dd/MM/yyyy")
                                                        ) : (
                                                            <span>Selecione uma data</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="pt-4 border-t">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`${transaction.type === 'income'
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                                        } shadow-md`}
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Salvar Alterações
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
