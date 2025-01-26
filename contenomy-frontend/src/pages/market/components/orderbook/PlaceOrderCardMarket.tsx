import React, { useState } from 'react';
import { Card, CardContent, Typography, Switch, TextField, Button, Box, IconButton, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { environment } from '@environment/environment.development';
import './PlaceOrderCardMarket.css';

interface PlaceOrderCardProps {
  creatorAssetId: number;
  onOrderPlaced: () => void;
  currentPrice: number;
  isBuyOrder: boolean;
  onNavigateToPayment: (orderDetails: any) => void;
}

const PlaceOrderCardMarket: React.FC<PlaceOrderCardProps> = ({ creatorAssetId, onOrderPlaced, currentPrice, isBuyOrder: initialIsBuyOrder, onNavigateToPayment }) => {
  const { t } = useTranslation();
  const [isBuyOrder, setIsBuyOrder] = useState(initialIsBuyOrder);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (quantity <= 0) {
      setError('La quantità deve essere un numero positivo');
      return;
    }

    const order = {
      creatorAssetId: creatorAssetId,
      type: 'Market',
      direction: isBuyOrder ? 'Buy' : 'Sell',
      quantity: quantity
    };

    try {
      const response = await fetch(`${environment.serverUrl}/api/OrderBook/PlaceOrder`, {
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
        amount: currentPrice * quantity,
        quantity: quantity,
        order: responseData
      });

      setQuantity(1);
      onOrderPlaced();
    } catch (error) {
      console.error('Errore nel piazzare l\'ordine:', error);
      setError(error instanceof Error ? error.message : 'Impossibile piazzare l\'ordine. Riprova più tardi.');
    }
  };

  const handleTooltipToggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  return (
    <Card className="market-order-card">
      <CardContent>
        <Box className="market-order-switch-container">
          <Typography className="market-order-title">
            {isBuyOrder ? 'Acquista al miglior prezzo' : 'Vendi al miglior prezzo'}
            <Tooltip
              title="Un ordine a mercato viene eseguito immediatamente al miglior prezzo disponibile sul mercato. Non garantisce un prezzo specifico, ma assicura l'esecuzione rapida dell'ordine."
              open={tooltipOpen}
              onClose={() => setTooltipOpen(false)}
              disableFocusListener
              disableHoverListener
              disableTouchListener
            >
              <IconButton
                size="small"
                onClick={handleTooltipToggle}
                style={{ marginLeft: '5px', padding: '0' }}
              >
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography>Vendi</Typography>
            <Switch
              checked={isBuyOrder}
              onChange={(e) => setIsBuyOrder(e.target.checked)}
              className="market-order-switch"
            />
            <Typography>Acquista</Typography>
          </Box>
        </Box>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Quantità"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            className="market-order-quantity"
            inputProps={{ min: "1" }}
          />
          <Typography className="market-order-total">
            Totale: {t('number:currency', { value: currentPrice * quantity })}
          </Typography>
          {error && (
            <Typography className="market-order-error">{error}</Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="market-order-submit"
          >
            {isBuyOrder ? 'Compra subito' : 'Vendi subito'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PlaceOrderCardMarket;
