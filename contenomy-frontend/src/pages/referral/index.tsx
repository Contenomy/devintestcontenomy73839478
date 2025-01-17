import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Card, 
  CardContent, 
  Grid,
  IconButton,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Menu,
  MenuItem
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface ReferralReward {
  id: number;
  date: string;
  amount: number;
  type: 'Amico' | 'Content Creator';
  status: 'Completato' | 'In attesa';
}

const ReferralPage: React.FC = () => {
  const [referralLink, setReferralLink] = useState('https://contenomy.com/ref/ABC123');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([
    { id: 1, date: '2024-03-15', amount: 20, type: 'Amico', status: 'Completato' },
    { id: 2, date: '2024-03-20', amount: 50, type: 'Content Creator', status: 'In attesa' },
  ]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setSnackbarMessage('Link copiato negli appunti!');
    setSnackbarOpen(true);
  };

  const handleShareLink = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseShareMenu = () => {
    setAnchorEl(null);
  };

  const handleShareSocial = (platform: string) => {
    let shareUrl = '';
    const shareText = 'Unisciti a Contenomy e supporta i tuoi content creator preferiti!';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + referralLink)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }

    handleCloseShareMenu();
    setSnackbarMessage(`Condiviso su ${platform}`);
    setSnackbarOpen(true);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Programma Referral
      </Typography>
      
      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Invita Amici" />
        <Tab label="Invita Content Creator" />
      </Tabs>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Il tuo link di referral
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              fullWidth
              value={referralLink}
              InputProps={{
                readOnly: true,
              }}
            />
            <IconButton onClick={handleCopyLink}>
              <ContentCopyIcon />
            </IconButton>
            <IconButton onClick={handleShareLink}>
              <ShareIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseShareMenu}
      >
        <MenuItem onClick={() => handleShareSocial('facebook')}>
          <FacebookIcon sx={{ mr: 1 }} /> Facebook
        </MenuItem>
        <MenuItem onClick={() => handleShareSocial('linkedin')}>
          <LinkedInIcon sx={{ mr: 1 }} /> LinkedIn
        </MenuItem>
        <MenuItem onClick={() => handleShareSocial('whatsapp')}>
          <WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp
        </MenuItem>
      </Menu>

      <Typography variant="h5" gutterBottom>
        Come funziona
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fase 1</Typography>
              <Typography>
                {tabValue === 0 
                  ? "Condividi il tuo link di referral con gli amici" 
                  : "Condividi il tuo link con content creator"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fase 2</Typography>
              <Typography>
                {tabValue === 0 
                  ? "I tuoi amici si registrano e investono" 
                  : "Il content creator si quota sulla piattaforma"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Fase 3</Typography>
              <Typography>
                {tabValue === 0 
                  ? "Ricevi 20€ per ogni amico che investe almeno 50€" 
                  : "Ricevi 50€ per ogni content creator quotato"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" gutterBottom>
        Regole
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="body1">
            • Il link di referral è valido per 90 giorni dalla generazione.
            <br />
            • Per gli amici: il bonus viene assegnato quando l'amico invitato investe almeno 50€ entro 90 giorni dalla registrazione.
            <br />
            • Per i content creator: il bonus viene assegnato quando il creator completa la quotazione sulla piattaforma.
            <br />
            • I bonus sono utilizzabili per compensare le commissioni sulla piattaforma o per nuovi investimenti.
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h5" gutterBottom>
        I tuoi referral e ricompense
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell align="right">Importo (€)</TableCell>
              <TableCell>Stato</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {referralRewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>{reward.date}</TableCell>
                <TableCell>{reward.type}</TableCell>
                <TableCell align="right">{reward.amount}</TableCell>
                <TableCell>{reward.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ReferralPage;

// Questo componente rappresenta la pagina di referral di Contenomy.
// Mostra il link di referral dell'utente con opzioni per copiarlo e condividerlo sui social media.
// Include sezioni per le fasi del processo di referral, le regole del programma,
// e una tabella che mostra lo storico dei referral e delle ricompense.
// La pagina distingue tra l'invito di amici e l'invito di content creator
// attraverso l'uso di tabs. La funzionalità di condivisione sui social media
// è implementata utilizzando un menu a comparsa con opzioni per Facebook, LinkedIn e WhatsApp.