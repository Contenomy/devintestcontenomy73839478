import { useSearchParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { environment } from '@environment/environment.development';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import './PaymentConfirmation.css';

const PaymentConfirmation = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [isFetching, setisFetching] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const payId = searchParams.get('preAuthorizationId');
  const orderDataString = sessionStorage.getItem('orderData_' + payId);
  const order = orderDataString ? { ...JSON.parse(orderDataString), payId: payId } : null;

  const fetchOrder = async () => {
    if (order == null) {
      toast.error('Failed to place order. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${environment.serverUrl}/api/OrderBook/PlaceOrder`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message);
      } else {
        toast.success('Ordine creato con successo!');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    if (status === 'SUCCEEDED' && !isFetching) {
      setisFetching(true); // Impedisce ulteriori richiami
      fetchOrder();
    } else if (status !== 'SUCCEEDED') {
      setLoading(false);
    }

    /* return () => {
      setisFetching(false); // Pulizia in caso di dismount del componente
    }; */
  }, [status]);




  const handleBackToHome = () => {
    navigate('/market');
  };

  if (loading) {
    return <p>{t('loading')}</p>;
  }

  return (
    <div className="payment-confirmation">
      <ToastContainer />
      {status === 'SUCCEEDED' ? (
        <>
          <div className="confirmation-body">
            <FaCheckCircle className="check-icon" />
            <h2>Ordine creato con successo</h2>
          </div>
        </>
      ) : (
        <>
          <div className="error-body">
            <FaTimesCircle className="error-icon" />
            <h2>Problemi nella creazione dell'ordine</h2>
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

export default PaymentConfirmation;
