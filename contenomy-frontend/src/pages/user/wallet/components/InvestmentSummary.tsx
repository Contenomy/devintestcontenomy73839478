import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Select, MenuItem,Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface InvestmentSummaryProps {
  totalValue: number;
  currency: string;
}

interface Card {
  id: string;
  cardType: string;
  alias: string;
  expirationDate: string;
}



export default function InvestmentSummary({ totalValue }: InvestmentSummaryProps) {
  const { t } = useTranslation();
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState('');
  const [newCard, setNewCard] = useState<{ cardNumber: string; cardExpirationDate: string; cardCvx: string;cardHolderName : string }>({
      cardNumber: '',
      cardExpirationDate: '',
      cardCvx: '',
      cardHolderName:''
    });
  const fetchSavedCards = async () => {
    try {
      const response = await fetch('https://localhost:7126/api/Account/UserSavedCards', {
        credentials: 'include',
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCards(data.lstCard || []);
      } else {
        toast.error('Failed to load saved cards');
      }
    } catch (error) {
      toast.error('Errore durante il caricamento delle carte: ' + error);
    }
  };

  useEffect(() => {
    if (openWithdrawDialog || openRechargeDialog) {
      fetchSavedCards();
    }
  }, [openWithdrawDialog, openRechargeDialog]);

  const handleRecharge = () => setOpenRechargeDialog(true);
  const handleWithdraw = () => setOpenWithdrawDialog(true);

  const handleClose = () => {
    setOpenRechargeDialog(false);
    setSelectedCard('');
    setAmount('');
    setError('');
  };
  const browserInfo = {
    IpAddress: '', // Client IP should ideally be set server-side or by using an external service.
    AcceptHeader: navigator.userAgent, // Assuming this as a simple example for AcceptHeader
    JavaEnabled: false, //navigator.javaEnabled(),
    Language: navigator.language,
    ColorDepth: window.screen.colorDepth || 24,
    ScreenHeight: window.screen.height,
    ScreenWidth: window.screen.width,
    TimeZoneOffset: new Date().getTimezoneOffset(),
    UserAgent: navigator.userAgent,
    JavascriptEnabled: true
  };
  
  const fetchIp = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
    } catch (error) {
        console.error("Error fetching the IP address: ", error);
    }
  };
  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue <= 0) {
      setError(t('walletpage.errorInvalidAmount'));
    } else {
      setError('');
    }
    setAmount(value);
  };

  const validateInputs = () => {
    const { cardNumber, cardExpirationDate, cardCvx, cardHolderName } = newCard;

    // Basic validation for card number, expiration date, CVV, and cardholder name
    const cardNumberValid = true; // Example placeholder for actual card number regex validation
    const expirationDateValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpirationDate);

    // Type `cardNumber` explicitly as a `string` in the arrow function
    const isAmex = (cardNumber: string): boolean => /^3[47]/.test(cardNumber);

    // Ensure both `cardNumber` and `cardCvx` are properly typed
    const cvvValid = (cardNumber: string, cardCvx: string): boolean => {
        if (isAmex(cardNumber)) {
            return /^\d{4}$/.test(cardCvx); // American Express: 4 digits
        } else {
            return /^\d{3}$/.test(cardCvx); // Other cards: 3 digits
        }
    };

    const cardHolderNameValid = cardHolderName.trim().length > 0;

    // Return validation results
    return cardNumberValid && expirationDateValid && cvvValid(cardNumber, cardCvx) && cardHolderNameValid;
};

  const processPayment = async (cardId: string) => {
    setLoading(true);
    if (selectedCard === 'add-new')
    {
      try {
        const response = await fetch('https://localhost:7126/api/Account/UserCreateCards', {
          credentials: 'include',
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCard),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add card');
        }
        
        const registrationResult = await response.json();
        if (registrationResult.status == 'ERROR') {
          throw new Error('Failed to add card');
        }
        if (registrationResult.resultMessage == "Success") {
          console.log('Card Registered Successfully:', registrationResult);
          cardId = registrationResult.cardId;
        } 
      }
      catch (error) {
        toast.error('Errore durante il processo di pagamento: ' + error);
      } 
    }

    
  

    const paymentData = {
      cardId: cardId,
      registrationData: "",
      paymentAmount: parseFloat(amount),
      feeAmount: 0,
      currency: 'EUR',
      CreditUserId: "",
      BrowserInfo: browserInfo,
      IpAddress: ip,
    };

    try {
      const paymentResponse = await fetch('https://localhost:7126/api/Account/RicaricaWallet', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const paymentResult = await paymentResponse.json();

      if (paymentResponse.ok) {
        if (paymentResult.status === "FAILED") {
          toast.error(paymentResult.resultMessage);
        } else if (paymentResult.secureModeRedirectURL) {
          sessionStorage.setItem('orderData_' + paymentResult.id, JSON.stringify(paymentResult));
          const returnUrl = `${window.location.origin}/PaymentConfirmation?preAuthorizationId=${paymentResult.id}`;
          const secureRedirectUrl = `${paymentResult.secureModeRedirectURL}&returnUrl=${encodeURIComponent(returnUrl)}`;
          window.location.href = secureRedirectUrl;
        } else if (paymentResult.status === "SUCCEEDED") {
          sessionStorage.setItem('orderData_' + paymentResult.id, JSON.stringify(paymentResult));
          const successUrl = `${window.location.origin}/payment-order/PaymentConfirmation?preAuthorizationId=${paymentResult.id}&status=${paymentResult.status}`;
          window.location.href = successUrl;
        }
      } else {
        toast.error('Errore nella creazione del pagamento, riprovare o contattare il supporto');
      }
    } catch (error) {
      toast.error('Errore durante il processo di pagamento: ' + error);
    } finally {
      setLoading(false);
    }
  };

const handleAddCard = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://localhost:7126/api/Account/UserCreateCards', {
        credentials: 'include',
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCard),
      });

      if (!response.ok) {
        throw new Error('Failed to add card');
      }
      
      const registrationResult = await response.json();
      if (registrationResult.status == 'ERROR') {
        throw new Error('Failed to add card');
      }
      if (registrationResult.resultMessage == "Success") {
        console.log('Card Registered Successfully:', registrationResult);

        

        const paymentData = {
          cardId: registrationResult.cardId,
          registrationData: "",
          paymentAmount: parseFloat(amount),
          feeAmount: 0,
          currency: 'EUR',
          CreditUserId: "",
          BrowserInfo: browserInfo,
          IpAddress: ip,
        };

        const paymentResponse = await fetch('https://localhost:7126/api/Account/RicaricaWallet', {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });

        const paymentResult = await paymentResponse.json();

        if (paymentResponse.ok) {
          if (paymentResult.status === "FAILED") {
            toast.error(paymentResult.resultMessage);
          } else if (paymentResult.secureModeRedirectURL) {
            const returnUrl = `${window.location.origin}/PaymentConfirmation?payInId=${paymentResult.id}`;
            const secureRedirectUrl = `${paymentResult.secureModeRedirectURL}&returnUrl=${encodeURIComponent(returnUrl)}`;
            window.location.href = secureRedirectUrl;
          }
          else if (paymentResult.status === "SUCCEEDED") 
            {
              const secureRedirectUrl = `${window.location.origin}/payment/PaymentConfirmation?status=${paymentResult.status}`;
              window.location.href = secureRedirectUrl;
            }
        } else {
          toast.error('Pagamento non andato a buon fine, riprovare o contattare il supporto');
        }
      } else {
        toast.error('Errore nella registrazione della carta, riprovare o contattare il supporto');
        //alert('Errore nella registrazione della carta');
      }
    } catch (error) {
      toast.error('Errore durante la registrazione della carta, riprovare o contattare il supporto');
      //alert('Errore durante l\'aggiunta della carta');
    }
  };



  const handleConfirmRecharge = () => {
    if (selectedCard === 'add-new')
    {  
      if (validateInputs()) {
        processPayment(selectedCard);
      } else {
        alert("Per favore, inserisci tutti i dati correttamente.");
      }
    }
    else
    {
      if (!selectedCard || !amount || parseFloat(amount) <= 0) {
        setError(t('walletpage.errorInvalidAmount'));
        return;
      }
      processPayment(selectedCard);
    }
  };

  fetchIp();

  return (
    <Paper elevation={3} className="investment-summary">
      <Typography variant="h6" gutterBottom>{t('walletpage.investmentSummary')}</Typography>
      <Box display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center">
        <Box className="summary-item">
          <Typography variant="subtitle2">{t('walletpage.totalInvested')}</Typography>
          <Typography variant="h6">{t('number:currency', { value: totalValue })}</Typography>
        </Box>
        <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handleWithdraw}>
          {t('walletpage.withdraw')}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleRecharge}>
            {t('walletpage.recharge')}
          </Button>
        </Box>
      </Box>

      {/* Dialog per Prelievo */}
      <Dialog open={openWithdrawDialog} onClose={handleClose}>
        <DialogTitle>{t('walletpage.withdraw')}</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedCard}
            onChange={(e) => setSelectedCard(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>{t('walletpage.selectCard')}</MenuItem>
            {cards.map((card) => (
              <MenuItem key={card.id} value={card.id}>
                {`${card.cardType} ••••${card.alias} (${card.expirationDate})`}
              </MenuItem>
            ))}
          </Select>
          <TextField
            fullWidth
            margin="dense"
            label={t('walletpage.amount')}
            type="text"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            error={!!error}
            helperText={error}
            inputProps={{ inputMode: 'decimal', pattern: '^\\d*(\\.\\d{0,2})?$' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          
          <Button onClick={() => handleConfirm('Prelievo')} color="primary" disabled={!!error}>{t('common.confirm')}</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog per Ricarica */}

     

<Dialog open={openRechargeDialog} onClose={handleClose}>
<DialogTitle>{t('walletpage.recharge')}</DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          value={selectedCard}
          onChange={(e) => setSelectedCard(e.target.value)}
          displayEmpty
        >
          <MenuItem value="" disabled>{t('walletpage.selectCard')}</MenuItem>
          {cards.map((card) => (
            <MenuItem key={card.id} value={card.id}>
              {`${card.cardType} ••••${card.alias} (${card.expirationDate})`}
            </MenuItem>
          ))}
          <MenuItem value="add-new">{t('walletpage.addNewCard')}</MenuItem>
        </Select>
        {selectedCard === 'add-new' && (
          <Box mt={2}>
            <Typography variant="subtitle1">{t('walletpage.addNewCardTitle')}</Typography>
          
          <Grid container spacing={2}>
            {/* Numero carta */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('walletpage.cardNumber')}
                placeholder={t('walletpage.cardNumberPH')}
                variant="outlined"
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
              />
            </Grid>

            {/* Data di scadenza e CVV */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('walletpage.expirationDate')}
                placeholder={t('walletpage.expirationDatePH')}
                variant="outlined"
                onChange={(e) => setNewCard({ ...newCard, cardExpirationDate: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('walletpage.ccv')}
                placeholder={t('walletpage.ccvPH')}
                variant="outlined"
                onChange={(e) => setNewCard({ ...newCard, cardCvx: e.target.value })}
              />
            </Grid>

            {/* Nome del titolare */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('walletpage.titolare')}
                placeholder={t('walletpage.titolarePH')}
                variant="outlined"
                onChange={(e) => setNewCard({ ...newCard, cardHolderName: e.target.value })}
              />
            </Grid>
          </Grid>
           
          </Box>
        )}
        <br></br>
        <br></br>
        <Typography variant="subtitle1">{t('walletpage.labelimporto')}</Typography>
        <TextField
          fullWidth
          margin="dense"
          label={t('walletpage.amount')}
          type="text"
          value={amount}
          onChange={(e) => handleAmountChange(e.target.value)}
          error={!!error}
          helperText={error}
          inputProps={{ inputMode: 'decimal', pattern: '^\\d*(\\.\\d{0,2})?$' }}
        />
      </DialogContent>
      <DialogActions>
          <Button onClick={handleClose}>{t('common.cancel')}</Button>
          <Button onClick={handleConfirmRecharge} color="secondary" disabled={loading || !!error}>
            {loading ? t('common.loading') : t('common.confirm')}
          </Button>
        </DialogActions>
      </Dialog>

    </Paper>
  );
}

