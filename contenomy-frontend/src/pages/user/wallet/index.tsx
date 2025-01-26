import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Typography, CircularProgress, Alert, Pagination, IconButton, Tooltip, Paper } from '@mui/material';
import { environment } from '@environment/environment.development';
import { useTranslation } from 'react-i18next';
import { environment } from '@environment/environment.development';
import { Link } from 'react-router-dom';
import InvestmentSummary from './components/InvestmentSummary';
import SupportSharesList from './components/SupportSharesList';
import EventHistory from './components/EventHistory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SellIcon from '@mui/icons-material/Sell';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import './Wallet.css';

interface WalletEntry {
  id: number;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  creatorNickname: string;
  creatorId: string;
  performance: number;
}

interface Wallet {
  id: string;
  description: string;
  tag: string;
  balance: Balance;
  expirationDate: string;
}

interface Balance {
  currency: string;
  amount: number;
}

const ITEMS_PER_PAGE = 10;

export function Wallet() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [walletEntries, setWalletEntries] = useState<WalletEntry[]>([]);
  const [wallet, setWallets] = useState<Wallet>();
  const [page, setPage] = useState(1);

  const fetchWalletEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${environment.serverUrl}/Wallet/GetWalletEntries`, {
        credentials: 'include' 
      });
      if (!response.ok) {
        throw new Error('Impossibile recuperare i dati del portafoglio');
      }
      const data = await response.json();
      setWalletEntries(data.map((entry: any) => ({
        ...entry,
        performance: ((entry.currentPrice - entry.averagePrice) / entry.averagePrice) * 100
      })));
    } catch (error) {
      console.error("Errore durante il recupero dei dati del portafoglio:", error);
      setError(t('Errore nel caricamento dei dati del portafoglio'));
    } finally {
      setLoading(false);
      fetchWallet();
    }
  }, [t]);


  const fetchWallet = async () => {
    try {
      const response = await fetch(`${environment.serverUrl}/api/Account/UserWallet`, {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWallets(data);
      } else {
        console.error("Errore durante il recupero dei dati del wallet:", error);
        setError(t('Errore nel caricamento dei dati del wallet'));
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati del wallet:", error);
      setError(t('Errore nel caricamento dei dati del wallet'));
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletEntries();
    const intervalId = setInterval(fetchWalletEntries, 60000); // Aggiornamento ogni 60 secondi
    return () => clearInterval(intervalId);
  }, [fetchWalletEntries]);

  
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const paginatedEntries = walletEntries.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading && walletEntries.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="wallet-container">
      <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#FFFDE7' }}>
        <Typography variant="h4" gutterBottom>Panoramica del Portafoglio</Typography>
        <InvestmentSummary totalValue={wallet?.balance.amount} currency={wallet?.balance.currency} />
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#F9A825' }}>I Tuoi Investimenti</Typography>
        <SupportSharesList 
          shares={paginatedEntries} 
          renderActions={(share) => (
            <Box>
              <Tooltip title="Acquista">
                <IconButton onClick={() => console.log('Acquista', share.id)} sx={{ color: '#F9A825' }}>
                  <ShoppingCartIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vendi">
                <IconButton onClick={() => console.log('Vendi', share.id)} sx={{ color: '#F9A825' }}>
                  <SellIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vai al Mercato">
                <IconButton component={Link} to="/market">
                  <StorefrontIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Profilo Creator">
                <IconButton component={Link} to={`/creator/${share.creatorId}`}>
                  <PersonIcon />
                </IconButton>
              </Tooltip>
            </Box>
          )}
          renderPerformance={(performance) => (
            <Box display="flex" alignItems="center" color={performance >= 0 ? 'success.main' : 'error.main'}>
              {performance >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              <Typography>{performance.toFixed(2)}%</Typography>
            </Box>
          )}
        />
        <Pagination 
          count={Math.ceil(walletEntries.length / ITEMS_PER_PAGE)} 
          page={page} 
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, mb: 2 }}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#F9A825' }}>Storico Eventi</Typography>
        <EventHistory />
      </Paper>
    </Box>
  );
}

export default Wallet;
