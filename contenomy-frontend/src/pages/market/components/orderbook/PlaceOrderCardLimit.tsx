import React, { useState } from 'react';
import { Card, CardContent, Typography, TextField, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './PlaceOrderCardLimit.css';

interface PlaceOrderCardLimitProps {
  creatorAssetId: number;
  onOrderPlaced: () => void;
  onNavigateToPayment: (orderDetails: any) => void;
}

const PlaceOrderCardLimit: React.FC<PlaceOrderCardLimitProps> = ({ creatorAssetId, onOrderPlaced, onNavigateToPayment }) => {
  const { t } = useTranslation();
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isBuyOrder, setIsBuyOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (price <= 0 || quantity <= 0) {
      setError('Prezzo e quantità devono essere numeri positivi');
      return;
    }

    const order = {
      creatorAssetId: creatorAssetId,
      type: 'Limit',
      direction: isBuyOrder ? 'Buy' : 'Sell',
      price: price,
      quantity: quantity
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
        throw new Error(errorData.message || 'Impossibile piazzare l\'ordine');
      }

      const responseData = await response.json();

      // Navigazione alla pagina di pagamento con i dettagli dell'ordine
      onNavigateToPayment({
        amount: price * quantity,
        quantity: quantity,
        order: responseData
      });

      setPrice(0);
      setQuantity(1);
      onOrderPlaced();
    } catch (error) {
      console.error('Errore nel piazzare l\'ordine:', error);
      setError(error instanceof Error ? error.message : 'Impossibile piazzare l\'ordine. Riprova più tardi.');
    }
  };

  return (
    <Card className="limit-order-card">
      <CardContent>
        <Typography className="limit-order-title">
          {isBuyOrder ? 'Compra con ordine limite' : 'Vendi con ordine limite'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Prezzo"
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="limit-order-input"
            inputProps={{ min: "0" }}
          />
          <TextField
            fullWidth
            label="Quantità"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="limit-order-input"
            inputProps={{ min: "1" }}
          />
          <Typography className="limit-order-total">
            Totale: {t('number:currency', { value: price * quantity })}
          </Typography>
          {error && (
            <Typography className="limit-order-error">{error}</Typography>
          )}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              className="limit-order-submit"
            >
              {isBuyOrder ? 'Compra' : 'Vendi'}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderCardLimit;
