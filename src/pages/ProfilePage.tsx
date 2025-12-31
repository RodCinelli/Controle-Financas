import { useState, useRef } from 'react'
import {
  User,
  Lock,
  Camera,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Mail,
  Calendar,
  Shield,
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useProfile } from '@/features/profile/hooks/use-profile'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { cn } from '@/lib/utils'

type FeedbackType = 'success' | 'error' | null

interface Feedback {
  type: FeedbackType
  message: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const {
    profile,
    loading,
    avatarLoading,
    updatePassword,
    uploadUserAvatar,
    removeAvatar
  } = useProfile()

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback | null>(null)

  // Avatar state
  const [avatarFeedback, setAvatarFeedback] = useState<Feedback | null>(null)
  const [deleteAvatarDialogOpen, setDeleteAvatarDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordFeedback(null)

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'Preencha todos os campos' })
      return
    }

    if (newPassword.length < 8) {
      setPasswordFeedback({ type: 'error', message: 'A nova senha deve ter pelo menos 8 caracteres' })
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: 'error', message: 'As senhas não coincidem' })
      return
    }

    setPasswordLoading(true)
    const { error } = await updatePassword(currentPassword, newPassword)
    setPasswordLoading(false)

    if (error) {
      setPasswordFeedback({ type: 'error', message: error.message })
    } else {
      setPasswordFeedback({ type: 'success', message: 'Senha alterada com sucesso!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarFeedback(null)
    const { error } = await uploadUserAvatar(file)

    if (error) {
      setAvatarFeedback({ type: 'error', message: error.message })
    } else {
      setAvatarFeedback({ type: 'success', message: 'Foto atualizada com sucesso!' })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle avatar delete
  const handleAvatarDelete = async () => {
    setAvatarFeedback(null)
    const { error } = await removeAvatar()
    setDeleteAvatarDialogOpen(false)

    if (error) {
      setAvatarFeedback({ type: 'error', message: error.message })
    } else {
      setAvatarFeedback({ type: 'success', message: 'Foto removida com sucesso!' })
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-700 to-emerald-900 dark:from-emerald-400 dark:to-emerald-200 bg-clip-text text-transparent">
            Meu Perfil
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas informações pessoais e segurança
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-2xl mx-auto">
        {/* Profile Info Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-emerald-600" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Seus dados de perfil e foto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <Avatar className="h-28 w-28 border-4 border-emerald-200 dark:border-emerald-800 shadow-xl">
                  <AvatarImage
                    src={profile?.avatarUrl || ''}
                    alt="Avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white text-3xl font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                    avatarLoading && "opacity-100"
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {avatarLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="h-8 w-8 text-white" />
                  )}
                </div>
              </div>

              {/* Avatar Actions */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarLoading}
                  className="gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Enviar Foto
                </Button>
                {profile?.avatarUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteAvatarDialogOpen(true)}
                    disabled={avatarLoading}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remover
                  </Button>
                )}
              </div>

              {/* Avatar Feedback */}
              {avatarFeedback && (
                <div
                  className={cn(
                    "flex items-center gap-2 text-sm px-3 py-2 rounded-lg",
                    avatarFeedback.type === 'success'
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  )}
                >
                  {avatarFeedback.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {avatarFeedback.message}
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                JPG, PNG, GIF ou WebP. Máximo 2MB.
              </p>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t">
              <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-muted/50 text-center">
                <Mail className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-sm truncate max-w-[150px]" title={profile?.email}>{profile?.email}</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 p-3 rounded-lg bg-muted/50 text-center">
                <Calendar className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Membro desde</p>
                  <p className="font-medium text-sm">
                    {profile?.createdAt ? formatDate(profile.createdAt) : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-emerald-600" />
              Segurança
            </CardTitle>
            <CardDescription>
              Altere sua senha de acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <Label htmlFor="currentPassword" className="flex items-center gap-2 text-sm">
                  <Lock className="h-4 w-4 text-emerald-600" />
                  Senha Atual
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Digite sua senha atual"
                    className="pr-10 h-9"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* New Password and Confirm in Grid */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="newPassword" className="flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Nova Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className="pr-10 h-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm">
                    <Lock className="h-4 w-4 text-emerald-600" />
                    Confirmar
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="pr-10 h-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                A senha deve ter no mínimo 8 caracteres
              </p>

              {/* Feedback and Button Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                {/* Feedback */}
                {passwordFeedback && (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm px-3 py-2 rounded-lg flex-1",
                      passwordFeedback.type === 'success'
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {passwordFeedback.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0" />
                    )}
                    {passwordFeedback.message}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={cn(
                    "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg shadow-emerald-500/25 w-full sm:w-auto",
                    !passwordFeedback && "sm:ml-auto"
                  )}
                  disabled={passwordLoading}
                >
                  {passwordLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Atualizando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Alterar Senha
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Delete Avatar Confirmation Dialog */}
      <Dialog open={deleteAvatarDialogOpen} onOpenChange={setDeleteAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Remover Foto
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover sua foto de perfil? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteAvatarDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleAvatarDelete}
              disabled={avatarLoading}
            >
              {avatarLoading ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
