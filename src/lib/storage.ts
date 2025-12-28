import { supabase } from './supabase'

const AVATARS_BUCKET = 'avatars'

export interface UploadAvatarResult {
  url: string | null
  error: Error | null
}

export interface DeleteAvatarResult {
  error: Error | null
}

/**
 * Uploads a user avatar to Supabase Storage
 * @param userId - The user's ID
 * @param file - The image file to upload
 * @returns The public URL of the uploaded avatar
 */
export async function uploadAvatar(userId: string, file: File): Promise<UploadAvatarResult> {
  try {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return {
        url: null,
        error: new Error('Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.')
      }
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      return {
        url: null,
        error: new Error('Arquivo muito grande. O tamanho máximo é 2MB.')
      }
    }

    // Generate unique filename with user ID
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`

    // Delete existing avatar if any
    await supabase.storage.from(AVATARS_BUCKET).remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.gif`, `${userId}/avatar.webp`])

    // Upload new avatar
    const { error: uploadError } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (uploadError) {
      return { url: null, error: uploadError }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(AVATARS_BUCKET)
      .getPublicUrl(fileName)

    return { url: urlData.publicUrl, error: null }
  } catch (error) {
    return { url: null, error: error as Error }
  }
}

/**
 * Deletes a user's avatar from Supabase Storage
 * @param userId - The user's ID
 */
export async function deleteAvatar(userId: string): Promise<DeleteAvatarResult> {
  try {
    const { error } = await supabase.storage
      .from(AVATARS_BUCKET)
      .remove([
        `${userId}/avatar.jpg`,
        `${userId}/avatar.png`,
        `${userId}/avatar.gif`,
        `${userId}/avatar.webp`
      ])

    return { error }
  } catch (error) {
    return { error: error as Error }
  }
}

/**
 * Gets the avatar URL for a user
 * @param userId - The user's ID
 * @returns The public URL of the avatar or null if not found
 */
export async function getAvatarUrl(userId: string): Promise<string | null> {
  try {
    const { data } = await supabase.storage
      .from(AVATARS_BUCKET)
      .list(userId)
    
    if (data && data.length > 0) {
      const avatarFile = data.find(file => file.name.startsWith('avatar.'))
      if (avatarFile) {
        const { data: urlData } = supabase.storage
          .from(AVATARS_BUCKET)
          .getPublicUrl(`${userId}/${avatarFile.name}`)
        return urlData.publicUrl
      }
    }
    
    return null
  } catch {
    return null
  }
}
