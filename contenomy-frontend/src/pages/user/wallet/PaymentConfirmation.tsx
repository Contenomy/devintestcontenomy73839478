import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'SUCCEEDED') {
      toast.success('Ricarcia completata con successo!');
    } else {
      toast.error("Ricarica fallita. Ripetere l'operazione.");
    }
  }, [status]);

  const handleBackToHome = () => {
    navigate('/wallet');
  };

  return (
    <div className="payment-confirmation">
      <ToastContainer />
      {status === 'SUCCEEDED' ? (
        <>
          
          <div className="confirmation-body">
            <FaCheckCircle className="check-icon" />
            <h2>Pagamento completato</h2>
          </div>
        </>
      ) : (
        <>
         
          <div className="error-body">
            <FaTimesCircle className="error-icon" />
            <h2>Pagamento non riuscito</h2>
            <p>Si prega di riprovare o contattare il supporto.</p>
          </div>
        </>
      )}
      <Button variant="primary" onClick={handleBackToHome}>
        Torna al wallet
      </Button>
    </div>
  );
};

export default PaymentConfirmation;
