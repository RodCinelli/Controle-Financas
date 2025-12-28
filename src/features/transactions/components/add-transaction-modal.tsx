import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from "date-fns"
import { CalendarIcon, Loader2, Plus, FileText, Tag, DollarSign, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { NumericFormat } from 'react-number-format'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
// import { useAuth } from "@/features/auth/hooks/use-auth" // Not needed unless we pass user_id manually, but RLS handles it?
// Usually insert needs user_id if RLS policies check it, but better: backend triggers or explicit user_id.
// My SQL said: "user_id uuid references auth.users(id) ... not null".
// And policy: "with check (auth.uid() = user_id)"
// So I MUST send the user_id.

import { useAuth } from "@/features/auth/hooks/use-auth"
import { addTransaction } from "@/features/transactions/api"
import { useQueryClient, useMutation } from '@tanstack/react-query'

const formSchema = z.object({
  description: z.string().min(2, "A descrição deve ter pelo menos 2 caracteres"),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "O valor deve ser positivo",
  }),
  type: z.enum(["income", "expense"]),
  category: z.string().min(2, "A categoria é obrigatória"),
  date: z.date(),
})

export function AddTransactionModal() {
    const [open, setOpen] = useState(false)
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            amount: "",
            type: "income",
            category: "",
            date: new Date(),
        },
    })

    const mutation = useMutation({
        mutationFn: async (values: z.infer<typeof formSchema>) => {
            if (!user) throw new Error("Usuário não autenticado")
            
            return await addTransaction({
                description: values.description,
                amount: Number(values.amount),
                type: values.type,
                category: values.category,
                date: format(values.date, 'yyyy-MM-dd'),
                user_id: user.id // Needs to be added to CreateTransactionDTO? 
                // Wait, addTransaction in API took CreateTransactionDTO which I defined WITHOUT user_id in types/index.ts
                // I need to update API/Type or handle it.
                // If I send it to supabase allow insert, I need to include user_id in the payload.
            })
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ['transactions'] })
             setOpen(false)
             form.reset()
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        mutation.mutate(values)
    }

    const isSubmitting = form.formState.isSubmitting || mutation.isPending

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-lg shadow-emerald-500/25 gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar Transação
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-6 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                                <Plus className="h-5 w-5" />
                            </div>
                            Nova Transação
                        </DialogTitle>
                        <DialogDescription className="text-emerald-100">
                            Adicione uma nova receita ou despesa ao seu controle.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
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
                         <div className="grid grid-cols-2 gap-4">
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
                                    <FormLabel>Data</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full pl-3 text-left font-normal",
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
                            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 shadow-md">
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Transação
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
