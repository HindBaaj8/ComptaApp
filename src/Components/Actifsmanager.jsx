import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTransaction, deleteTransaction } from '../features/Actifsslice';
import { formatCurrency, formatDate, exportToPDF } from '../features/Helpers';
import {
  Plus,
  Trash2,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  Building2,
  Users,
  BarChart3
} from 'lucide-react';

const Actifsmanager = () => {
  const dispatch = useDispatch();

  const { caisse, banque, clients, transactions } = useSelector(
    state => state.actifs || {
      caisse: 50000,
      banque: 150000,
      clients: 80000,
      transactions: []
    }
  );

  const [formData, setFormData] = useState({
    type: 'entree',
    montant: '',
    compte: 'caisse',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.montant || !formData.description) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    const montant = parseFloat(formData.montant);
    const solde =
      formData.compte === 'caisse'
        ? caisse
        : formData.compte === 'banque'
        ? banque
        : clients;

    if (formData.type === 'sortie' && montant > solde) {
      showToast('Solde insuffisant', 'error');
      return;
    }

    dispatch(addTransaction(formData));
    showToast('Transaction enregistrée avec succès', 'success');

    setFormData({
      type: 'entree',
      montant: '',
      compte: 'caisse',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Annuler cette transaction ?')) {
      dispatch(deleteTransaction(id));
      showToast('Transaction annulée', 'success');
    }
  };

  const handleExportPDF = () => {
    const data = transactions.map(t => ({
      Date: formatDate(t.date),
      Type: t.type === 'entree' ? 'Entrée' : 'Sortie',
      Compte: t.compte,
      Description: t.description,
      Montant: formatCurrency(t.montant)
    }));

    exportToPDF(data, 'Historique des Transactions');
    showToast('Export PDF réussi', 'success');
  };

  return (
    <div>
      {/* ================= TOAST ================= */}
      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {/* ================= KPI ================= */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <Wallet />
          <div>
            <div className="kpi-label">Caisse</div>
            <div className="kpi-value">{formatCurrency(caisse)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <Building2 />
          <div>
            <div className="kpi-label">Banque</div>
            <div className="kpi-value">{formatCurrency(banque)}</div>
          </div>
        </div>

        <div className="kpi-card">
          <Users />
          <div>
            <div className="kpi-label">Clients</div>
            <div className="kpi-value">{formatCurrency(clients)}</div>
          </div>
        </div>

        <div className="kpi-card success">
          <BarChart3 />
          <div>
            <div className="kpi-label">Total Actifs</div>
            <div className="kpi-value">
              {formatCurrency(caisse + banque + clients)}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="form-section">
        <h3>Nouvelle transaction</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="entree">Entrée</option>
                <option value="sortie">Sortie</option>
              </select>
            </div>

            <div className="form-group">
              <label>Compte</label>
              <select
                value={formData.compte}
                onChange={e => setFormData({ ...formData, compte: e.target.value })}
              >
                <option value="caisse">Caisse</option>
                <option value="banque">Banque</option>
                <option value="clients">Clients</option>
              </select>
            </div>

            <div className="form-group">
              <label>Montant</label>
              <input
                type="number"
                value={formData.montant}
                onChange={e => setFormData({ ...formData, montant: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="form-group full">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={e =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
          </div>

          <button className="btn btn-primary">
            <Plus size={18} />
            Enregistrer
          </button>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-section">
        <div className="table-header">
          <h3>Historique des transactions</h3>
          <button className="btn btn-success" onClick={handleExportPDF}>
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {transactions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Compte</th>
                <th>Description</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map(t => (
                <tr key={t.id}>
                  <td>{formatDate(t.date)}</td>
                  <td>
                    {t.type === 'entree' ? (
                      <span className="success">
                        <TrendingUp size={14} /> Entrée
                      </span>
                    ) : (
                      <span className="danger">
                        <TrendingDown size={14} /> Sortie
                      </span>
                    )}
                  </td>
                  <td>{t.compte}</td>
                  <td>{t.description}</td>
                  <td className={t.type === 'entree' ? 'success' : 'danger'}>
                    {formatCurrency(t.montant)}
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => handleDelete(t.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h4>Aucune transaction</h4>
            <p>Ajoutez votre première transaction</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Actifsmanager;
