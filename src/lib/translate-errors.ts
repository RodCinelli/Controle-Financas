/**
 * Traduz mensagens de erro do Supabase Auth para português brasileiro
 * @param errorMessage - Mensagem de erro original em inglês
 * @returns Mensagem traduzida em português
 */
export function translateAuthError(errorMessage: string): string {
  const translations: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email ainda não foi confirmado',
    'Invalid email or password': 'Email ou senha inválidos',
    'User not found': 'Usuário não encontrado',
    'Email already registered': 'Este email já está cadastrado',
    'Password should be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres',
    'Rate limit exceeded': 'Muitas tentativas. Aguarde um momento e tente novamente',
    'Network error': 'Erro de conexão. Verifique sua internet',
    'User already registered': 'Usuário já cadastrado',
    'Signup requires a valid password': 'Cadastro requer uma senha válida',
    'Unable to validate email address: invalid format': 'Formato de email inválido',
    'Email rate limit exceeded': 'Limite de envio de emails excedido. Tente novamente mais tarde',
    'New password should be different from the old password': 'A nova senha deve ser diferente da senha atual',
    'Password is too weak': 'A senha é muito fraca. Use uma combinação de letras, números e símbolos',
    'Token has expired or is invalid': 'Sessão expirada. Por favor, faça login novamente',
    'Invalid token': 'Token inválido. Por favor, faça login novamente',
    'User not allowed': 'Usuário não autorizado',
    'Signups not allowed for this instance': 'Cadastros desabilitados no momento',
  }

  // Verifica se há tradução disponível
  for (const [englishError, portugueseError] of Object.entries(translations)) {
    if (errorMessage.toLowerCase().includes(englishError.toLowerCase())) {
      return portugueseError
    }
  }

  // Se não houver tradução, retorna mensagem genérica
  return 'Ocorreu um erro. Por favor, tente novamente.'
}
