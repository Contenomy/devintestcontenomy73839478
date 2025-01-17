import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './TransferConfirmation.css';

const TransferConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  useEffect(() => {
    if (status === 'SUCCEEDED') {
      toast.success('Trasferimento completato con successo!');
    } else {
      toast.error("Trasferimento fallito. Ripetere l'operazione.");
    }
  }, [status]);

  const handleBackToHome = () => {
    navigate('/market');
  };

  return (
    <div className="payment-confirmation">
      <ToastContainer />
      {status === 'SUCCEEDED' ? (
        <>
          
          <div className="confirmation-body">
            <FaCheckCircle className="check-icon" />
            <h2>Trasferimento completato</h2>
          </div>
        </>
      ) : (
        <>
         
          <div className="error-body">
            <FaTimesCircle className="error-icon" />
            <h2>Trasferimento non riuscito</h2>
            <p>Si prega di riprovare o contattare il supporto.</p>
          </div>
        </>
      )}
      <Button variant="primary" onClick={handleBackToHome}>
        Torna al Mercato
      </Button>
    </div>
  );
};

export default TransferConfirmation;
