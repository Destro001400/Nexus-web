import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './ActivityHistory.css';

export default function ActivityHistory({ userId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (!error) setActivities(data || []);
      setLoading(false);
    };
    fetchActivities();
  }, [userId]);

  return (
    <div className="activity-history">
      <h3>Histórico de Atividades</h3>
      {loading ? <p>Carregando...</p> : (
        <ul>
          {activities.length === 0 ? (
            <li>Nenhuma atividade recente.</li>
          ) : (
            activities.map((act, i) => (
              <li key={i}>
                <span className="activity-type">{act.type}</span> —
                <span className="activity-desc"> {act.description}</span>
                <span className="activity-date"> {new Date(act.created_at).toLocaleString()}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
