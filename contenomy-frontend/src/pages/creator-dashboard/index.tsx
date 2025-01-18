import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Interfaccia per i dati del creator
interface CreatorStats {
  supportShareValue: number;
  soldSupportShares: number;
  availableSupportShares: number;
  marketCap: number;
  investorsCount: number;
}

export default function CreatorDashboard() {
  const [stats, setStats] = useState<CreatorStats | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Sostituire con una chiamata API reale quando disponibile
    const fetchCreatorStats = async () => {
      // Simula una chiamata API
      const dummyStats: CreatorStats = {
        supportShareValue: 10.5,
        soldSupportShares: 1000,
        availableSupportShares: 500,
        marketCap: 10500,
        investorsCount: 150
      };
      setStats(dummyStats);
    };

    fetchCreatorStats();
  }, []);

  const handleNewSupportSharesClick = () => {
    navigate('/new-supportshare');
  };

  const handleManageRewardsClick = () => {
    navigate('/manage-rewards');
  };

  if (!stats) {
    return <Typography>Caricamento...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard Creator</Typography>

      {/* Sezione Informativa */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Valore SupportShare</Typography>
              <Typography variant="h5">${stats.supportShareValue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>SupportShare Vendute</Typography>
              <Typography variant="h5">{stats.soldSupportShares}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>SupportShare Disponibili</Typography>
              <Typography variant="h5">{stats.availableSupportShares}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Market Cap</Typography>
              <Typography variant="h5">${stats.marketCap.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>Numero di Investitori</Typography>
              <Typography variant="h5">{stats.investorsCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottoni per le altre sezioni */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            onClick={handleNewSupportSharesClick}
            sx={{ py: 2 }}
          >
            Immetti Nuove SupportShare
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Aumenta il tuo potenziale di guadagno emettendo nuove SupportShare!
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button 
            variant="contained" 
            color="secondary" 
            fullWidth 
            size="large"
            onClick={handleManageRewardsClick}
            sx={{ py: 2 }}
          >
            Gestisci Premi
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Ricompensa i tuoi investitori e aumenta la loro fedeltà!
          </Typography>
        </Grid>
      </Grid>

      {/* Sezione Vendi Prodotti e Servizi */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            href="/shop/sell-products-services"
            fullWidth 
            size="large"
            sx={{ py: 2 }}
          >
            Vendi prodotti/servizi
          </Button>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Gestisci i tuoi prodotti e servizi in vendita!
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
}
