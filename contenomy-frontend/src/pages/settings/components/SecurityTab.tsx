import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Switch, FormControlLabel, Select, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export default function SecurityTab() {
  const [openPasswordReset, setOpenPasswordReset] = useState(false);
  const [openDeleteAccount, setOpenDeleteAccount] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [deletionReason, setDeletionReason] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (event) => {
    setPasswordData({ ...passwordData, [event.target.name]: event.target.value });
  };

  const handlePasswordReset = () => {
    // Implementare la logica per il reset della password
    console.log('Password reset', passwordData);
    setOpenPasswordReset(false);
  };

  const handleDeleteAccount = () => {
    // Implementare la logica per l'eliminazione dell'account
    console.log('Account deletion reason:', deletionReason);
    setOpenDeleteAccount(false);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Sicurezza</Typography>

      <Button variant="outlined" onClick={() => setOpenPasswordReset(true)}>
        Resetta Password
      </Button>

      <Box mt={2}>
        <FormControlLabel
          control={
            <Switch
              checked={twoFactorEnabled}
              onChange={(e) => setTwoFactorEnabled(e.target.checked)}
              name="twoFactorAuth"
            />
          }
          label="Attiva verifica a due fattori"
        />
      </Box>

      <Box mt={2}>
        <Button variant="outlined" color="error" onClick={() => setOpenDeleteAccount(true)}>
          Elimina Account
        </Button>
      </Box>

      {/* Dialog per il reset della password */}
      <Dialog open={openPasswordReset} onClose={() => setOpenPasswordReset(false)}>
        <DialogTitle>Resetta Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            type="password"
            name="currentPassword"
            label="Password attuale"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            name="newPassword"
            label="Nuova password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <TextField
            fullWidth
            margin="normal"
            type="password"
            name="confirmPassword"
            label="Conferma nuova password"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordReset(false)}>Annulla</Button>
          <Button onClick={handlePasswordReset}>Invia</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per l'eliminazione dell'account */}
      <Dialog open={openDeleteAccount} onClose={() => setOpenDeleteAccount(false)}>
        <DialogTitle>Elimina Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Siamo spiacenti di vederti andare. Per favore, seleziona il motivo per cui vuoi eliminare il tuo account:
          </DialogContentText>
          <Select
            fullWidth
            value={deletionReason}
            onChange={(e) => setDeletionReason(e.target.value)}
          >
            <MenuItem value="notInterested">Non sono più interessato</MenuItem>
            <MenuItem value="notSecure">Non trovo l'applicazione sicura</MenuItem>
            <MenuItem value="tooComplicated">L'applicazione è troppo complicata</MenuItem>
            <MenuItem value="other">Altro</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAccount(false)}>Annulla</Button>
          <Button onClick={handleDeleteAccount} color="error">Elimina</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}