import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { uploadAvatar, deleteAvatar, getAvatarUrl } from '@/lib/storage'
import { useAuth } from '@/features/auth/hooks/use-auth'

export interface UserProfile {
  id: string
  email: string
  avatarUrl: string | null
  displayName: string | null
  createdAt: string
}

export interface UpdatePasswordResult {
  error: Error | null
}

export interface UpdateProfileResult {
  error: Error | null
}

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [avatarLoading, setAvatarLoading] = useState(false)

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      // Get avatar URL
      const avatarUrl = await getAvatarUrl(user.id)

      setProfile({
        id: user.id,
        email: user.email || '',
        avatarUrl,
        displayName: user.user_metadata?.display_name || null,
        createdAt: user.created_at
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Update password
  const updatePassword = async (currentPassword: string, newPassword: string): Promise<UpdatePasswordResult> => {
    try {
      // First, verify current password by re-authenticating
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword
      })

      if (signInError) {
        return { error: new Error('Senha atual incorreta') }
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return { error }
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  // Upload avatar
  const uploadUserAvatar = async (file: File): Promise<UpdateProfileResult> => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') }
    }

    setAvatarLoading(true)
    try {
      const { url, error } = await uploadAvatar(user.id, file)

      if (error) {
        return { error }
      }

      // Update profile with new avatar URL
      setProfile(prev => prev ? { ...prev, avatarUrl: url } : null)

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { url } }))

      return { error: null }
    } finally {
      setAvatarLoading(false)
    }
  }

  // Delete avatar
  const removeAvatar = async (): Promise<UpdateProfileResult> => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') }
    }

    setAvatarLoading(true)
    try {
      const { error } = await deleteAvatar(user.id)

      if (error) {
        return { error }
      }

      // Update profile to remove avatar URL
      setProfile(prev => prev ? { ...prev, avatarUrl: null } : null)

      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('avatar-updated', { detail: { url: null } }))

      return { error: null }
    } finally {
      setAvatarLoading(false)
    }
  }

  // Update display name
  const updateDisplayName = async (displayName: string): Promise<UpdateProfileResult> => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      })

      if (error) {
        return { error }
      }

      setProfile(prev => prev ? { ...prev, displayName } : null)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return {
    profile,
    loading,
    avatarLoading,
    updatePassword,
    uploadUserAvatar,
    removeAvatar,
    updateDisplayName,
    refreshProfile: loadProfile
  }
}
