
// =============================================================================
// UI Text Constants
// =============================================================================
export const UI_TEXTS = {
  // General
  LOADING: "Carregando...",
  NEW_CHAT: "Nova Conversa",
  
  // Actions
  EXPORT: "Exportar",
  SIGN_OUT: "Sair",
  UPGRADE_TO_PRO: "Upgrade para o Pro",
  
  // Modals & Confirmations
  DELETE_CONFIRM_TITLE: "Confirmar Exclusão",
  DELETE_CONFIRM_MESSAGE: "Você tem certeza de que deseja deletar esta conversa? Esta ação não pode ser desfeita.",
  
  // Toasts & Notifications
  SIGN_OUT_SUCCESS: "Você saiu com sucesso!",
  PRO_UPGRADE_SUCCESS: "Obrigado por assinar o Nexus Pro! Bem-vindo(a) à elite. ✨",
  EXPORT_CANCELED: "Exportação cancelada.",
  NOTHING_TO_EXPORT: "Nada para exportar!",
  CONVERSATION_DELETED: "Conversa apagada.",
  ERROR_DELETING_CONVERSATION: "Erro ao apagar a conversa.",
  ERROR_SAVING_CONVERSATION: "Erro ao salvar a conversa.",
  ERROR_LOADING_MESSAGES: "Não foi possível carregar as mensagens.",
  ERROR_FETCHING_HISTORY: "Falha ao buscar o histórico de conversas.",

  // Placeholders & Empty States
  SEARCH_PLACEHOLDER: "Pesquisar... (Ctrl+K)",
  EMPTY_HISTORY: "Comece uma nova conversa para ver seu histórico.",
};

// =============================================================================
// Numerical Constants & Breakpoints
// =============================================================================
export const BREAKPOINTS = {
  MOBILE: 768,
};

// =============================================================================
// Local Storage & Query Params Keys
// =============================================================================
export const STORAGE_KEYS = {
  SIDEBAR_OPEN: 'isSidebarOpen',
};

export const QUERY_PARAMS = {
  PAYMENT_SUCCESS: 'payment_success',
};

// =============================================================================
// API & Model Related Constants
// =============================================================================
export const MODELS = {
  FLASH: 'flash',
  PRO: 'pro',
};
