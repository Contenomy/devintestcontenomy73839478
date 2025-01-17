import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Select, MenuItem, FormControl, InputLabel,Button, Alert  } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PersonalDataTab() {
  // Stati per i campi del form
  const [personalData, setPersonalData] = useState({
    nome: '', cognome: '', sesso: '', datanascita: '', nazionalita: '',
    cittanascita: '', nazionenascita: '', codicefiscale: '',
    cittaresidenza: '', provinciaresidenza: '', capresidenza: '', indirizzoresidenza: ''
    
  });
  const [errors, setErrors] = useState([]);

  const datanascita = personalData?.datanascita;
  const formattedDate = datanascita ? new Date(datanascita).toISOString().split('T')[0] : '';

  useEffect(() => {
    // Effettua la chiamata API per caricare i dati iniziali
    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:7126/api/Account/GetPersonalData', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setPersonalData(data); // Setta i dati caricati
        } else {
          console.error("Errore nel caricamento dei dati");
        }
      } catch (error) {
        console.error("Errore di connessione:", error);
      }
    };

    fetchData();
  }, []);



  const handleChange = (event) => {
    const datanascita = personalData?.datanascita;
    const formattedDate = datanascita ? new Date(datanascita).toISOString().split('T')[0] : '';
    personalData.datanascita = formattedDate;
    setPersonalData({ ...personalData, [event.target.name]: event.target.value });

  };
  // Funzione per gestire il salvataggio dei dati
  const handleSave = async (event) => { // Make this function async
    event.preventDefault();
    setErrors([]);

    if (!personalData.nome || !personalData.cognome) {
      setErrors(["I campi Nome e Cognome sono obbligatori."]);
      toast.error("I campi Nome e Cognome sono obbligatori.");
      return;
    }

    try {
      const response = await fetch('https://localhost:7126/api/Account/UpdatePersonalData', { 
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalData),
      });

      if (response.ok) {
        toast.success("Dati salvati con successo!"); 
      }
      else if (!response.ok) {
        const data = await response.json();
        const extractedErrors = Object.values(data).flat();
        setErrors(extractedErrors);
        toast.error("Errore nel salvataggio dei dati!"); // Error message
        return;
      }
      
    } 
    catch (error) {
      toast.error("Errore nel salvataggio dei dati!");
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Dati anagrafici</Typography>
      <Box mb={4}>
        <Typography variant="subtitle1" gutterBottom>Anagrafica</Typography>
        <TextField fullWidth margin="normal" name="nome" label="Nome" value={personalData.nome || ''} onChange={handleChange}  required />
        <TextField fullWidth margin="normal" name="cognome" label="Cognome" value={personalData.cognome || ''} onChange={handleChange}  required />
        <FormControl fullWidth margin="normal">
          <InputLabel>Sesso</InputLabel>
          <Select name="sesso" value={personalData.sesso || ''} onChange={handleChange}>
            <MenuItem value="M">Maschio</MenuItem>
            <MenuItem value="F">Femmina</MenuItem>
            <MenuItem value="A">Altro</MenuItem>
          </Select>
        </FormControl>
        <TextField fullWidth margin="normal" name="datanascita" label="Data di nascita" type="date" InputLabelProps={{ shrink: true }} value={personalData.datanascita || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="nazionalita" label="Nazionalità" value={personalData.nazionalita || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="cittanascita" label="Città di nascita" value={personalData.cittanascita || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="nazionenascita" label="Nazione di nascita" value={personalData.nazionenascita || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="codicefiscale" label="Codice fiscale" value={personalData.codicefiscale || ''} onChange={handleChange} />
      </Box>
      <Box>
        <Typography variant="subtitle1" gutterBottom>Indirizzo di residenza</Typography>
        <TextField fullWidth margin="normal" name="cittaresidenza" label="Città" value={personalData.cittaresidenza || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="provinciaresidenza" label="Provincia" value={personalData.provinciaresidenza || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="capresidenza" label="CAP" value={personalData.capresidenza || ''} onChange={handleChange} />
        <TextField fullWidth margin="normal" name="indirizzoresidenza" label="Indirizzo" value={personalData.indirizzoresidenza || ''} onChange={handleChange} />
      </Box>
      <br/>
      <br/>
      {errors.length > 0 && (
        <Box mt={2}>
          {errors.map((error, index) => (
            <React.Fragment key={index}>
              <Alert severity="error">{error}</Alert>
              <br />
            </React.Fragment>
          ))}
        </Box>
      )}
      {/* Pulsante di salvataggio */}
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSave}>Salva Dati</Button>
      </Box>

      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </Box>
  );
}