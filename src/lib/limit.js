import { supabase } from './supabaseClient';

const DAILY_MESSAGE_LIMIT = 20;

export const checkMessageLimit = async (session, isProUser) => {
  // 1. Se o usuário é Pro, libera na hora e não faz mais nada.
  if (isProUser) {
    return true;
  }

  // 2. Se não for Pro, continua a verificação.
  const userId = session.user.id;
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('message_count, last_message_date')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Erro ao buscar perfil para checar limite:", error);
    alert("Não foi possível verificar seu limite de mensagens.");
    return false; // Bloqueia por segurança
  }

  const today = new Date().toISOString().split('T')[0];

  // Se não tem perfil ou é um novo dia, permite o envio. A função RPC vai criar/resetar o perfil.
  if (!profile || profile.last_message_date !== today) {
    return true;
  }

  // Se o limite foi atingido, bloqueia.
  if (profile.message_count >= DAILY_MESSAGE_LIMIT) {
    alert(`Você atingiu o seu limite de ${DAILY_MESSAGE_LIMIT} mensagens por dia. Assine o Pro para uso ilimitado!`);
    return false;
  }

  // Se passou por tudo, libera.
  return true;
};