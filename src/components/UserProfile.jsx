
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth'; // Import useAuth
import { toast } from 'react-hot-toast';
import ActivityHistory from './ActivityHistory';
import './UserProfile.css';

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth(); // Usar o usuário do contexto
  const [profile, setProfile] = useState({ username: '', avatar_url: '' });
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (user) {
      setProfile({
        username: user.username || '',
        avatar_url: user.avatar_url || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    let avatar_url = profile.avatar_url;

    if (avatarFile) {
      const filePath = `${user.id}/${Date.now()}_${avatarFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        toast.error('Erro ao enviar avatar.');
        setLoading(false);
        return;
      }
      
      // Obter a URL pública após o upload
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      avatar_url = publicUrlData.publicUrl;
    }

    const updates = {
      id: user.id,
      username: profile.username,
      avatar_url,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates);

    if (error) {
      toast.error('Erro ao salvar perfil.');
    } else {
      toast.success('Perfil atualizado com sucesso!');
      // Opcional: forçar a atualização do contexto se necessário
    }
    setLoading(false);
  };

  if (authLoading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <div>Usuário não encontrado.</div>;
  }

  return (
    <div className="user-profile">
      <h2>Meu Perfil</h2>
      <form onSubmit={handleSave}>
        <div className="avatar-section">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">?</div>
          )}
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
        <label>
          Nome de usuário:
          <input name="username" value={profile.username} onChange={handleChange} disabled={loading} />
        </label>
        <label>
          Email:
          <input name="email" value={user.email} disabled readOnly />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
      </form>
      <ActivityHistory userId={user.id} />
    </div>
  );
}
