import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, Mail, Lock, ShieldCheck, LogIn, Sparkles, Eye, EyeOff } from 'lucide-react'

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

const formSchema = z.object({
  email: z.string().trim().email({ message: "Endereço de email inválido" }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

export function RegisterForm() {
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { signUp, loading } = useAuth()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
        confirmPassword: "",
      },
    })
  
    async function onSubmit(values: z.infer<typeof formSchema>) {
      setError(null)
      const { error } = await signUp(values.email, values.password)
      if (error) {
        setError(translateAuthError(error.message))
      } else {
        navigate('/dashboard')
      }
    }

    const isSubmitting = form.formState.isSubmitting
  
    return (
      <Card className="w-full border-0 shadow-2xl">
          <CardHeader className="space-y-2 pb-8">
              <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-800 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                Crie sua conta
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Comece a controlar suas finanças agora mesmo
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
                      <FormLabel className="text-sm font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        Senha
                      </FormLabel>
                      <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Mínimo 6 caracteres" 
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
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        Confirmar Senha
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
                        <Sparkles className="h-4 w-4" />
                        Criar minha conta
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
                        Já possui uma conta?
                      </span>
                    </div>
                  </div>

                  <Link to="/auth/login" className="block">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-12 font-semibold border-2 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 gap-2 text-emerald-700 dark:text-emerald-400"
                    >
                      <LogIn className="h-4 w-4" />
                      Fazer login
                    </Button>
                  </Link>
              </form>
              </Form>
          </CardContent>
      </Card>
    )
}

