import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Questo è un componente placeholder per lo storico degli eventi
export default function EventHistory() {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom padding={2}>{t('wallet.eventHistory')}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('wallet.eventType')}</TableCell>
            <TableCell>{t('wallet.creator')}</TableCell>
            <TableCell>{t('wallet.description')}</TableCell>
            <TableCell>{t('wallet.date')}</TableCell>
            <TableCell>{t('wallet.value')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell colSpan={5} align="center">
              {t('wallet.noEventsYet')}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Questo componente è un placeholder per lo storico degli eventi.
// Al momento non ci sono dati reali da visualizzare, quindi mostra solo un messaggio.
// In futuro, dovrà essere implementata la logica per recuperare e visualizzare gli eventi reali.