import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../features/Authslice';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    dispatch(login({
      username: formData.username,
      password: formData.password
    }));

    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem('comptaApp_currentUser') || 'null');
      setLoading(false);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Identifiant ou mot de passe incorrect');
      }
    }, 500);
  };

  return (
    <div className="auth-page">
      <div className="auth-split-container">
        {/* Left - Branding */}
        <div className="auth-brand-side">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-circle">💼</div>
              <h1>ComptaApp</h1>
            </div>
            
            <div className="brand-headline">
              <h2>Gérez votre comptabilité en toute simplicité</h2>
              <p>Solution professionnelle complète pour la gestion financière de votre entreprise</p>
            </div>

            <div className="brand-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Entreprises</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99.9%</div>
                <div className="stat-label">Fiabilité</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support</div>
              </div>
            </div>

            <div className="brand-features">
              <div className="feature">
                <span className="feature-check">✓</span>
                <span>Tableau de bord en temps réel</span>
              </div>
              <div className="feature">
                <span className="feature-check">✓</span>
                <span>Gestion complète des finances</span>
              </div>
              <div className="feature">
                <span className="feature-check">✓</span>
                <span>Facturation automatisée</span>
              </div>
              <div className="feature">
                <span className="feature-check">✓</span>
                <span>Rapports détaillés</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Login Form */}
        <div className="auth-form-side">
          <div className="form-container">
            <div className="form-header">
              <h2>Connexion</h2>
              <p>Accédez à votre espace de gestion</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Entrez votre nom d'utilisateur"
                  autoComplete="username"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Mot de passe</label>
                <div className="input-with-icon">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Entrez votre mot de passe"
                    autoComplete="current-password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Connexion...</span>
                  </>
                ) : (
                  <>
                    <span>Se connecter</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="form-divider">
              <span>Compte de démonstration</span>
            </div>

            <div className="demo-box">
              <div className="demo-header">
                <span className="demo-badge">🎯 Essai gratuit</span>
              </div>
              <div className="demo-creds">
                <div className="demo-row">
                  <span className="demo-label">Identifiant :</span>
                  <code className="demo-value">admin</code>
                </div>
                <div className="demo-row">
                  <span className="demo-label">Mot de passe :</span>
                  <code className="demo-value">admin123</code>
                </div>
              </div>
            </div>

            <div className="form-footer">
              <p>Vous n'avez pas de compte ?</p>
              <Link to="/register" className="link-primary">
                Créer un compte gratuitement
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;