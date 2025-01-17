// OrderBookTables.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Typography } from '@mui/material';

interface Order {
  id: number;
  price: string;
  quantity: number;
  total: string;
  userId: string;
}

interface OrderBookTablesProps {
  creatorAssetId: number;
  forceUpdate: boolean;

}

const OrderBookTables: React.FC<OrderBookTablesProps> = ({ creatorAssetId, forceUpdate }) => {
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);

  const fetchOrderBook = useCallback(async () => {
    try {
      const response = await fetch(`https://localhost:7126/api/OrderBook/${creatorAssetId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order book');
      }
      const data = await response.json();
      setBuyOrders(data.buyOrders);
      setSellOrders(data.sellOrders);
    } catch (error) {
      console.error("Error fetching order book:", error);
    }
  }, [creatorAssetId]);

  useEffect(() => {
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 5000);
    return () => clearInterval(interval);
  }, [fetchOrderBook, forceUpdate]);

  const renderOrderTable = (orders: Order[], isBuyOrder: boolean) => (
    <TableContainer component={Paper} className={`order-table ${isBuyOrder ? 'buy-orders' : 'sell-orders'}`}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Prezzo €</TableCell>
            <TableCell align="right">Quantità</TableCell>
            <TableCell align="right">Totale €</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell component="th" scope="row">{parseFloat(order.price).toFixed(2)}</TableCell>
              <TableCell align="right">{order.quantity}</TableCell>
              <TableCell align="right">{parseFloat(order.total).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box display="flex" justifyContent="space-between">
      <Box width="48%">
        <Typography variant="h6" gutterBottom>Ordini di Vendita</Typography>
        {renderOrderTable(sellOrders, false)}
      </Box>
      <Box width="48%">
        <Typography variant="h6" gutterBottom>Ordini di Acquisto</Typography>
        {renderOrderTable(buyOrders, true)}
      </Box>
    </Box>
  );
};

export default OrderBookTables;