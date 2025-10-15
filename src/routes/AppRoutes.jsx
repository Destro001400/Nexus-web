
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ConversationProvider } from '../lib/ConversationContext';

// Page and Layout Imports
import LandingPage from '../pages/LandingPage';
import DocumentationPage from '../pages/DocumentationPage';
import Auth from '../components/Auth';
import UserProfile from '../components/UserProfile';
import MainAppLayout from '../layouts/MainAppLayout';

// Lazy-loaded components

// ProtectedRoute component remains here as it's specific to routing logic
const ProtectedRoute = () => {
  const { session, loading } = useAuth();

  if (loading) {
    // Você pode mostrar um spinner de carregamento aqui se preferir
    return null;
  }

  return session ? <Outlet /> : <Navigate to="/login" replace />;
};

const AppRoutes = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!session ? <LandingPage /> : <Navigate to="/chat" />} />
      <Route path="/login" element={!session ? <Auth /> : <Navigate to="/chat" />} />
      <Route path="/docs" element={<DocumentationPage />} />
      <Route element={<ProtectedRoute />}>
        <Route 
          path="/chat"
          element={<ConversationProvider><MainAppLayout /></ConversationProvider>}
        />
        <Route 
          path="/chat/:id"
          element={<ConversationProvider><MainAppLayout /></ConversationProvider>}
        />
        <Route path="/profile" element={<UserProfile />} />

      </Route>
    </Routes>
  );
};

export default AppRoutes;
