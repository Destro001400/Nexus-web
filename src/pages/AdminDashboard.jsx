
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import './AdminDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export default function AdminDashboard({ session }) {
  const [stats, setStats] = useState({ users: 0, conversations: 0, feedbacks: 0 });
  const [loading, setLoading] = useState(true);
  const [conversationsByDay, setConversationsByDay] = useState([]);
  const [feedbackByType, setFeedbackByType] = useState({ like: 0, dislike: 0 });
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    if (!session || !ADMIN_EMAIL || session.user.email !== ADMIN_EMAIL) return;
    setLoading(true);
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('conversations').select('id', { count: 'exact', head: true }),
      supabase.from('feedback').select('id', { count: 'exact', head: true }),
      supabase.rpc('conversations_by_day'),
      supabase.rpc('feedback_by_type'),
      supabase.rpc('top_active_users')
    ]).then(([users, convs, fbs, convsDay, fbType, top]) => {
      setStats({
        users: users.count || 0,
        conversations: convs.count || 0,
        feedbacks: fbs.count || 0
      });
      setConversationsByDay(convsDay.data || []);
      setFeedbackByType(fbType.data || { like: 0, dislike: 0 });
      setTopUsers(top.data || []);
      setLoading(false);
    }).catch(() => {
      toast.error('Erro ao buscar dados do analytics');
      setLoading(false);
    });
  }, [session]);

  if (!session || !ADMIN_EMAIL || session.user.email !== ADMIN_EMAIL) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Acesso restrito.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Dashboard Analytics</h2>
      {loading ? <p>Carregando...</p> : (
        <>
          <div className="stats-row">
            <div className="stat-card">Usuários: <b>{stats.users}</b></div>
            <div className="stat-card">Conversas: <b>{stats.conversations}</b></div>
            <div className="stat-card">Feedbacks: <b>{stats.feedbacks}</b></div>
          </div>
          <div className="charts-row">
            <div className="chart-card">
              <h4>Conversas por dia</h4>
              <Line
                data={{
                  labels: conversationsByDay.map(d => new Date(d.day).toLocaleDateString()),
                  datasets: [
                    {
                      label: 'Conversas',
                      data: conversationsByDay.map(d => d.count),
                      borderColor: 'rgb(75, 192, 192)',
                      tension: 0.1
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' },
                    title: { display: false }
                  }
                }}
              />
            </div>
            <div className="chart-card">
              <h4>Feedbacks</h4>
              <Pie
                data={{
                  labels: ['👍 Positivo', '� Negativo'],
                  datasets: [
                    {
                      data: [feedbackByType.like, feedbackByType.dislike],
                      backgroundColor: ['rgb(75, 192, 192)', 'rgb(255, 99, 132)']
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'top' }
                  }
                }}
              />
            </div>
          </div>
          <div className="chart-card top-users">
            <h4>Usuários mais ativos</h4>
            <Bar
              data={{
                labels: topUsers.map(u => u.email.split('@')[0]),
                datasets: [
                  {
                    label: 'Conversas',
                    data: topUsers.map(u => u.count),
                    backgroundColor: 'rgb(75, 192, 192)'
                  }
                ]
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: { precision: 0 }
                  }
                }
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
