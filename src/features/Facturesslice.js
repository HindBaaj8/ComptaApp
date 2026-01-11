import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  factures: [],
  compteurFacture: 1,
  tauxTVA: 20,
};

const facturesSlice = createSlice({
  name: 'factures',
  initialState,
  reducers: {
    addFacture: (state, action) => {
      const {
        type,
        client,
        fournisseur,
        articles,
        dateFacture,
        dateEcheance,
        statut,
        notes,
        conditions,
      } = action.payload;

      let totalHT = 0;
      let totalTVA = 0;

      const articlesAvecCalculs = articles.map(article => {
        const montantHT = article.quantite * article.prixUnitaire;
        const montantTVA = (montantHT * article.tauxTVA) / 100;
        const montantTTC = montantHT + montantTVA;

        totalHT += montantHT;
        totalTVA += montantTVA;

        return {
          ...article,
          montantHT,
          montantTVA,
          montantTTC,
        };
      });

      const totalTTC = totalHT + totalTVA;

      const annee = new Date(dateFacture).getFullYear();
      const numeroFacture = `${annee}-${String(state.compteurFacture).padStart(4, '0')}`;

      const nouvelleFacture = {
        id: Date.now(),
        numero: numeroFacture,
        type,
        client: type === 'client' ? client : null,
        fournisseur: type === 'fournisseur' ? fournisseur : null,
        articles: articlesAvecCalculs,
        dateFacture: dateFacture || new Date().toISOString().split('T')[0],
        dateEcheance: dateEcheance || '',
        statut: statut || 'brouillon',
        notes: notes || '',
        conditions: conditions || '',
        totalHT,
        totalTVA,
        totalTTC,
        dateCreation: new Date().toISOString(),
        dateModification: new Date().toISOString(),
      };

      state.factures.push(nouvelleFacture);
      state.compteurFacture += 1;
    },

    updateFacture: (state, action) => {
      const { id, ...updates } = action.payload;
      const index = state.factures.findIndex(f => f.id === id);

      if (index !== -1) {
        if (updates.articles) {
          let totalHT = 0;
          let totalTVA = 0;

          const articlesAvecCalculs = updates.articles.map(article => {
            const montantHT = article.quantite * article.prixUnitaire;
            const montantTVA = (montantHT * article.tauxTVA) / 100;
            const montantTTC = montantHT + montantTVA;

            totalHT += montantHT;
            totalTVA += montantTVA;

            return {
              ...article,
              montantHT,
              montantTVA,
              montantTTC,
            };
          });

          const totalTTC = totalHT + totalTVA;

          state.factures[index] = {
            ...state.factures[index],
            ...updates,
            articles: articlesAvecCalculs,
            totalHT,
            totalTVA,
            totalTTC,
            dateModification: new Date().toISOString(),
          };
        } else {
          state.factures[index] = {
            ...state.factures[index],
            ...updates,
            dateModification: new Date().toISOString(),
          };
        }
      }
    },

    deleteFacture: (state, action) => {
      state.factures = state.factures.filter(f => f.id !== action.payload);
    },

    changeStatutFacture: (state, action) => {
      const { id, statut } = action.payload;
      const facture = state.factures.find(f => f.id === id);
      
      if (facture) {
        facture.statut = statut;
        facture.dateModification = new Date().toISOString();
        
        if (statut === 'payee') {
          facture.datePaiement = new Date().toISOString().split('T')[0];
        }
      }
    },

    marquerCommePaye: (state, action) => {
      const { id, datePaiement, modePaiement } = action.payload;
      const facture = state.factures.find(f => f.id === id);
      
      if (facture) {
        facture.statut = 'payee';
        facture.datePaiement = datePaiement || new Date().toISOString().split('T')[0];
        facture.modePaiement = modePaiement || 'especes';
        facture.dateModification = new Date().toISOString();
      }
    },

    envoyerFacture: (state, action) => {
      const facture = state.factures.find(f => f.id === action.payload);
      
      if (facture && facture.statut === 'brouillon') {
        facture.statut = 'envoyee';
        facture.dateEnvoi = new Date().toISOString().split('T')[0];
        facture.dateModification = new Date().toISOString();
      }
    },

    annulerFacture: (state, action) => {
      const { id, motif } = action.payload;
      const facture = state.factures.find(f => f.id === id);
      
      if (facture) {
        facture.statut = 'annulee';
        facture.motifAnnulation = motif || '';
        facture.dateAnnulation = new Date().toISOString().split('T')[0];
        facture.dateModification = new Date().toISOString();
      }
    },

    dupliquerFacture: (state, action) => {
      const facture = state.factures.find(f => f.id === action.payload);
      
      if (facture) {
        const annee = new Date().getFullYear();
        const numeroFacture = `${annee}-${String(state.compteurFacture).padStart(4, '0')}`;

        const nouvelleFacture = {
          ...facture,
          id: Date.now(),
          numero: numeroFacture,
          statut: 'brouillon',
          dateFacture: new Date().toISOString().split('T')[0],
          dateCreation: new Date().toISOString(),
          dateModification: new Date().toISOString(),
          datePaiement: null,
          dateEnvoi: null,
          dateAnnulation: null,
        };

        state.factures.push(nouvelleFacture);
        state.compteurFacture += 1;
      }
    },

    setTauxTVADefaut: (state, action) => {
      state.tauxTVA = action.payload;
    },
  },
});

export const {
  addFacture,
  updateFacture,
  deleteFacture,
  changeStatutFacture,
  marquerCommePaye,
  envoyerFacture,
  annulerFacture,
  dupliquerFacture,
  setTauxTVADefaut,
} = facturesSlice.actions;

export default facturesSlice.reducer;