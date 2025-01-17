import React, { useState, useEffect } from 'react';
import { Snackbar, Paper, Rating, Typography, Button, Box, Fade, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[4],
}));

interface RatingWidgetProps {
  onSubmit: (rating: number | null, feedback?: string) => void;
  triggerTime: number;
}

const RatingWidget: React.FC<RatingWidgetProps> = ({ onSubmit, triggerTime }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  



  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), triggerTime);
    return () => clearTimeout(timer);
  }, [triggerTime]);

  const handleClose = () => {
    setOpen(false);
    setShowFeedback(false);
    setValue(null);
    setFeedback('');
  };

  const handleRating = () => {
    
    const fetchRating = async () => {
      try {
        const response = await fetch('https://localhost:7126/Rating/InsertRating', {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Value: value, // Valutazione inviata
            Feedback: feedback, // Feedback opzionale
            UserId: '', 
          }),
        });
        if (response.ok) {
          console.log('Valutazione salvata:', value);
          setShowFeedback(true);
        } else {
          console.error('Errore nella risposta API:', response.status, response.statusText);
         
        }
      } catch (error) {
        console.error('Errore durante il caricamento dei content creator:', error);
        
      }
    };
    fetchRating();
  };

  const handleFeedbackSubmit = () => {
    onSubmit(value, feedback);
    handleClose();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      open={open}
      onClose={handleClose}
      key="rating"
    >
      <Fade in={open}>
        <StyledPaper>
          {!showFeedback ? (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Come valuti la tua esperienza con Contenomy?
              </Typography>
              <Rating
                name="simple-controlled"
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleRating} disabled={value === null}>
                  Invia
                </Button>
                <Button variant="text" onClick={handleClose} sx={{ ml: 1 }}>
                  Non ora
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="subtitle1" gutterBottom>
                Aiutaci a migliorare, aggiungi un commento!
              </Typography>
              <TextField
                multiline
                rows={3}
                variant="outlined"
                fullWidth
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Inserisci il tuo feedback qui (opzionale)"
                sx={{ mt: 2, mb: 2 }}
              />
              <Box>
                <Button variant="contained" color="primary" onClick={handleFeedbackSubmit}>
                  Invia feedback
                </Button>
                <Button variant="text" onClick={handleClose} sx={{ ml: 1 }}>
                  Chiudi
                </Button>
              </Box>
            </>
          )}
        </StyledPaper>
      </Fade>
    </Snackbar>
  );
};

export default RatingWidget;

// Questo componente visualizza un widget per la valutazione dell'esperienza utente.
// Permette agli utenti di dare una valutazione a stelle e poi fornire un feedback testuale opzionale.
// Il widget appare dopo un tempo specificato e si posiziona in basso a destra dello schermo.