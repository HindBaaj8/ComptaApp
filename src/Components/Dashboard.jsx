import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, DollarSign, CreditCard, AlertCircle, Wallet } from 'lucide-react';
import { formatCurrency } from '../features/Helpers';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { capitalInitial } = useSelector(state => state.capitaux || { capitalInitial: 100000 });
  const { caisse, banque, clients } = useSelector(state => state.actifs || { caisse: 50000, banque: 150000, clients: 80000 });
  const { fournisseurs, dettes, tvaAPayer } = useSelector(state => state.passifs || { fournisseurs: 45000, dettes: 30000, tvaAPayer: 8000 });
  const charges = useSelector(state => state.charges?.items || []);
  const produits = useSelector(state => state.produits?.items || []);
  const factures = useSelector(state => state.factures?.factures || []);

  const facturesClients = factures.filter(f => f.type === 'client' && f.statut === 'payee');
  const facturesFournisseurs = factures.filter(f => f.type === 'fournisseur' && f.statut === 'payee');
  const facturesEnAttente = factures.filter(f => f.statut === 'envoyee');

  const totalActifs = caisse + banque + clients;
  const totalPassifs = fournisseurs + dettes + tvaAPayer;
  
  const totalCharges = charges.reduce((sum, item) => sum + parseFloat(item.montant || 0), 0);
  const totalFacturesFournisseurs = facturesFournisseurs.reduce((sum, f) => sum + f.totalTTC, 0);
  const totalChargesComplet = totalCharges + totalFacturesFournisseurs;

  const totalProduits = produits.reduce((sum, item) => sum + parseFloat(item.montant || 0), 0);
  const totalFacturesClients = facturesClients.reduce((sum, f) => sum + f.totalTTC, 0);
  const totalProduitsComplet = totalProduits + totalFacturesClients;

  const resultatCalcule = totalProduitsComplet - totalChargesComplet;

  const creancesEnAttente = facturesEnAttente
    .filter(f => f.type === 'client')
    .reduce((sum, f) => sum + f.totalTTC, 0);
  
  const dettesEnAttente = facturesEnAttente
    .filter(f => f.type === 'fournisseur')
    .reduce((sum, f) => sum + f.totalTTC, 0);

  const chargesParCategorie = useMemo(() => {
    const categories = {};
    
    charges.forEach(charge => {
      const cat = charge.categorie || 'Autre';
      categories[cat] = (categories[cat] || 0) + parseFloat(charge.montant || 0);
    });
    
    if (totalFacturesFournisseurs > 0) {
      categories['Factures Fournisseurs'] = totalFacturesFournisseurs;
    }
    
    return categories;
  }, [charges, totalFacturesFournisseurs]);

  const pieData = {
    labels: Object.keys(chargesParCategorie),
    datasets: [{
      label: 'Charges par catégorie',
      data: Object.values(chargesParCategorie),
      backgroundColor: [
        'rgba(41, 128, 185, 0.8)',
        'rgba(39, 174, 96, 0.8)',
        'rgba(52, 152, 219, 0.8)',
        'rgba(46, 204, 113, 0.8)',
        'rgba(26, 188, 156, 0.8)',
        'rgba(155, 89, 182, 0.8)',
        'rgba(44, 62, 80, 0.8)',
        'rgba(230, 126, 34, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
    }],
  };

  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthsSet = new Set();
  produits.forEach(p => monthsSet.add(new Date(p.date).getMonth()));
  charges.forEach(c => monthsSet.add(new Date(c.date).getMonth()));
  facturesClients.forEach(f => monthsSet.add(new Date(f.dateFacture).getMonth()));
  facturesFournisseurs.forEach(f => monthsSet.add(new Date(f.dateFacture).getMonth()));
  
  const sortedMonths = Array.from(monthsSet).sort((a, b) => a - b);

  const produitsParMois = sortedMonths.map(m => {
    const produitsMois = produits
      .filter(p => new Date(p.date).getMonth() === m)
      .reduce((sum, p) => sum + parseFloat(p.montant || 0), 0);
    
    const facturesMois = facturesClients
      .filter(f => new Date(f.dateFacture).getMonth() === m)
      .reduce((sum, f) => sum + f.totalTTC, 0);
    
    return produitsMois + facturesMois;
  });

  const chargesParMois = sortedMonths.map(m => {
    const chargesMois = charges
      .filter(c => new Date(c.date).getMonth() === m)
      .reduce((sum, c) => sum + parseFloat(c.montant || 0), 0);
    
    const facturesMois = facturesFournisseurs
      .filter(f => new Date(f.dateFacture).getMonth() === m)
      .reduce((sum, f) => sum + f.totalTTC, 0);
    
    return chargesMois + facturesMois;
  });

  let soldeCumule = 0;
  const soldeParMois = sortedMonths.map((m, idx) => {
    const soldeMois = produitsParMois[idx] - chargesParMois[idx];
    soldeCumule += soldeMois;
    return soldeCumule;
  });

  const barDataDynamic = {
    labels: sortedMonths.map(m => monthNames[m]),
    datasets: [
      { label: 'Produits + Factures Clients', data: produitsParMois, backgroundColor: 'rgba(39, 174, 96, 0.8)' },
      { label: 'Charges + Factures Fournisseurs', data: chargesParMois, backgroundColor: 'rgba(231, 76, 60, 0.8)' },
    ],
  };

  const lineDataDynamic = {
    labels: sortedMonths.map(m => monthNames[m]),
    datasets: [{
      label: 'Solde Cumulé',
      data: soldeParMois,
      borderColor: 'rgb(41, 128, 185)',
      backgroundColor: 'rgba(41, 128, 185, 0.1)',
      tension: 0.4,
      fill: true,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2> Tableau de Bord</h2>
        <p>Vue d'ensemble de votre comptabilité</p>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card success">
          <div className="kpi-label"><TrendingUp size={20} /><span style={{ fontSize: '20px'}}>Total Revenus</span> </div>
          <div className="kpi-value">{formatCurrency(totalProduitsComplet)}</div>
          <small style={{ fontSize: '12px', opacity: 0.8 }}>
            Produits: {formatCurrency(totalProduits)} + Factures: {formatCurrency(totalFacturesClients)}
          </small>
        </div>

        <div className="kpi-card danger">
          <div className="kpi-label"><TrendingDown size={20} /><span style={{ fontSize: '20px'}}>Total Dépenses</span></div>
          <div className="kpi-value">{formatCurrency(totalChargesComplet)}</div>
          <small style={{ fontSize: '12px', opacity: 0.8 }}>
            Charges: {formatCurrency(totalCharges)} + Factures: {formatCurrency(totalFacturesFournisseurs)}
          </small>
        </div>

        <div className={`kpi-card ${resultatCalcule >= 0 ? 'success' : 'danger'}`}>
          <div className="kpi-label"><DollarSign size={20} /> <span style={{ fontSize: '20px'}}>Résultat</span></div>
          <div className="kpi-value">{formatCurrency(resultatCalcule)}</div>
          <small style={{ fontSize: '12px', opacity: 0.8 }}>
            {resultatCalcule >= 0 ? ' Bénéfice' : ' Perte'}
          </small>
        </div>

        <div className="kpi-card">
          <div className="kpi-label"><Wallet size={20} /> <span style={{ fontSize: '20px'}}>Capital Total</span></div>
          <div className="kpi-value">{formatCurrency(capitalInitial + resultatCalcule)}</div>
          <small style={{ fontSize: '12px', opacity: 0.8 }}>
            Initial: {formatCurrency(capitalInitial)}
          </small>
        </div>

        <div className="kpi-card success">
          <div className="kpi-label"><CreditCard size={20} /><span style={{ fontSize: '20px'}}>Actifs Totaux</span></div>
          <div className="kpi-value">{formatCurrency(totalActifs)}</div>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-label"><AlertCircle size={20} /><span style={{ fontSize: '20px'}}>Passifs Totaux</span></div>
          <div className="kpi-value">{formatCurrency(totalPassifs)}</div>
        </div>
      </div>

      <div className="kpi-grid" style={{ marginTop: '20px' }}>
        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #2980b9, #27ae60)' }}>
          <div className="kpi-label" style={{ color: 'white' }}> <span style={{ fontSize: '20px'}}>Factures Clients Payées</span></div>
          <div className="kpi-value" style={{ color: 'white' }}>{facturesClients.length}</div>
          <small style={{ fontSize: '12px', color: 'white', opacity: 0.9 }}>
            Montant: {formatCurrency(totalFacturesClients)}
          </small>
        </div>

        <div className="kpi-card" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
          <div className="kpi-label" style={{ color: 'white' }}><span style={{ fontSize: '20px'}}>Factures Fournisseurs Payées</span></div>
          <div className="kpi-value" style={{ color: 'white' }}>{facturesFournisseurs.length}</div>
          <small style={{ fontSize: '12px', color: 'white', opacity: 0.9 }}>
            Montant: {formatCurrency(totalFacturesFournisseurs)}
          </small>
        </div>

        <div className="kpi-card warning">
          <div className="kpi-label"> <span style={{ fontSize: '20px'}}>Créances en Attente</span></div>
          <div className="kpi-value">{formatCurrency(creancesEnAttente)}</div>
          <small style={{ fontSize: '12px', opacity: 0.8 }}>
            {facturesEnAttente.filter(f => f.type === 'client').length} facture(s)
          </small>
        </div>

        <div className="kpi-card danger">
          <div className="kpi-label"> <span style={{ fontSize: '20px'}}>Dettes en Attente</span></div>
          <div className="kpi-value">{formatCurrency(dettesEnAttente)}</div>
          <small style={{ fontSize: '12px', opacity: 0.8 }}>
            {facturesEnAttente.filter(f => f.type === 'fournisseur').length} facture(s)
          </small>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Distribution des Charges</h3>
          {charges.length > 0 || facturesFournisseurs.length > 0 ? (
            <Pie data={pieData} options={chartOptions} />
          ) : (
            <div className="empty-state">
              <p>Aucune charge enregistrée</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <h3>Revenus vs Dépenses Mensuelles</h3>
          <Bar data={barDataDynamic} options={chartOptions} />
        </div>

        <div className="chart-card" style={{ gridColumn: 'span 2' }}>
          <h3>Évolution du Solde</h3>
          <Line data={lineDataDynamic} options={chartOptions} />
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card"> Caisse<div className="kpi-value">{formatCurrency(caisse)}</div></div>
        <div className="kpi-card"> Banque<div className="kpi-value">{formatCurrency(banque)}</div></div>
        <div className="kpi-card"> Clients<div className="kpi-value">{formatCurrency(clients)}</div></div>
        <div className="kpi-card warning"> Fournisseurs<div className="kpi-value">{formatCurrency(fournisseurs)}</div></div>
        <div className="kpi-card warning"> Dettes<div className="kpi-value">{formatCurrency(dettes)}</div></div>
        <div className="kpi-card warning"> TVA à payer<div className="kpi-value">{formatCurrency(tvaAPayer)}</div></div>
      </div>
    </div>
  );
};

export default Dashboard;