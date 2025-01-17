import React, { useState } from 'react';
import { Box, Typography, FormGroup, FormControlLabel, Switch } from '@mui/material';

export default function NotificationsTab() {
  const [notifications, setNotifications] = useState({
    monthly: true,
    valueChange: true,
    specialPromotions: true,
    newCreators: true,
  });

  const handleChange = (event) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Notifiche</Typography>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={notifications.monthly} onChange={handleChange} name="monthly" />}
          label="Riepilogo mensile"
        />
        <FormControlLabel
          control={<Switch checked={notifications.valueChange} onChange={handleChange} name="valueChange" />}
          label="Variazione del 10% del valore di una SupportShare posseduta"
        />
        <FormControlLabel
          control={<Switch checked={notifications.specialPromotions} onChange={handleChange} name="specialPromotions" />}
          label="Promozioni speciali"
        />
        <FormControlLabel
          control={<Switch checked={notifications.newCreators} onChange={handleChange} name="newCreators" />}
          label="Nuovi creator sulla piattaforma"
        />
        <FormControlLabel
          control={<Switch checked={notifications.marketUpdates} onChange={handleChange} name="marketUpdates" />}
          label="Aggiornamenti di mercato"
        />
      </FormGroup>
    </Box>
  );
}