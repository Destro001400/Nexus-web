import React from 'react';
import { Menu, Download, LogOut } from 'lucide-react';
import logo from '../assets/logo.png';
import './Header.css';

const Header = ({ 
  isSidebarOpen,
  setSidebarOpen,
  activeConversation,
  exportConversation,
  handleSignOut
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <Menu size={24} />
        </button>
        <div className="logo-container">
          <img src={logo} alt="Nexus Logo" className="logo" />
          <h1 className="app-title">Nexus</h1>
        </div>
      </div>
      <div className="header-right">
        {activeConversation && (
          <button onClick={exportConversation} className="button-base button-secondary">
            <Download size={16} />
            Exportar
          </button>
        )}
        <button onClick={handleSignOut} className="button-base button-secondary">
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
