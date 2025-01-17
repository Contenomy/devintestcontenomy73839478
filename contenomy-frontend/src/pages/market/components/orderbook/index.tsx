import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PriceChart from '../chart/PriceChart';
import PlaceOrderCard from './PlaceOrderCard';
import OrderBookTables from './OrderBookTables';
import IMarketShare from "@model/MarketShare";
import './OrderBook.css';

export default function OrderBook() {
  const { id: creatorId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creatorAssetId, setCreatorAssetId] = useState<number | null>(null);
  const [creator, setCreator] = useState<IMarketShare | null>(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  const fetchCreatorAssetId = useCallback(async () => {
    if (creatorId) {
      try {
        setLoading(true);
        const response = await fetch(`https://localhost:7126/api/ContentCreator/${creatorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch creator asset');
        }
        const data = await response.json();
        if (data.creatorAssetId) {
          setCreatorAssetId(data.creatorAssetId);
          setCreator(data);
        } else {
          throw new Error('Creator asset ID not found');
        }
      } catch (error) {
        console.error("Error fetching creator asset:", error);
        setError("Failed to load creator asset information. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
  }, [creatorId]);

  useEffect(() => {
    fetchCreatorAssetId();
  }, [fetchCreatorAssetId]);

  const handleOrderPlaced = () => {
    if (creatorAssetId) {
      setForceUpdate(prev => !prev);
    }
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
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="order-book-container">
      <Typography variant="h4" gutterBottom>{t('orderBook')}</Typography>
      
      <Box className="chart-container" mb={4}>
        <PriceChart creatorId={creatorId || ''} />
      </Box>

      {creatorAssetId && (
        <OrderBookTables creatorAssetId={creatorAssetId} forceUpdate={forceUpdate} />
      )}

      {creatorAssetId && (
        <Box mt={4}>
          <PlaceOrderCard 
            creatorAssetId={creatorAssetId} 
            creator={creator}
            onOrderPlaced={handleOrderPlaced} 
          />
        </Box>
      )}

      <Box mt={4} display="flex" justifyContent="space-between">
        <Link to={`/market/${creatorId}`}>
          <Button variant="outlined">
            {t('overview')}
          </Button>
        </Link>
      </Box>
    </Box>
  );
}