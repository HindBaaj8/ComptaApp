import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPassif, deletePassif, payPassif } from '../features/Passifsslice';
import { addTransaction } from '../features/Actifsslice';
import { formatCurrency, formatDate } from '../features/Helpers';
import {
  Plus,
  Trash2,
  DollarSign,
  AlertCircle,
  Truck,
  CreditCard,
  Receipt,
  BarChart3,
  Wallet,
  Building2
} from 'lucide-react';

const Passifsmanager = () => {
  const dispatch = useDispatch();

  const { fournisseurs, dettes, tvaAPayer, items } = useSelector(
    state => state.passifs || {
      fournisseurs: 45000,
      dettes: 30000,
      tvaAPayer: 8000,
      items: []
    }
  );

  const { caisse, banque } = useSelector(
    state => state.actifs || { caisse: 0, banque: 0 }
  );

  const [formData, setFormData] = useState({
    type: 'fournisseurs',
    montant: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.montant || !formData.description) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    dispatch(addPassif(formData));
    showToast('Passif ajouté avec succès', 'success');

    setFormData({
      type: 'fournisseurs',
      montant: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    if (window.confirm('Supprimer ce passif ?')) {
      dispatch(deletePassif(id));
      showToast('Passif supprimé', 'success');
    }
  };

  /* ================= PAY ================= */
  const handlePay = (item) => {
    const montant = prompt('Montant à payer :');
    if (!montant || parseFloat(montant) <= 0) return;

    const paiement = parseFloat(montant);
    if (paiement > item.montant) {
      showToast('Le montant dépasse le total dû', 'error');
      return;
    }

    const compte = prompt('Payer depuis :\n1. Caisse\n2. Banque');
    let compteChoisi = null;

    if (compte === '1') {
      if (paiement > caisse) return showToast('Solde caisse insuffisant', 'error');
      compteChoisi = 'caisse';
    } else if (compte === '2') {
      if (paiement > banque) return showToast('Solde banque insuffisant', 'error');
      compteChoisi = 'banque';
    } else {
      return showToast('Choix invalide', 'error');
    }

    dispatch(payPassif({ id: item.id, montant: paiement }));

    dispatch(
      addTransaction({
        type: 'sortie',
        montant: paiement,
        compte: compteChoisi,
        description: `Paiement ${item.type} : ${item.description}`,
        date: new Date().toISOString().split('T')[0]
      })
    );

    showToast(`Paiement effectué (${formatCurrency(paiement)})`, 'success');
  };

  const totalPassifs = fournisseurs + dettes + tvaAPayer;

  return (
    <div>
      {/* ================= TOAST ================= */}
      {toast.show && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      {/* ================= KPI ================= */}
      <div className="kpi-grid">
        <div className="kpi-card warning">
          <Truck />
          <div>
            <div className="kpi-label"><span style={{ fontSize: '20px'}}>Fournisseurs</span></div>
            <div className="kpi-value">{formatCurrency(fournisseurs)}</div>
          </div>
        </div>

        <div className="kpi-card warning">
          <CreditCard />
          <div>
            <div className="kpi-label"><span style={{ fontSize: '20px'}}>dettes</span></div>
            <div className="kpi-value">{formatCurrency(dettes)}</div>
          </div>
        </div>

        <div className="kpi-card warning">
          <Receipt />
          <div>
            <div className="kpi-label"><span style={{ fontSize: '20px'}}>TVA à payer</span></div>
            <div className="kpi-value">{formatCurrency(tvaAPayer)}</div>
          </div>
        </div>

        <div className="kpi-card danger">
          <BarChart3 />
          <div>
            <div className="kpi-label"><span style={{ fontSize: '20px'}}>total Passifs</span></div>
            <div className="kpi-value">{formatCurrency(totalPassifs)}</div>
          </div>
        </div>
      </div>

      {/* ================= AVAILABLE BALANCE ================= */}
      <div className="panel" style={{ display: 'flex', gap: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet />
          <strong>Caisse :</strong> {formatCurrency(caisse)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 />
          <strong>Banque :</strong> {formatCurrency(banque)}
        </div>
      </div><br></br>

      {/* ================= FORM ================= */}
      <div className="form-section">
        <h3>Nouveau passif</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="fournisseurs">Fournisseurs</option>
                <option value="dettes">Dettes</option>
                <option value="tvaAPayer">TVA à payer</option>
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
            Ajouter
          </button>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-section">
        <div className="table-header">
          <h3>Liste des passifs</h3>
        </div>

        {items.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Description</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {[...items].reverse().map(item => (
                <tr key={item.id}>
                  <td>{formatDate(item.date)}</td>
                  <td>
                    <span className="badge warning">{item.type}</span>
                  </td>
                  <td>{item.description}</td>
                  <td className="danger">{formatCurrency(item.montant)}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-success" onClick={() => handlePay(item)}>
                        <DollarSign size={14} />
                        Payer
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(item.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <AlertCircle size={56} />
            <h4>Aucun passif enregistré</h4>
            <p>Ajoutez votre premier passif</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Passifsmanager;
