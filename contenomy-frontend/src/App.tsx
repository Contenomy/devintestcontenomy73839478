import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import Header from "@components/Header";
import Footer from "@components/Footer";
import { AuthProvider, DEFAULT_PROFILE } from "@context/AuthContext";
import IUserProfile from "@model/UserProfile";
import AuthService from "./services/AuthService";
import RatingWidget from "@components/RatingWidget";

import { Login, Register, Profile } from "@pages/user";
import Home from "@pages/home";
import Market from "@pages/market";
import ShareDetail from "@pages/market/ShareDetail";
import { Wallet } from "@pages/user/wallet";
import OrderBook from '@pages/market/components/orderbook';
import Payment from "@pages/payment";
import PaymentConfirmation from "@pages/payment/PaymentConfirmation";
import TransferConfirmation from "@pages/payment/TransferConfirmation";
import CheckRegistration from "@pages/payment/CheckRegistration";
import WalletPaymentConfirmation from "@pages/user/wallet/PaymentConfirmation";
import WalletCheckRegistration from "@pages/user/wallet/CheckRegistration";

import PaymentOrder from "@pages/payment-order";
import PaymentOrderConfirmation from "@pages/payment-order/PaymentConfirmation";
import PaymentOrderTransferConfirmation from "@pages/payment-order/TransferConfirmation";
import PaymentOrderCheckRegistration from "@pages/payment-order/CheckRegistration";

import CreatorDashboard from '@pages/creator-dashboard';
import NewSupportShare from '@pages/new-supportshare';
import Referral from '@pages/referral';
import Settings from '@pages/settings';
import AdminDashboard from '@pages/admin-dashboard';

import ManageRewards from '@pages/manage-rewards';

import CreatorInfo from '@pages/creator-info';
import Shop from '@pages/shop';
import SellProductsServices from '@pages/shop/sell-products-services';

export default function App() {
  const [profile, setProfile] = useState<IUserProfile>(DEFAULT_PROFILE.profile);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    (async function () {
      const profile = await AuthService.instance.fetchProfile();
      setProfile(profile);
    })();

    // Mostra il rating widget dopo 5 minuti (300000 ms)
    const timer = setTimeout(() => setShowRating(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleRatingSubmit = async (rating: number | null, feedback?: string) => {
    if (rating !== null && feedback!= null ) {
      try {
        const response = await fetch('https://localhost:7126/Rating/InsertRating', {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Value: rating, // Valutazione inviata
            Feedback: feedback, // Feedback opzionale
            UserId: '', 
          }),
        });
        if (response.ok) {
          console.log('Valutazione salvata');
          setShowRating(false);
        } else {
          console.error('Errore nella risposta API:', response.status, response.statusText);
         
        }
      } catch (error) {
        console.error('Errore durante il caricamento dei content creator:', error);
        
      }
    }
    //setShowRating(false);
  };

  return (
    <BrowserRouter>
      <AuthProvider value={{ profile, setProfile }}>
        <Header />
        <main id="main-content" className="m-2">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/market" element={<Market />} />
            <Route path="/market/:id" element={<ShareDetail />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/market/:id/orderbook" element={<OrderBook />} />
            <Route path="/creator-dashboard" element={<CreatorDashboard />} />
            <Route path="/new-supportshare" element={<NewSupportShare />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manage-rewards" element={<ManageRewards />} />
            <Route path="/creator-info" element={<CreatorInfo />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/sell-products-services" element={<SellProductsServices />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment/PaymentConfirmation" element={<PaymentConfirmation />} />
            <Route path="/payment/TransferConfirmation" element={<TransferConfirmation />} />
            <Route path="/payment/CheckRegistration" element={<CheckRegistration />} />
            <Route path="/payment-order" element={<PaymentOrder />} />
            <Route path="/payment-order/PaymentConfirmation" element={<PaymentOrderConfirmation />} />
            <Route path="/payment-order/TransferConfirmation" element={<PaymentOrderTransferConfirmation />} />
            <Route path="/payment-order/CheckRegistration" element={<PaymentOrderCheckRegistration />} />
            <Route path="/wallet/PaymentConfirmation" element={<WalletPaymentConfirmation />} />
            <Route path="/wallet/CheckRegistration" element={<WalletCheckRegistration />} />
          </Routes>
        </main>
        <Footer />
        {showRating && (
          <RatingWidget
            onSubmit={handleRatingSubmit}
            triggerTime={0}
          />
        )}
      </AuthProvider>
    </BrowserRouter>
  );
}
