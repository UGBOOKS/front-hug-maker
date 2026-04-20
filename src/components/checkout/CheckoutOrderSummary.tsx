import { BookOpen } from 'lucide-react';
import type { CartLine } from '@/context/CartContext';
import { DELIVERY_FEE, STORE_DETAILS } from '@/data/checkoutConstants';
import type { CheckoutDeliveryMethod } from '@/types/checkout';
import type { PaymentMethodId } from '@/types/checkout';
import { Card, CardContent } from '@/components/ui/card';

interface CheckoutOrderSummaryProps {
  lines: CartLine[];
  deliveryMethod: CheckoutDeliveryMethod | null;
  paymentMethod?: PaymentMethodId | null;
}

const CheckoutOrderSummary = ({
  lines,
  deliveryMethod,
  paymentMethod = null,
}: CheckoutOrderSummaryProps) => {
  const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const statusLabel = () => {
    if (paymentMethod === 'eft')
      return {
        text: 'Pending verification',
        sub: 'Confirmed once POP is checked',
        color: 'text-amber-600',
      };
    if (paymentMethod === 'cash')
      return {
        text: 'Held for collection',
        sub: 'Payment collected at the counter',
        color: 'text-blue-600',
      };
    if (paymentMethod === 'card')
      return {
        text: 'Instant confirmation',
        sub: 'Order moves to processing immediately',
        color: 'text-green-600',
      };
    return { text: '', sub: '', color: '' };
  };

  const st = paymentMethod ? statusLabel() : null;

  return (
    <div className="space-y-3">
      <Card className="rounded-xl border-border shadow-sm">
        <CardContent className="p-4">
          <h3 className="mb-4 text-sm font-medium text-foreground">Order summary</h3>

          {deliveryMethod && (
            <div
              className={`mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                deliveryMethod === 'delivery'
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                  : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
              }`}
            >
              {deliveryMethod === 'delivery' ? '🚚' : '📍'}
              {deliveryMethod === 'delivery' ? 'Company delivery' : 'Self-collection'}
            </div>
          )}

          <div className="mb-3 space-y-2">
            {lines.map((line) => (
              <div key={line.bookId} className="flex items-center gap-3">
                <div className="relative flex h-10 w-8 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                  {line.imageUrl ? (
                    <img src={line.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{line.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {line.condition}
                    {line.quantity > 1 ? ` · ×${line.quantity}` : ''}
                  </p>
                </div>
                <span className="shrink-0 text-xs font-medium text-foreground">
                  R{(line.price * line.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 border-t border-border pt-3">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Subtotal</span>
              <span>R{subtotal.toFixed(2)}</span>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Delivery fee</span>
                <span>R{DELIVERY_FEE.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-1 text-sm font-semibold text-foreground">
              <span>Total</span>
              <span>R{total.toFixed(2)}</span>
            </div>
          </div>

          {st && st.text && (
            <div className="mt-4 rounded-lg bg-muted/50 p-3">
              <p className="mb-0.5 text-xs text-muted-foreground">Status after payment</p>
              <p className={`text-xs font-medium ${st.color}`}>{st.text}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{st.sub}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border-border shadow-sm">
        <CardContent className="p-4">
          <p className="mb-1 text-xs font-medium text-foreground">Need help?</p>
          <p className="mb-2 text-xs text-muted-foreground">
            WhatsApp or call us with any questions about your order.
          </p>
          <p className="text-xs font-medium text-foreground">{STORE_DETAILS.phone}</p>
          <p className="text-xs text-muted-foreground">Mon–Fri 08:00–17:00</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutOrderSummary;
