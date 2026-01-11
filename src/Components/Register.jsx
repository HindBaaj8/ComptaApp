import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register, login } from '../features/Authslice';
import { Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!formData.nom || !formData.email || !formData.username || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Adresse email invalide');
      setLoading(false);
      return;
    }

    // Validation password
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    // Vérifier si username existe
    const users = JSON.parse(localStorage.getItem('comptaApp_users') || '[]');
    if (users.find(u => u.username === formData.username)) {
      setError('Ce nom d\'utilisateur existe déjà');
      setLoading(false);
      return;
    }

    // Vérifier si email existe
    if (users.find(u => u.email === formData.email)) {
      setError('Cet email est déjà utilisé');
      setLoading(false);
      return;
    }

    // S'inscrire
    dispatch(register(formData));
    
    // Connexion automatique
    setTimeout(() => {
      dispatch(login({ username: formData.username, password: formData.password }));
      setLoading(false);
      navigate('/dashboard');
    }, 500);
  };

  const passwordStrength = () => {
    const pass = formData.password;
    if (pass.length === 0) return { strength: 0, label: '', color: '' };
    if (pass.length < 6) return { strength: 25, label: 'Faible', color: '#e74c3c' };
    if (pass.length < 10) return { strength: 50, label: 'Moyen', color: '#f39c12' };
    if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { strength: 100, label: 'Fort', color: '#27ae60' };
    }
    return { strength: 75, label: 'Bon', color: '#3498db' };
  };

  const strength = passwordStrength();

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
              <h2>Commencez gratuitement dès aujourd'hui</h2>
              <p>Rejoignez des centaines d'entreprises qui font confiance à notre solution</p>
            </div>

            <div className="brand-benefits">
              <h3>Ce qui est inclus :</h3>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" />
                <div>
                  <h4>Accès complet</h4>
                  <p>Toutes les fonctionnalités disponibles</p>
                </div>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" />
                <div>
                  <h4>Support prioritaire</h4>
                  <p>Assistance disponible 24/7</p>
                </div>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" />
                <div>
                  <h4>Mises à jour régulières</h4>
                  <p>Nouvelles fonctionnalités chaque mois</p>
                </div>
              </div>
              <div className="benefit-item">
                <CheckCircle className="benefit-icon" />
                <div>
                  <h4>Sécurité garantie</h4>
                  <p>Vos données sont protégées</p>
                </div>
              </div>
            </div>

            <div className="brand-testimonial">
              <p className="testimonial-text">"La meilleure solution de comptabilité que j'ai utilisée. Simple, efficace et intuitive."</p>
              <div className="testimonial-author">
                <div className="author-avatar">👤</div>
                <div>
                  <div className="author-name">Ahmed Benali</div>
                  <div className="author-title">CEO, StartupMa</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Register Form */}
        <div className="auth-form-side">
          <div className="form-container">
            <div className="form-header">
              <h2>Créer un compte</h2>
              <p>Commencez votre essai gratuit</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="input-group">
                <label htmlFor="nom">Nom complet</label>
                <input
                  id="nom"
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  placeholder="Ex: Mohammed Alami"
                  autoFocus
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Adresse email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="exemple@email.com"
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label htmlFor="username">Nom d'utilisateur</label>
                <input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Choisissez un nom d'utilisateur"
                  autoComplete="username"
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
                    placeholder="Minimum 6 caractères"
                    autoComplete="new-password"
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
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${strength.strength}%`,
                          backgroundColor: strength.color 
                        }}
                      />
                    </div>
                    <span className="strength-label" style={{ color: strength.color }}>
                      {strength.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="terms-box">
                <p>En créant un compte, vous acceptez nos <a href="#" onClick={(e) => e.preventDefault()}>Conditions d'utilisation</a> et notre <a href="#" onClick={(e) => e.preventDefault()}>Politique de confidentialité</a>.</p>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Création du compte...</span>
                  </>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <p>Vous avez déjà un compte ?</p>
              <Link to="/login" className="link-primary">
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;