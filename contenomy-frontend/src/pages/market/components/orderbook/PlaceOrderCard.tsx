import React, { useState } from 'react';
import { Card, CardContent, Typography, Switch, TextField, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import IMarketShare from "@model/MarketShare";
import { useNavigate } from 'react-router-dom';

interface PlaceOrderCardProps {
  creatorAssetId: number;  // Assicuriamoci che questo sia l'ID della tabella CreatorAsset
  creator:IMarketShare | null; // set dati del creator
  onOrderPlaced: () => void;
}

const PlaceOrderCard: React.FC<PlaceOrderCardProps> = ({ creatorAssetId, creator, onOrderPlaced }) => {
  const { t } = useTranslation();
  const [isBuyOrder, setIsBuyOrder] = useState(true);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const quantityNum = parseInt(quantity);
    const priceNum = parseFloat(price);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a positive number');
      return;
    }

    const order = {
      creatorAssetId: creatorAssetId,
      type: 'Limit',
      direction: isBuyOrder ? 'Buy' : 'Sell',
      price: priceNum,
      quantity: quantityNum
    };

    try {
      const response = await fetch('https://localhost:7126/api/OrderBook/PlaceOrder', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      onOrderPlaced();
      setQuantity('');
      setPrice('');
    } catch (error) {
      console.error('Error placing order:', error);
      setError(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    }
  };


  const handleBuyNow = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const quantityNum = parseInt(quantity);
    const priceNum = parseFloat(price);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a positive number');
      return;
    }

    const order = {
      creatorAssetId: creatorAssetId,
      type: 'Limit',
      direction: isBuyOrder ? 'Buy' : 'Sell',
      price: priceNum,
      quantity: quantityNum
    };



    console.log(`Acquisto di ${quantity} SupportShare per ${creator?.nickname}`);
    const items = [
      { description: `SupportShare di ${creator?.nickname}`, amount: priceNum, quantity: quantity, creatorId: creator?.userId , order:order }
    ];
    
    // Naviga verso PaymentSummaryPage con items come state
    navigate('/payment-order/CheckRegistration', { state: { items } });
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{t('Piazza Ordine')}</Typography>
          <Box display="flex" alignItems="center">
            <Typography>{t('sell')}</Typography>
            <Switch
              checked={isBuyOrder}
              onChange={(e) => setIsBuyOrder(e.target.checked)}
              color="primary"
            />
            <Typography>{t('buy')}</Typography>
          </Box>
        </Box>
        <form onSubmit={handleBuyNow}>
          <TextField
            fullWidth
            label={t('quantity')}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            margin="normal"
            inputProps={{ min: "1" }}
          />
          <TextField
            fullWidth
            label={`${t('price')} (€)`}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            inputProps={{ min: "0.01", step: "0.01" }}
          />
          {error && (
            <Typography color="error" variant="body2">{error}</Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            style={{ marginTop: '16px' }}
          >
            {t('placeOrder')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderCard;