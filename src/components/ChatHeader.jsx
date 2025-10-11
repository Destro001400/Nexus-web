import React from 'react';
import { Menu, Sparkles, LogOut, Download } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './ChatHeader.css';

const ChatHeader = ({ session, onToggleSidebar, onExport }) => {
  return (
    <header className="header chat-header">
      <div className="header-content">
        <button className="menu-button" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <div className="logo-section">
          <Sparkles className="logo-icon" />
          <h1 className="logo-text">Nexus</h1>
        </div>
        <div className="user-section">
          <button className="export-button" onClick={onExport} title="Exportar conversa">
            <Download size={18} /> Exportar
          </button>

          <button className="logout-button" onClick={() => supabase.auth.signOut()}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
