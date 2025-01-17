import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Slider, 
  Paper, 
  Grid, 
  Button, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Check as CheckIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

export default function CreatorInfo() {
  const [followers, setFollowers] = useState<number>(100000);
  const [immediateEarnings, setImmediateEarnings] = useState<number>(0);
  const [estimatedEarnings, setEstimatedEarnings] = useState<number>(0);

  const calculateEarnings = (followers: number) => {
    const immediate = Math.round((followers * 0.009 * 2) * 100) / 100; //l'1% dei follower, arrotondato a 2 decimali * il valore minimo della supportshare
    const monthly = Math.round((followers * 0.0002) * 100) / 100; // La commissione è del 5% del valore degli asset scambiati minimo 20 centesimi, il 20% va al creator, in questa simulazione si assume che scambino l'1% dei follower, arrotondato a 2 decimali
    return { immediate, monthly };
  };

  const handleFollowersChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    setFollowers(value);
    const earnings = calculateEarnings(value);
    setImmediateEarnings(earnings.immediate);
    setEstimatedEarnings(earnings.monthly);
  };

  useEffect(() => {
    const initialEarnings = calculateEarnings(followers);
    setImmediateEarnings(initialEarnings.immediate);
    setEstimatedEarnings(initialEarnings.monthly);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Iscriviti su Contenomy, è gratuito!
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Simula i tuoi guadagni
            </Typography>
            <Typography variant="body1" gutterBottom>
              Numero di follower: {followers.toLocaleString()}
            </Typography>
            <Slider
              value={followers}
              onChange={handleFollowersChange}
              min={100000}
              max={5000000}
              step={10000}
              valueLabelDisplay="auto"
              aria-labelledby="followers-slider"
            />
            <Typography variant="h5" sx={{ mt: 2 }}>
              Potresti guadagnare subito {immediateEarnings.toLocaleString()}€ e fino a {estimatedEarnings.toLocaleString()}€ al mese
            </Typography>
            <Typography variant="caption">
              Stima basata su una tariffa media. I guadagni effettivi possono variare.
            </Typography>
          </Paper>
          
          <Button variant="contained" color="primary" size="large" fullWidth>
            Inizia come Creator
          </Button>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom>
            Perché scegliere Contenomy?
          </Typography>
          <List>
            {[
              'Gratuito',
              'Non siamo un`agenzia',
              'Monetizza la tua passione',
              'Connettiti direttamente con i tuoi fan',
              'Mantieni il controllo sui tuoi contenuti',
            ].map((text, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Come funziona Contenomy per i creator
      </Typography>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>1. Registrazione e Creazione del Profilo Creator</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Registrati gratuitamente su Contenomy e crea il tuo profilo da creator. Inserisci informazioni sui tuoi social.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>2. Emissione di SupportShare</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Le SupportShare sono unità digitali che rappresentano il supporto dei tuoi fan ed il valore dei tuoi social. Emetteremo 1000 SupportShare gratuitamente, i tuoi follower ti supportano acquistando SupportShare.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>3. Guadagni e Crescita</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Guadagna quando i tuoi fan acquistano le tue SupportShare. Più cresce il tuo valore come creator, più aumenta il valore delle tue SupportShare, generando potenziali guadagni per te e i tuoi sostenitori.
            Inoltre, guadagni anche quando le SupportShare che hai venduto vengono scambiate sul mercato.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>4. Interazione con i Fan</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Usa Contenomy per interagire direttamente con i tuoi fan più fedeli. Puoi offrire contenuti esclusivi, esperienze uniche o semplicemente mantenere un contatto più stretto con chi ti supporta.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>5. Analisi e Crescita</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Accedi a strumenti di analisi per monitorare la tua crescita, l'engagement dei tuoi fan e l'andamento delle tue SupportShare. Usa questi dati per ottimizzare la tua strategia e far crescere il tuo valore come creator.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}