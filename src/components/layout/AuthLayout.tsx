import { Outlet } from 'react-router-dom'
import { DollarSign, PiggyBank, Wallet } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Branding & Graphics */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-blob animation-delay-4000" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <DollarSign className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Controle Financeiro</h1>
              <p className="text-sm text-emerald-100">Gerencie suas finanças com inteligência</p>
            </div>
          </div>

          {/* Center Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold leading-tight mb-4">
                Transforme sua relação com o dinheiro
              </h2>
              <p className="text-xl text-emerald-50/90">
                Controle total das suas receitas e despesas em um só lugar
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-6">
              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Acompanhamento em Tempo Real</h3>
                  <p className="text-emerald-50/80">Visualize suas transações instantaneamente</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                  <PiggyBank className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Metas Financeiras</h3>
                  <p className="text-emerald-50/80">Defina objetivos e alcance suas metas</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-colors">
                  <Wallet className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Relatórios Detalhados</h3>
                  <p className="text-emerald-50/80">Análises completas para decisões inteligentes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="border-l-4 border-white/30 pl-4">
            <p className="text-lg italic text-emerald-50/90">
              "O controle das suas finanças começa com a visibilidade dos seus gastos"
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                <DollarSign className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold">Controle Financeiro</h1>
            </div>
            <p className="text-sm text-muted-foreground">Gerencie suas finanças com inteligência</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
