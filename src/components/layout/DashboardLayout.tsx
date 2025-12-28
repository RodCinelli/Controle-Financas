import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, DollarSign, Home, Receipt, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/common/mode-toggle"
import { useAuth } from "@/features/auth/hooks/use-auth"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function DashboardLayout() {
  const location = useLocation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/login')
  }

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/transactions", icon: Receipt, label: "Transações" },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex min-h-screen w-full flex-col">
        {/* Sidebar - Desktop */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-background sm:flex transition-all duration-300",
          sidebarCollapsed ? "w-16" : "w-64"
        )}>
          {/* Toggle Button */}
          <div className={cn(
            "flex h-16 items-center border-b bg-white/50 dark:bg-background/50 backdrop-blur-sm",
            sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
          )}>
            {!sidebarCollapsed && (
              <span className="text-sm font-medium text-muted-foreground">Menu</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="h-8 w-8 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-emerald-600" />
              )}
            </Button>
          </div>
          <nav className={cn(
            "flex-1 space-y-2 py-4",
            sidebarCollapsed ? "px-2" : "px-3"
          )}>
             {navItems.map((item) => (
               <Tooltip key={item.href}>
                 <TooltipTrigger asChild>
                   <Link
                     to={item.href}
                     className={cn(
                       "flex items-center rounded-lg font-medium transition-all",
                       sidebarCollapsed ? "justify-center h-10 w-full" : "gap-3 px-3 py-2.5 text-sm",
                       location.pathname === item.href 
                         ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-500/20" 
                         : "text-muted-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300"
                     )}
                   >
                     <item.icon className={cn("h-4 w-4", sidebarCollapsed && "h-5 w-5")} />
                     {!sidebarCollapsed && item.label}
                   </Link>
                 </TooltipTrigger>
                 {sidebarCollapsed && (
                   <TooltipContent side="right" className="bg-emerald-700 text-white border-emerald-600">
                     {item.label}
                   </TooltipContent>
                 )}
               </Tooltip>
             ))}
          </nav>
        </aside>

        <div className={cn(
          "flex flex-col transition-all duration-300",
          sidebarCollapsed ? "sm:pl-16" : "sm:pl-64"
        )}>
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white/80 dark:bg-background/80 backdrop-blur-sm px-4 sm:px-6">
              {/* Mobile Menu */}
              <Sheet>
                  <SheetTrigger asChild>
                      <Button size="icon" variant="outline" className="sm:hidden">
                          <Menu className="h-5 w-5" />
                          <span className="sr-only">Abrir Menu</span>
                      </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-72">
                      <SheetTitle>Menu de Navegação</SheetTitle>
                      <SheetDescription className="sr-only">Menu principal do aplicativo</SheetDescription>
                       <nav className="grid gap-4 py-6">
                           <Link to="/" className="flex items-center gap-2 font-bold mb-4">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                                <DollarSign className="h-5 w-5" />
                              </div>
                              <span className="text-lg bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">Controle Financeiro</span>
                           </Link>
                           {navItems.map((item) => (
                              <Link
                                  key={item.href}
                                  to={item.href}
                                  className={cn(
                                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                      location.pathname === item.href 
                                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white" 
                                        : "text-muted-foreground hover:text-foreground"
                                  )}
                              >
                                  <item.icon className="h-5 w-5" />
                                  {item.label}
                              </Link>
                           ))}
                       </nav>
                  </SheetContent>
              </Sheet>

              {/* Centered Logo - True center using absolute positioning */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold">
                   <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md">
                     <DollarSign className="h-5 w-5" />
                   </div>
                   <span className="text-lg bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent hidden sm:inline">
                     Controle Financeiro
                   </span>
                </Link>
              </div>

              <div className="flex-1" /> {/* Spacer */}

              <div className="flex items-center gap-2">
                  <ModeToggle />
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                             <Avatar className="h-9 w-9 border-2 border-emerald-200 dark:border-emerald-800">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                                  {user?.email?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                             </Avatar>
                             <span className="sr-only">Menu do usuário</span>
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium">Minha Conta</p>
                              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                  </DropdownMenu>
              </div>
          </header>
          
          <main className="flex-1 p-4 sm:p-6 md:p-8">
              <Outlet />
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}

