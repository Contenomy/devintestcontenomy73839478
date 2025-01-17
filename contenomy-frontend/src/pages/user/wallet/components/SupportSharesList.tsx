import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SupportShare {
  id: number;
  quantity: number;
  averagePrice: number;
  creatorNickname: string;
}

interface SupportSharesListProps {
  shares: SupportShare[];
}

export default function SupportSharesList({ shares }: SupportSharesListProps) {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom padding={2}>{t('wallet.mySupportShares')}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('Nome')}</TableCell>
            <TableCell align="right">{t('Quantità')}</TableCell>
            <TableCell align="right">{t('Valore acquisto')}</TableCell>
            <TableCell align="right">{t('Valore attuale')}</TableCell>
            <TableCell align="right">{t('uTILE')}</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
          {shares.map((share) => (
            <TableRow key={share.id}>
              <TableCell component="th" scope="row">{share.creatorNickname}</TableCell>
              <TableCell align="right">{share.quantity}</TableCell>
              <TableCell align="right">{t('number:currency', { value: share.averagePrice })}</TableCell>
              <TableCell align="right">{t('number:currency', { value: share.quantity * share.averagePrice })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

// Questo componente visualizza la lista delle SupportShare possedute dall'utente.
// Utilizza i dati reali ottenuti dall'API del backend.