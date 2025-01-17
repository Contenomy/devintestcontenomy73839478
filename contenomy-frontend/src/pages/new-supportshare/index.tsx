import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Link} from '@mui/material';

// Funzione per calcolare la commissione basata sulla quantità totale
const calculateCommission = (newQuantity: number, existingQuantity: number) => {
  const totalQuantity = newQuantity + existingQuantity;
  let commission = 0;

  if (totalQuantity <= 1000) return 0;
  
  if (totalQuantity <= 10000) {
    commission = Math.max(0, (totalQuantity - 1000) * 0.25);
  } else if (totalQuantity <= 20000) {
    commission = 2250 + Math.max(0, (totalQuantity - 10000) * 0.30);
  } else if (totalQuantity <= 30000) {
    commission = 5250 + Math.max(0, (totalQuantity - 20000) * 0.35);
  }
  // Aggiungi altre fasce secondo la tabella...

  // Calcola la commissione solo sulle nuove SupportShare
  const existingCommission = calculateCommission(0, existingQuantity);
  return commission - existingCommission;
};

// Dati di esempio per le immissioni passate
const pastIssuances = [
  { quantity: 5000, price: 1.2, date: '2023-05-15' },
  { quantity: 8000, price: 1.5, date: '2023-07-20' },
  { quantity: 3000, price: 1.8, date: '2023-09-10' },
];

export default function NewSupportShare() {
  const [quantity, setQuantity] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [commission, setCommission] = useState<number>(0);
  const [potentialGain, setPotentialGain] = useState<number>(0);
  const currentShareValue = 1; // Questo dovrebbe essere recuperato dal backend in futuro
  const existingQuantity = 1000; // Questo dovrebbe essere recuperato dal backend (TotalQuantity da CreatorAsset)

  useEffect(() => {
    const calculatedCommission = calculateCommission(quantity, existingQuantity) * currentShareValue;
    setCommission(calculatedCommission);
    setPotentialGain(quantity * currentShareValue - calculatedCommission);
  }, [quantity]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Qui andrà la logica per inviare i dati al backend
    console.log('Submitting:', { quantity, description, commission, potentialGain });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Emissione Nuove SupportShare
      </Typography>
      <Typography variant="body1" gutterBottom>
        SupportShare già emesse: {existingQuantity}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Quantità di nuove SupportShare da emettere"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Descrizione e Motivazione"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          Riepilogo
        </Typography>
        <Typography>
          Commissioni: €{commission.toFixed(2)}
        </Typography>
        <Typography>
          Guadagno Potenziale: €{potentialGain.toFixed(2)}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
          Il 50% della commissione viene devoluta come garanzia per gli investitori.{' '}
          <Link href="http://localhost:3000/terms-and-conditions" target="_blank" rel="noopener">
            Per saperne di più
          </Link>
        </Typography>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Conferma Emissione
        </Button>
      </form>
      
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Immissioni Passate
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Quantità di SupportShare</TableCell>
              <TableCell align="right">Prezzo di Immissione</TableCell>
              <TableCell align="right">Data di Emissione</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pastIssuances.map((issuance, index) => (
              <TableRow key={index}>
                <TableCell>{issuance.quantity}</TableCell>
                <TableCell align="right">€{issuance.price.toFixed(2)}</TableCell>
                <TableCell align="right">{issuance.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}