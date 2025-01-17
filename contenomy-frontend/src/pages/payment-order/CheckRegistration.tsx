import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CheckRegistration.css';
import {Box,Button,TextField,Typography,Select,FormControl,InputLabel,MenuItem,Checkbox,FormControlLabel, Link,SelectChangeEvent} from "@mui/material";



interface PaymentItemProps {
  description: string;
  amount: number;
  quantity: number;
  creatorId: string;
  order:Order;
}

interface Order {
  creatorAssetId: number;
  type: string;
  direction: string;
  price: number;
  quantity: number;
}

const CheckRegPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items }: { items: PaymentItemProps[] } = location.state || { items: [] };
  const [isRegistered, setIsRegistered] = useState<boolean | null>(null); // null = unknown
  const [showModal, setShowModal] = useState(false);

  // State for form register inputs
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    nascita :'',
    paese :'',
    nazione:'',
    acceptTerms:false

  });

  // Function to check registration
  const checkRegistration = async () => {
    try {
      const response = await fetch('https://localhost:7126/api/Account/checkRegistration', {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Errore server: ${response.status}`);
      }
  
      const data = await response.json(); // Leggi il corpo della risposta una sola volta
  
      setIsRegistered(data.isRegistered);
      if (!data.isRegistered) {
        setFormData({
          nome: data.nome || '',
          cognome: data.cognome || '',
          email: data.email || '',
          nascita: data.nascita || '',
          paese:data.paese || '',
          nazione:data.nazione || '',
          acceptTerms : data.acceptTerms|| false,
        });
        setShowModal(true);
      } else {
        navigate('/payment-order', { state: { items } });
      }
    } catch (error) {
      console.error('Errore durante la verifica della registrazione:', error);
      toast.error('Errore durante la verifica della registrazione. Si prega di riprovare.');
    }
  };

  // Call checkRegistration only once when the component mounts
  useEffect(() => {
    checkRegistration();
  }, []); // Empty dependency array ensures it runs only once

  // Handle input change for registration form
  const handleRegInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function handleRegSelChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleRegTermsChange(event: { target: { name: string; value: any } }) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "acceptTerms" ? value === "true" || value === true : value, // Handle boolean
    }));
  }

  const handleBackToHome = () => {
    navigate('/market');
  };
  // Handle form submission for completing registration
  const handleRegSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7126/api/Account/completeRegistration', {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Registrazione completata con successo!');
        navigate('/payment-order', { state: { items } });
      } else {
        toast.error('Errore durante la registrazione. Si prega di riprovare.');
      }
    } catch (error) {
      toast.error('Errore durante la registrazione. Si prega di riprovare.');
    }
  };

  return (
    <>
      <ToastContainer />
      {!isRegistered && showModal && (
        <div className="modal">
          <div className="modal-content">
          <Box>
              <Typography className="text-center" variant="h6" alignSelf="center">
                Completa la registrazione
              </Typography>
              <br />
              <form onSubmit={handleRegSubmit}>
                <Box >
                  <TextField
                    id="nome"
                    label="Nome"
                    name="nome"
                    placeholder="Nome..."
                    variant="outlined"
                    value={formData.nome}
                    onChange={handleRegInputChange}
                    required
                  />
                  <br />
                  <br />
                  <TextField
                    id="cognome"
                    label="Cognome"
                    name="cognome"
                    placeholder="Email"
                    variant="outlined"
                    value={formData.cognome}
                    onChange={handleRegInputChange}
                    required
                  />
                   <br />
                   <br />
                  <TextField 
                  name="nascita" 
                  variant="outlined"
                  placeholder="Data di nascita..."
                  label="Data di nascita" 
                  type="date" 
                  InputLabelProps={{ shrink: true }} 
                  value={formData.nascita || ''} 
                  onChange={handleRegInputChange} 
                  required
                  />
                   <br />
                   <br />
                  <FormControl fullWidth >
                    <InputLabel className='lblSelect'>Nazionalità</InputLabel>
                    <Select
                      id="nazione"
                      name="nazione"
                      value={formData.nazione || ''}
                      onChange={handleRegSelChange}
                      required
                    >
                      <MenuItem value="">Seleziona una nazione</MenuItem>
                      {[
                        "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
                        "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
                        "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
                        "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
                        "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
                        "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
                        "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
                        "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
                        "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
                        "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
                        "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
                        "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
                        "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
                        "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
                        "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
                        "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"
                      ].map((countryCode2) => (
                        <MenuItem key={countryCode2} value={countryCode2}>
                          {countryCode2}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <br />
                  <br />
                  <FormControl fullWidth >
                    <InputLabel className='lblSelect'>Paese residenza</InputLabel>
                      <Select
                        id="paese"
                        name="paese"
                        value={formData.paese || ''}
                        onChange={handleRegSelChange}
                        required
                      >
                        <MenuItem value="">Seleziona un paese</MenuItem>
                        {[
                          "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
                          "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS",
                          "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
                          "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE",
                          "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF",
                          "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU", "GW", "GY", "HK", "HM",
                          "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM",
                          "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC",
                          "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK",
                          "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA",
                          "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG",
                          "PH", "PK", "PL", "PM", "PN", "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW",
                          "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS",
                          "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO",
                          "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI",
                          "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"
                        ].map((countryCode) => (
                          <MenuItem key={countryCode} value={countryCode}>
                            {countryCode}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                  <br />
                  <br />
                  <FormControlLabel className='lblCheck'
                    control={
                      <Checkbox
                        checked={formData.acceptTerms || false}
                        onChange={(e) =>
                          handleRegTermsChange({
                            target: { name: "acceptTerms", value: e.target.checked },
                          })
                        }
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Effettuando l'iscrizione, confermo di accettare i{" "}
                        <Link href="#" underline="hover">
                          Termini e condizioni
                        </Link>{" "}
                        di Contenomy, di aver letto l{" "}
                        <Link href="#" underline="hover">
                          Informativa privacy
                        </Link>{" "}
                        e di avere almeno 18 anni.
                      </Typography>
                    }
                  />


                 {/*  <label>
                    <Checkbox 
                      
                      name="acceptTerms"
                      checked={formData.acceptTerms || false}
                      onChange={(e) =>
                        handleRegTermsChange({
                          target: { name: "acceptTerms", value: e.target.checked },
                        })
                      }
                      required
                    />
                    Accetta i termini di vendita
                  </label> */}
                  <br />
                  <br />
                  <Button type="submit" variant="contained" id="btnReg" >Salva</Button>
                  <Button type="button" id="btnAnn" onClick={handleBackToHome}>Annulla</Button>
                </Box>
              </form>
              
            </Box>
          </div>
        </div>
      )}
    </>
  );
};

export default CheckRegPage;
