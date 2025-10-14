import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { toast } from 'react-hot-toast';
import './AdminDashboard.css';

// Seção de Gerenciamento de Usuários
const UserManagementSection = ({ session }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_all_users');
    if (error) {
      toast.error("Falha ao buscar usuários.");
      console.error(error);
    } else {
      setUsers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (rpcName, params, successMsg) => {
    const { error } = await supabase.rpc(rpcName, params);
    if (error) {
      toast.error(`Falha ao executar a ação.`);
      console.error(`Error on ${rpcName}:`, error);
    } else {
      toast.success(successMsg);
      fetchUsers();
    }
  };

  const handleRoleChange = (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    handleAction(
      'update_user_role',
      { user_id_target: user.id, new_role: newRole },
      'Cargo do usuário alterado com sucesso.'
    );
  };

  const togglePro = (user) => {
    handleAction(
      'toggle_pro_status',
      { user_id_target: user.id },
      `Status Pro do usuário ${user.is_pro ? 'desativado' : 'ativado'}.`
    );
  };

  const toggleActive = (user) => {
    handleAction(
      'toggle_user_active_status',
      { user_id_target: user.id },
      `Conta do usuário ${user.is_active ? 'bloqueada' : 'desbloqueada'}.`
    );
  };

  if (loading) return <p>Carregando usuários...</p>;

  return (
    <div className="management-section">
      <h2>Gerenciamento de Usuários</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Cargo</th>
            <th>Pro</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.username || '-'}</td>
              <td>{user.role}</td>
              <td>{user.is_pro ? 'Sim' : 'Não'}</td>
              <td>{user.is_active ? 'Ativa' : 'Bloqueada'}</td>
              <td className="actions-cell">
                {user.id !== session.user.id && (
                  <button onClick={() => handleRoleChange(user)}>
                    {user.role === 'admin' ? 'Rebaixar' : 'Promover'}
                  </button>
                )}
                <button onClick={() => togglePro(user)}>
                  {user.is_pro ? 'Desativar Pro' : 'Ativar Pro'}
                </button>
                {user.id !== session.user.id && (
                  <button onClick={() => toggleActive(user)} className={user.is_active ? 'danger' : ''}>
                    {user.is_active ? 'Bloquear' : 'Desbloquear'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Seção de Atividade Recente
const RecentActivitySection = () => {
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentConversations = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_recent_conversations');
      if (error) {
        toast.error("Falha ao buscar conversas recentes.");
        console.error(error);
      } else {
        setRecentConversations(data);
      }
      setLoading(false);
    };
    fetchRecentConversations();
  }, []);

  if (loading) return <p>Carregando atividade recente...</p>;

  return (
    <div className="management-section">
      <h2>Visão Geral da Atividade</h2>
      <h4>Conversas Mais Recentes</h4>
      <table className="users-table">
        <thead>
          <tr>
            <th>Email do Usuário</th>
            <th>Título da Conversa</th>
            <th>Última Atualização</th>
          </tr>
        </thead>
        <tbody>
          {recentConversations.map(convo => (
            <tr key={convo.id}>
              <td>{convo.user_email}</td>
              <td>{convo.title}</td>
              <td>{new Date(convo.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


// Componente principal do painel
export default function AdminDashboard() {
  const { session } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    setLoading(true);
    supabase.from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          toast.error('Erro ao buscar perfil do usuário.');
          console.error(error);
        } else if (data) {
          setProfile(data);
        }
      }).finally(() => {
        setLoading(false);
      });
  }, [session]);

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Verificando permissões...</div>;
  }

  if (profile?.role !== 'admin') {
    return <div style={{ padding: 40, textAlign: 'center' }}>Acesso Negado. Você não tem permissão para ver esta página.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Sala de Controle</h1>
      <p>Bem-vindo à Sala de Controle. Gerencie usuários e visualize a atividade da plataforma.</p>
      
      <UserManagementSection session={session} />
      <hr />
      <RecentActivitySection />

    </div>
  );
}