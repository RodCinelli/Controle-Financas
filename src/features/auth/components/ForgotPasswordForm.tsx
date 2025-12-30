import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff } from 'lucide-react'

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
import { supabase } from '@/lib/supabase'
import { translateAuthError } from '@/lib/translate-errors'
import { getLastUsedEmail, saveLastUsedEmail } from '@/lib/auth-storage'

const formSchema = z.object({
  email: z.string().trim().email({ message: "Endereço de email inválido" }),
  newPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  confirmPassword: z.string().min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const lastEmail = getLastUsedEmail()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: lastEmail || "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  // Update form when lastEmail changes
  useEffect(() => {
    if (lastEmail) {
      form.setValue('email', lastEmail)
    }
  }, [lastEmail, form])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null)
    setLoading(true)

    try {
      // Update password directly using Supabase admin functionality
      // Note: This is a simplified version without email verification
      const { error: updateError } = await supabase.auth.updateUser({
        password: values.newPassword
      })

      if (updateError) {
        // If user is not logged in, we need to use a different approach
        // For now, show a message that they need to be logged in or use password reset flow
        if (updateError.message.includes('not logged in') || updateError.message.includes('session')) {
          setError('Para redefinir sua senha sem verificação por email, você precisa estar logado. Use a opção padrão de recuperação.')
        } else {
          setError(translateAuthError(updateError.message))
        }
        setLoading(false)
        return
      }

      // Save email for future use
      saveLastUsedEmail(values.email)

      setSuccess(true)
      setTimeout(() => {
        navigate('/auth/login')
      }, 2000)
    } catch {
      setError('Ocorreu um erro ao redefinir a senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const isSubmitting = form.formState.isSubmitting

  if (success) {
    return (
      <Card className="w-full border-0 shadow-2xl">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">Senha redefinida com sucesso!</h3>
              <p className="text-muted-foreground">
                Você será redirecionado para a tela de login em instantes...
              </p>
            </div>
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600 mt-2" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border-0 shadow-2xl">
      <CardHeader className="space-y-2 pb-8">
        <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Recuperar acesso
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Redefina sua senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Last used email info */}
        {lastEmail && (
          <div className="mb-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400">
              <Mail className="h-4 w-4" />
              <span>Último email utilizado:</span>
              <span className="font-semibold">{lastEmail}</span>
            </div>
          </div>
        )}

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
                    <Input
                      placeholder="seu@email.com"
                      className="h-12 pl-4 border-2 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Nova senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-emerald-600" />
                    Confirmar nova senha
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Digite a senha novamente"
                        className="h-12 pl-4 pr-12 border-2 focus:border-emerald-500 focus:ring-emerald-500/20 transition-all"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
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

            <p className="text-xs text-muted-foreground">
              A senha deve ter no mínimo 8 caracteres
            </p>

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
                  <KeyRound className="h-4 w-4" />
                  Redefinir senha
                </>
              )}
            </Button>

            {/* Divider Section */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-4 text-sm text-muted-foreground">
                  Lembrou sua senha?
                </span>
              </div>
            </div>

            <Link to="/auth/login" className="block">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 font-semibold border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 gap-2 text-emerald-700 dark:text-emerald-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o login
              </Button>
            </Link>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
