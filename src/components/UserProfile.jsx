
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import ActivityHistory from './ActivityHistory';
import './UserProfile.css';

export default function UserProfile({ session }) {
  const [profile, setProfile] = useState({ username: '', email: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      if (error) {
        toast.error('Erro ao carregar perfil');
      } else if (data) {
        setProfile({
          username: data.username || '',
          email: data.email || session.user.email,
          avatar_url: data.avatar_url || ''
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [session]);

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
    setLoading(true);
    let avatar_url = profile.avatar_url;
    if (avatarFile) {
      const { data, error } = await supabase.storage.from('avatars').upload(`${session.user.id}/${avatarFile.name}`, avatarFile, { upsert: true });
      if (error) {
        toast.error('Erro ao enviar avatar');
        setLoading(false);
        return;
      }
      avatar_url = data.path;
    }
    const updates = {
      username: profile.username,
      avatar_url,
      updated_at: new Date()
    };
    const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
    if (error) {
      toast.error('Erro ao salvar perfil');
    } else {
      toast.success('Perfil atualizado!');
      setProfile((p) => ({ ...p, avatar_url }));
    }
    setLoading(false);
  };

  return (
    <div className="user-profile user-profile">
      <h2>Meu Perfil</h2>
      <form onSubmit={handleSave}>
        <div className="avatar-section">
          {profile.avatar_url ? (
            <img src={supabase.storage.from('avatars').getPublicUrl(profile.avatar_url).data.publicUrl} alt="Avatar" className="avatar-img" />
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
          <input name="email" value={profile.email} disabled readOnly />
        </label>
        <button type="submit" disabled={loading}>Salvar</button>
      </form>
      <ActivityHistory userId={session.user.id} />
    </div>
  );
}
