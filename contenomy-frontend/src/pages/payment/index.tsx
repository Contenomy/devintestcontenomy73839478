import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';
import './Payment.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




interface PaymentItemProps {
  description: string;
  amount: number;
  quantity: number;
  creatorId: string;
}

interface Card {
  id: string;
  cardType: string;
  alias: string;
  expirationDate: string;
  validity: string;
}
interface Wallet {
  id: string;
  description: string;
  tag: string;
  balance: Balance;
  expirationDate: string;
}

interface Balance {
  currency: string;
  amount: number;
}

const PaymentSummaryPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items }: { items: PaymentItemProps[] } = location.state || { items: [] };
  const [loading, setLoading] = useState(false);
  const [ip, setIp] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [showSelectCardModal, setShowSelectCardModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cards, setCards] = useState<Card[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [newCard, setNewCard] = useState<{ cardNumber: string; cardExpirationDate: string; cardCvx: string;cardHolderName : string }>({
    cardNumber: '',
    cardExpirationDate: '',
    cardCvx: '',
    cardHolderName:''
  });
  
 
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

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.amount * item.quantity, 0).toFixed(2);
  };

  const calculateFee = () => {
    const total = parseFloat(items.reduce((total, item) => total + item.amount * item.quantity, 0).toFixed(2)); // Convert total back to number
    let percentuale;

    // Define thresholds
    if (total <= 100) {
        percentuale = 0.05; // 5%
    } else if (total <= 500) {
        percentuale = 0.04; // 4%
    } else if (total <= 1000) {
        percentuale = 0.03; // 3%
    } else {
        percentuale = 0.02; // 2%
    }

    // Uncomment if you want to calculate the fee dynamically
    // const fee = total * percentuale;

    const fee = total * 0.05; // Replace with dynamic calculation if needed
    return Math.max(fee, 0.20).toFixed(2); // Set minimum fee to €0.20
};

  const calculateTotalone = () => {
    // Calcola il totale degli importi
    const total = items.reduce((total, item) => total + item.amount * item.quantity, 0);
    let percentuale;

    // Definisci gli scaglioni
    if (total <= 100) {
      percentuale = 0.05; // 5%
    } else if (total <= 500) {
      percentuale = 0.04; // 4%
    } else if (total <= 1000) {
      percentuale = 0.03; // 3%
    } else {
      percentuale = 0.02; // 2%
    }
    const fee = total * 0.05; //total * percentuale per ora commento perchè sempre 5%
    const commissioni = Math.max(fee, 0.20);

    // Ritorna il totale più la commissione, arrotondato a 2 decimali
    return (total + commissioni).toFixed(2);
  };

  const getCreatoreId = () => {
    return items.length > 0 ? items[0].creatorId : null;
  };

  useEffect(() => {
    fetchSavedCards();
  }, []);

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
        setCards(data.lstCard);
        setWallets(data.lstWallet);
      } else {
        toast.error('Failed to load saved cards');
      }
    } catch (error) {
      toast.error('Errore durante il caricamento delle carte:' +  error);
    }
  };

  const handlePaymentClick = () => {
    setShowSelectCardModal(true);
  };

  const handlePayment = () => {
    if (selectedCard) {
      processPayment(selectedCard);
    } 
    else if (selectedWallet) {
      processPaymentWallet(selectedWallet);
    } 
    else {
      console.log("Payment with new card details");
    }
  };
  const processPaymentWallet = async (cardId:string) => {
    setLoading(true);
    browserInfo.IpAddress = ip;
    const paymentData = {
      cardId: cardId, 
      registrationData: "", 
      paymentAmount: calculateTotal(), 
      feeAmount: calculateFee(),
      currency: 'EUR',
      CreditUserId: getCreatoreId(),
      BrowserInfo: browserInfo,
      IpAddress: ip
    };
  
    try {
      const paymentResponse = await fetch('https://localhost:7126/api/Account/CreatePaymentWallet', {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });
  
      const paymentResult = await paymentResponse.json();
      
      if (paymentResponse.ok) {
        const returnUrl = `${window.location.origin}/payment/TransferConfirmation?status=${paymentResult.status}`;
        window.location.href = returnUrl;  

        
      } else {
        const returnUrl = `${window.location.origin}/payment/TransferConfirmation?status=ERROR`;
        window.location.href = returnUrl;
      }
    } catch (error) {
      const returnUrl = `${window.location.origin}/payment/TransferConfirmation?status=ERROR`;
      window.location.href = returnUrl;
    }

  };

  const processPayment = async (cardId:string) => {
    setLoading(true);
    const paymentData = {
      cardId: cardId, 
      registrationData: "", 
      paymentAmount: calculateTotal(), 
      feeAmount: calculateFee(),
      currency: 'EUR',
      CreditUserId: getCreatoreId(),
      BrowserInfo: browserInfo,
      IpAddress: ip
    };
  
    try {
      const paymentResponse = await fetch('https://localhost:7126/api/Account/CreatePayment', {
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
        toast.error('Errore nella creazione del pagamento, riprovare o contattare il supporto');
        //alert('Errore nella creazione del pagamento');
      }
    } catch (error) {
      toast.error('Errore durante il processo di pagamento:' + error);
      //alert('Errore durante il processo di pagamento');
    }
  };

  



  const handleBackToHome = () => {
    navigate('/market');
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
          registrationData: registrationResult.registrationData, 
          paymentAmount: calculateTotal(), 
          feeAmount: calculateFee(),
          currency: 'EUR',
          CreditUserId:getCreatoreId(),
          BrowserInfo: browserInfo,
          IpAddress: ip
        };

        const paymentResponse = await fetch('https://localhost:7126/api/Account/CreatePayment', {
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

  

  fetchIp();
  

  return (
    <>
    <ToastContainer />
  
    <div className="payment-summary">
      <h3>Riepilogo dell'ordine</h3>
      <div className="order-summary">
        {items.map((item, index) => (
          <div key={index} className="order-item">
            <span>{item.quantity}</span>
            <span>{item.description}</span>
            <span>{item.amount.toFixed(2)} €</span>
          </div>
        ))}
        <div  className="order-item riga_totale pad_t_4">
            <span></span>
            <span className="tot_left" >Totale</span>
            <span>{calculateTotal()} €</span>
          </div>
        <div  className="order-item ">
            <span></span>
            <span className="tot_left">Commissioni</span>
            <span>{calculateFee()} €</span>
          </div>
        <div className="order-total riga_totale">
          <strong>Totale da pagare</strong>
          <strong>{calculateTotalone()} €</strong>
        </div>
      </div>

      <Button className='btnPaga' onClick={handlePaymentClick} variant="success">
        Paga ora
      </Button>
      <Button className='btnAnnulla' onClick={handleBackToHome}>
        Annulla
      </Button>
      <p className="secure-payment">Questo pagamento è crittografato e sicuro</p>

      <Modal show={showSelectCardModal} onHide={() => setShowSelectCardModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
              <h5>Seleziona un metodo di pagamento</h5>
              {cards.length > 0 ? (
                cards.map((card) => {
                  // Estrarre mese e anno dalla data di scadenza in formato MMYY
                  const month = card.expirationDate.slice(0, 2);
                  const year = card.expirationDate.slice(2);
                  const formattedDate = `${month}/${year}`;

                  return (
                    <div key={card.id} className={`saved-card-option ${card.id === selectedCard ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        id={card.id}
                        name="savedCard"
                        value={card.id}
                        onChange={(e) => {
                          setSelectedCard(e.target.value);
                          setSelectedWallet(null); // Clear selectedWallet when a card is selected
                        }}
                        className="radio-input"
                      />
                      <label className="label_card" htmlFor={card.id}>
                        <div className="card-info">
                          {/* <span className="card-type">{card.cardType}</span> */}
                          <span className="card-details">({card.alias} - {formattedDate})</span>
                        </div>
                        {/* Badge per lo stato della carta */}
                        <span className={`status-badge ${card.validity === 'VALID' ? 'valid' : 'invalid'}`}>
                          {card.validity === 'VALID' ? 'Valida' : 'Non valida'}
                        </span>
                      </label>
                    </div>
                  );
                })
              ) : (
                <p>Nessun metodo di pagamento abilitato.</p>
              )}

            
              <Button variant="link" onClick={() => {
                setShowSelectCardModal(false);
                setShowAddCardModal(true);
              }}>
                Aggiungi metodo di pagamento
              </Button>
              <br></br>
              <br></br>
              <br></br>
              <h5>Seleziona un portafoglio</h5>
              {wallets.length > 0 ? (
                
                wallets.map((wallet) => {
                  return (
                    <div key={wallet.id} className={`saved-card-option ${wallet.id === selectedWallet ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        id={wallet.id}
                        name="savedCard"
                        value={wallet.id}
                        onChange={(e) => {
                          setSelectedWallet(e.target.value);
                          setSelectedCard(null); 
                        }}
                        className="radio-input"
                      />
                      <label className="label_card" htmlFor={wallet.id}>
                        <div className="card-info">
                          <span className="card-details">{wallet.description} ({(wallet.balance.amount / 100).toFixed(2)} {wallet.balance.currency})</span>
                        </div>
                        
                      </label>
                    </div>
                  );
                })
              ) : (
                <p>Nessun portafoglio abilitato.</p>
              )}



        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSelectCardModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handlePayment} disabled={!selectedCard && !selectedWallet}>
            Procedi con il pagamento
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showAddCardModal} onHide={() => setShowAddCardModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Dati della carta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Nome del titolare della carta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome e cognome"
                value={newCard.cardHolderName}
                onChange={(e) => setNewCard({ ...newCard, cardHolderName: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Numero della carta</Form.Label>
              <Form.Control
                type="text"
                placeholder="1234 1234 1234 1234"
                value={newCard.cardNumber}
                onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Data di scadenza</Form.Label>
              <Form.Control
                type="text"
                placeholder="MM/AA"
                value={newCard.cardExpirationDate}
                onChange={(e) => setNewCard({ ...newCard, cardExpirationDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                placeholder="123"
                value={newCard.cardCvx}
                onChange={(e) => setNewCard({ ...newCard, cardCvx: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddCardModal(false)}>
            Annulla
          </Button>
          <Button variant="primary" 

            onClick={() => {
              if (validateInputs()) {
                handleAddCard(); // Pass the card data to the handler if valid
              } else {
                alert("Per favore, inserisci tutti i dati correttamente.");
              }
            }}
            >
            Utilizza questa carta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </>
  );
};

export default PaymentSummaryPage;
