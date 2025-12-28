import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  DollarSign,
  Home,
  Receipt,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/common/mode-toggle";
import { useAuth } from "@/features/auth/hooks/use-auth";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAvatarUrl } from "@/lib/storage";

export function DashboardLayout() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Load user avatar
  useEffect(() => {
    async function loadAvatar() {
      if (user?.id) {
        const url = await getAvatarUrl(user.id);
        setAvatarUrl(url);
      }
    }
    loadAvatar();
  }, [user?.id]);

  // Listen for avatar updates from profile page
  useEffect(() => {
    const handleAvatarUpdate = (event: CustomEvent<{ url: string | null }>) => {
      setAvatarUrl(event.detail.url);
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate as EventListener);
    };
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth/login");
  };

  const navItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/transactions", icon: Receipt, label: "Transações" },
  ];

  return (
    <TooltipProvider delayDuration={isTransitioning ? 1000 : 0}>
      <div className="flex min-h-screen w-full flex-col">
        {/* Sidebar - Desktop */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950 dark:to-background sm:flex transition-all duration-500 ease-in-out",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
          onTransitionEnd={() => setIsTransitioning(false)}
        >
          {/* Toggle Button */}
          <div
            className={cn(
              "flex h-16 items-center border-b bg-white/50 dark:bg-background/50 backdrop-blur-sm",
              sidebarCollapsed ? "justify-center px-2" : "justify-between px-4"
            )}
          >
            {!sidebarCollapsed && (
              <span className="text-sm font-medium text-muted-foreground">
                Menu
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsTransitioning(true);
                setSidebarCollapsed(!sidebarCollapsed);
              }}
              className="h-8 w-8 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-transform duration-300 hover:scale-105"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4 text-emerald-600" />
              ) : (
                <ChevronLeft className="h-4 w-4 text-emerald-600" />
              )}
            </Button>
          </div>
          <nav
            className={cn(
              "flex-1 space-y-2 py-4",
              sidebarCollapsed ? "px-2" : "px-3"
            )}
          >
            {navItems.map((item) => (
              <Tooltip key={item.href} open={sidebarCollapsed && !isTransitioning ? undefined : false}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center rounded-lg font-medium transition-all",
                      sidebarCollapsed
                        ? "justify-center h-10 w-full"
                        : "gap-3 px-3 py-2.5 text-sm",
                      location.pathname === item.href
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-500/20"
                        : "text-muted-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-700 dark:hover:text-emerald-300"
                    )}
                  >
                    <item.icon
                      className={cn("h-4 w-4", sidebarCollapsed && "h-5 w-5")}
                    />
                    {!sidebarCollapsed && item.label}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-emerald-700 text-white border-emerald-600"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </nav>

          {/* Logo at the bottom of sidebar */}
          <div
            className={cn(
              "border-t bg-white/50 dark:bg-background/50 backdrop-blur-sm",
              sidebarCollapsed ? "p-2" : "p-4"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/dashboard"
                  className={cn(
                    "flex items-center font-bold transition-all",
                    sidebarCollapsed ? "justify-center" : "gap-2"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-md",
                      sidebarCollapsed ? "h-10 w-10" : "h-9 w-9"
                    )}
                  >
                    <DollarSign
                      className={cn(sidebarCollapsed ? "h-5 w-5" : "h-5 w-5")}
                    />
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-lg bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                      Controle Financeiro
                    </span>
                  )}
                </Link>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent
                  side="right"
                  className="bg-emerald-700 text-white border-emerald-600"
                >
                  Controle Financeiro
                </TooltipContent>
              )}
            </Tooltip>
          </div>
        </aside>

        <div
          className={cn(
            "flex flex-col min-h-screen transition-all duration-300",
            sidebarCollapsed ? "sm:pl-16" : "sm:pl-64"
          )}
        >
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
                <SheetDescription className="sr-only">
                  Menu principal do aplicativo
                </SheetDescription>
                <nav className="grid gap-4 py-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 font-bold mb-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <span className="text-lg bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
                      Controle Financeiro
                    </span>
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
            <div className="flex-1" /> {/* Spacer */}
            <div className="flex items-center gap-2">
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-9 w-9 border-2 border-emerald-200 dark:border-emerald-800">
                      <AvatarImage src={avatarUrl || ''} />
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
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Meu Perfil
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
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

          {/* Footer */}
          <footer className="border-t bg-white/50 dark:bg-background/50 backdrop-blur-sm p-4 min-h-[69px] flex items-center justify-center">
            <span className="text-sm text-muted-foreground">
              Desenvolvido por{" "}
              <span className="font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-400 dark:to-emerald-300 bg-clip-text text-transparent">
                Rodrigo Cinelli
              </span>
            </span>
          </footer>
        </div>
      </div>
    </TooltipProvider>
  );
}
