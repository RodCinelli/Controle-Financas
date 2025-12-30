import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, ArrowRight, UserPlus, KeyRound, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { translateAuthError } from '@/lib/translate-errors'
import { getLastUsedEmail, saveLastUsedEmail } from '@/lib/auth-storage'

const formSchema = z.object({
  email: z.string().trim().email({ message: "Endereço de email inválido" }),
  password: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
})

export function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const { signInWithPassword, loading } = useAuth()
  const navigate = useNavigate()

  // Get last used email from storage
  const lastEmail = getLastUsedEmail()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: lastEmail || "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    const { error } = await signInWithPassword(values.email, values.password)
    if (error) {
      setError(translateAuthError(error.message))
    } else {
      // Save email for future use
      saveLastUsedEmail(values.email)
      navigate('/dashboard')
    }
  }

  const isSubmitting = form.formState.isSubmitting

  return (
    <Card className="w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Bem-vindo de volta
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Entre com suas credenciais para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-emerald-600" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="seu@email.com"
                        className="h-12 pl-4 border-2 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Lock className="h-4 w-4 text-emerald-600" />
                      Senha
                    </FormLabel>
                    <Link
                      to="/auth/forgot-password"
                      className="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                      Esqueceu sua senha?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha"
                        className="h-12 pl-4 pr-12 border-2 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-800">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold shadow-lg shadow-emerald-500/25 transition-all duration-200 gap-2"
              disabled={isSubmitting || loading}
            >
              {(isSubmitting || loading) ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {/* Forgot Password Link for Mobile */}
            <div className="flex justify-center sm:hidden">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors flex items-center gap-1"
              >
                <KeyRound className="h-3 w-3" />
                Recuperar acesso
              </Link>
            </div>

            {/* Divider Section - mais espaçamento */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">
                  Ainda não tem conta?
                </span>
              </div>
            </div>

            <Link to="/auth/register" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 font-semibold border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 gap-2 text-emerald-700 dark:text-emerald-400"
              >
                <UserPlus className="h-4 w-4" />
                Criar uma conta gratuita
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
