import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress, Alert, Collapse, Card, CardContent, Grid } from '@mui/material';
import { Star, StarBorder, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { environment } from "@environment/environment.development";
import IMarketShare from "@model/MarketShare";
import PriceChart from './components/chart/PriceChart';
import PlaceOrderCardMarket from './components/orderbook/PlaceOrderCardMarket';
import PlaceOrderCardLimit from './components/orderbook/PlaceOrderCardLimit';
import OrderBookTables from './components/orderbook/OrderBookTables';
import './ShareDetail.css';

export default function ShareDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [creator, setCreator] = useState<IMarketShare | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [creatorAssetId, setCreatorAssetId] = useState<number | null>(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  const fetchCreatorDetails = useCallback(async () => {
    if (id) {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${environment.serverUrl}/api/ContentCreator/${id}`);

        if (!response.ok) {
          throw new Error('Errore nel caricamento dei dati del creator');
        }
        const details = await response.json();
        setCreator(details);
        setCreatorAssetId(details.creatorAssetId);
      } catch (error) {
        console.error("Error fetching creator details:", error);
        setError('Si è verificato un errore nel caricamento dei dati. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchCreatorDetails();
  }, [fetchCreatorDetails]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleOrderPlaced = () => {
    setForceUpdate((prev) => !prev);
    fetchCreatorDetails();
  };

  const handleNavigateToPayment = (orderDetails: any) => {
    const items = [
      {
        description: `SupportShare di ${creator?.name || creator?.nickname}`,
        amount: orderDetails.amount,
        quantity: orderDetails.quantity,
        creatorId: creator?.userId,
        order: orderDetails,
      },
    ];

    navigate('/payment-order/CheckRegistration', { state: { items } });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!creator) {
    return <Typography>Nessun dato disponibile per questo creator.</Typography>;
  }

  const imagePath = creator.thumbnail ?? "/user.png";
  const bioLength = creator.description?.length ?? 0;

  return (
    <Box className="share-detail-container">
  {/* Card principale che contiene tutto */}
  <Card className="main-card">
    <CardContent className="main-card-content">
      {/* Sezione info creator */}
      <Box className="creator-info">
        <Box
          component="img"
          src={imagePath}
          alt={creator.name || creator.nickname}
          className="creator-image"
        />
        <Typography variant="h4" className="creator-name">{creator.name || creator.nickname}</Typography>
        <Box className="creator-metrics">
          <Typography>Market Cap: {t('number:currency', { value: creator.totalQuantity * creator.currentValue })}</Typography>
          <Typography>Prezzo attuale: {t('number:currency', { value: creator.currentValue })}</Typography>
        </Box>
        <Button
          onClick={toggleFavorite}
          startIcon={isFavorite ? <Star /> : <StarBorder />}
          className="favorite-button"
        >
          {isFavorite ? 'Preferito' : 'Aggiungi ai preferiti'}
        </Button>
      </Box>

      {/* Bio con sfondo giallo */}
      <Box className="creator-bio">
        <Typography variant="h6">Bio</Typography>
        <Collapse in={showFullBio || bioLength <= 400} collapsedSize={80}>
          <Typography variant="body2">
            {creator.description || "Nessuna biografia disponibile."}
          </Typography>
        </Collapse>
        {bioLength > 400 && (
          <Button
            onClick={() => setShowFullBio(!showFullBio)}
            endIcon={showFullBio ? <ExpandLess /> : <ExpandMore />}
          >
            {showFullBio ? 'Mostra meno' : 'Leggi di più'}
          </Button>
        )}
      </Box>
    </CardContent>
  </Card>

      

      <Typography variant="h5" mb={2}>SupportShare di {creator.name || creator.nickname}</Typography>

      <Box className="chart-and-trade-section">
        <Box className="chart-container">
          <PriceChart creatorId={id || ''} />
        </Box>
        <Box className="buy-sell-section">
          <PlaceOrderCardMarket
            creatorAssetId={creatorAssetId || 0}
            onOrderPlaced={handleOrderPlaced}
            currentPrice={creator.currentValue}
            isBuyOrder={true}
            onNavigateToPayment={handleNavigateToPayment}
          />
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="explore-order-book"
          >
  {showAdvanced ? "Nascondi Libro Ordini" : "Esplora Libro Ordini >>"}
</Button>

        </Box>
      </Box>

      <Collapse in={showAdvanced}>
        <Box className="advanced-trading-section">
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card className="order-book-card">
                <CardContent>
                  <OrderBookTables creatorAssetId={creatorAssetId || 0} forceUpdate={forceUpdate} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <PlaceOrderCardLimit
                creatorAssetId={creatorAssetId || 0}
                onOrderPlaced={handleOrderPlaced}
                onNavigateToPayment={handleNavigateToPayment}
              />
            </Grid>
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
}
