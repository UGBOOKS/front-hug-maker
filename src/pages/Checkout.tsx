import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CheckoutDeliveryStep from '@/components/checkout/CheckoutDeliveryStep';
import CheckoutPaymentStep from '@/components/checkout/CheckoutPaymentStep';
import CheckoutConfirmationStep from '@/components/checkout/CheckoutConfirmationStep';
import { useCart } from '@/context/CartContext';
import type { DeliveryCheckoutData, PaymentCheckoutData } from '@/types/checkout';

type CheckoutPhase = 'delivery' | 'payment' | 'confirmation';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [phase, setPhase] = useState<CheckoutPhase>('delivery');
  const [deliveryData, setDeliveryData] = useState<DeliveryCheckoutData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentCheckoutData | null>(null);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleComplete = () => {
    clearCart();
    navigate('/');
  };

  return (
    <Layout>
      {phase === 'delivery' && (
        <CheckoutDeliveryStep
          cartLines={items}
          onNext={(data) => {
            setDeliveryData(data);
            setPhase('payment');
          }}
        />
      )}

      {phase === 'payment' && deliveryData && (
        <CheckoutPaymentStep
          cartLines={items}
          deliveryData={deliveryData}
          onBack={() => setPhase('delivery')}
          onNext={(data) => {
            setPaymentData(data);
            setPhase('confirmation');
          }}
        />
      )}

      {phase === 'confirmation' && deliveryData && paymentData && (
        <CheckoutConfirmationStep
          cartLines={items}
          deliveryData={deliveryData}
          paymentData={paymentData}
          onDone={handleComplete}
        />
      )}
    </Layout>
  );
};

export default Checkout;
