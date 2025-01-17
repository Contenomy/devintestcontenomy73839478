import React from 'react';
import { Box, Typography, Button } from '@mui/material';

export default function CreatorDashboard() {
  return (
    <Box className="creator-dashboard">
      <Typography variant="h4" gutterBottom>
        Pannello di gestione del Creator
      </Typography>
      
      <Box className="dashboard-section">
        <Typography variant="h6">Informazioni principali</Typography>
        {/* Aggiungere qui le informazioni principali */}
      </Box>
      
      <Box className="dashboard-section">
        <Typography variant="h6">Immissione nuove SupportShare</Typography>
        <Button variant="contained" color="primary" href="/new-supportshare">
          Immetti nuove SupportShare
        </Button>
      </Box>
      
      <Box className="dashboard-section">
        <Typography variant="h6">Gestione premi</Typography>
        {/* Aggiungere qui la gestione dei premi */}
      </Box>
    </Box>
  );
}