// src/Components/Layout.js
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../features/Themeslice';
import { logout } from '../features/Authslice';
import { 
  LayoutDashboard, TrendingUp, TrendingDown, Receipt, FileText, 
  FileBarChart, LogOut, User, Moon, Sun 
} from 'lucide-react';
import './Layout.css'; 

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const darkMode = useSelector(state => state.theme?.darkMode || false);
  const currentUser = useSelector(state => state.auth?.currentUser);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
  document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
}, [darkMode]);

if (!currentUser) {
  return <Navigate to="/login" replace />;
}
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/actifs', label: 'Actifs', icon: TrendingUp },
    { path: '/passifs', label: 'Passifs', icon: TrendingDown },
    { path: '/charges', label: 'Charges', icon: Receipt },
    { path: '/produits', label: 'Produits', icon: FileText },
    { path: '/factures', label: 'Factures', icon: FileBarChart },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter?')) {
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="app-container">
      {/* Mobile menu toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><LayoutDashboard/></div>
            <div className="logo-text">
              <h1>ComptaApp</h1>
              <p>Gestion Comptable Pro</p>
            </div>
          </div>
        </div>

        {/* User info */}
        {currentUser && (
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser.nom}</div>
              <div className="user-role">
                {currentUser.role === 'admin' ? 'Admin' : 'Utilisateur'}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.path)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button 
            className="mode-toggle"
            onClick={() => dispatch(toggleTheme())}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
          </button>

          <button onClick={handleLogout} className="logout-button">
            <LogOut size={20} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
