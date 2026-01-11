import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../features/Themeslice';
import { logout } from '../features/Authslice';
import { LogOut, User } from 'lucide-react';

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

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', emoji: '📊' },
    { path: '/actifs', label: 'Actifs', emoji: '💰' },
    { path: '/passifs', label: 'Passifs', emoji: '💳' },
    { path: '/charges', label: 'Charges', emoji: '💸' },
    { path: '/produits', label: 'Produits', emoji: '💵' },
    { path: '/factures', label: 'Factures', emoji: '📄' },
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
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? '✕' : '☰'}
      </button>

      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <h1>💼 ComptaApp</h1>
          <p>Gestion Comptable Pro</p>
        </div>

        {currentUser && (
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} color="white" />
            </div>
            <div className="user-details">
              <div className="user-name">{currentUser.nom}</div>
              <div className="user-role">
                {currentUser.role === 'admin' ? '👑 Admin' : '👤 Utilisateur'}
              </div>
            </div>
          </div>
        )}

        <nav>
          <ul className="sidebar-menu">
            {menuItems.map(item => (
              <li key={item.path}>
                <button
                  className={location.pathname === item.path ? 'active' : ''}
                  onClick={() => handleMenuClick(item.path)}
                >
                  <span className="menu-item-content">
                    <span role="img" aria-label={item.label}>{item.emoji}</span>
                    <span>{item.label}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="theme-toggle">
          <button onClick={() => dispatch(toggleTheme())}>
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Mode Clair' : 'Mode Sombre'}</span>
          </button>
        </div>

        <div className="logout-container">
          <button onClick={handleLogout} className="logout-button">
            <LogOut size={18} />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>

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