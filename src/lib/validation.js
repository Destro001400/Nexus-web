// Validação de dados antes de enviar para o Supabase
export const validateConversationData = (data) => {
  const errors = {};

  if (!data.title || data.title.trim().length < 1) {
    errors.title = 'O título é obrigatório';
  }

  if (!data.category || data.category.trim().length < 1) {
    errors.category = 'A categoria é obrigatória';
  }

  if (!data.model || data.model.trim().length < 1) {
    errors.model = 'O modelo é obrigatório';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Validação de dados do usuário
export const validateUserData = (data) => {
  const errors = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Email inválido';
  }

  if (!data.password || data.password.length < 8) {
    errors.password = 'A senha deve ter pelo menos 8 caracteres';
  }

  if (data.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(data.password)) {
    errors.password = 'A senha deve conter letras maiúsculas, minúsculas e números';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitização de dados
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove tags HTML simples
    .slice(0, 1000); // Limita o tamanho do input
};

// Função de higienização para objetos
export const sanitizeData = (data) => {
  if (typeof data !== 'object') return data;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    sanitized[key] = sanitizeInput(value);
  }
  
  return sanitized;
};