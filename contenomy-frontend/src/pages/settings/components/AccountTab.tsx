import React, { useState, useEffect, useContext } from 'react';
import { authContext } from "@context/AuthContext";
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AccountTab() {
  const { profile } = useContext(authContext);

  // State for storing form data and errors
  const [personalData, setPersonalData] = useState({
    email: profile.email || '',
    phonenumber: profile.phone || '',
    nickname: profile.nickname || '',
    username: profile.name|| ''
  });
  const [errors, setErrors] = useState([]);

  const handleChange = (event) => {
    if (typeof event === 'string') {
      setPersonalData((prevData) => ({ ...prevData, phonenumber: event }));
    } else {
      const { name, value } = event.target;
      setPersonalData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setErrors([]);
    try {
      const response = await fetch('https://localhost:7126/api/Account/UpdateAccount', { 
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
      if (!response.ok) {
        const data = await response.json();
        const extractedErrors = Object.values(data).flat();
        setErrors(extractedErrors);
        toast.error("Errore nel salvataggio dei dati!"); // Error message
        return;
      }
      
    } catch (error) {
      toast.error("Errore nel salvataggio dei dati!"); // Error message
      
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Account</Typography>
      <TextField
        fullWidth
        margin="normal"
        name="email"
        label="Email"
        value={personalData.email}
        onChange={handleChange}
        
      />
      <Box mt={2}>
        <PhoneInput
          country={'it'}
          value={personalData.phonenumber}
          name="phone"
          onChange={handleChange}
          inputStyle={{ width: '100%' }}
        />
        {!personalData.phonenumber && (
          <Typography variant="caption">
            Inserisci il tuo numero di telefono cellulare. Ti invieremo un codice PIN via SMS per confermarlo.
          </Typography>
        )}
      </Box>
      <TextField
        fullWidth
        margin="normal"
        name="nickname"
        label="Nickname"
        value={personalData.nickname}
        onChange={handleChange}
      />
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
      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSave}>Salva Dati</Button>
      </Box>

      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </Box>
  );
}
