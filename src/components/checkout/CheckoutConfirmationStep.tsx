import { CheckCircle, Truck, MapPin, Clock, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import { DELIVERY_FEE, STORE_DETAILS } from '@/data/checkoutConstants';
import type { CartLine } from '@/context/CartContext';
import type { DeliveryCheckoutData, PaymentCheckoutData } from '@/types/checkout';

const ORDER_ID = 'ORD-' + String(Math.floor(20480 + Math.random() * 900)).padStart(5, '0');

const TIMELINE_DELIVERY = [
  { label: 'Order confirmed', sub: 'Just now', done: true, active: false },
  { label: 'Packing & dispatch', sub: 'In progress · Est. next business day', done: false, active: true },
  { label: 'Out for delivery', sub: 'Est. 2–4 business days', done: false, active: false },
  { label: 'Delivered', sub: 'We will notify you', done: false, active: false },
];

const TIMELINE_EFT = [
  { label: 'Order placed & POP uploaded', sub: 'Just now', done: true, active: false },
  { label: 'Payment verification', sub: 'Our team reviews your POP', done: false, active: true },
  { label: 'Order confirmed', sub: "You'll be notified via WhatsApp", done: false, active: false },
  { label: 'Packed & dispatched', sub: 'Est. within 1 business day after confirm', done: false, active: false },
];

function Timeline({
  steps,
}: {
  steps: { label: string; sub: string; done: boolean; active: boolean }[];
}) {
  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={s.label} className="relative flex gap-3">
          {i < steps.length - 1 && (
            <div className="absolute bottom-0 left-[7px] top-5 z-0 w-px bg-border" />
          )}
          <div
            className={`relative z-10 mt-1 h-3.5 w-3.5 shrink-0 rounded-full ${
              s.done ? 'bg-green-500' : s.active ? 'bg-blue-500 ring-4 ring-blue-100 dark:ring-blue-950' : 'bg-muted'
            }`}
          />
          <div className="pb-5">
            <p
              className={`text-sm font-medium ${
                s.done || s.active ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              {s.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface CheckoutConfirmationStepProps {
  cartLines: CartLine[];
  deliveryData: DeliveryCheckoutData;
  paymentData: PaymentCheckoutData;
  onDone: () => void;
}

const CheckoutConfirmationStep = ({
  cartLines,
  deliveryData,
  paymentData,
  onDone,
}: CheckoutConfirmationStepProps) => {
  const isDelivery = deliveryData.method === 'delivery';
  const isEft = paymentData.method === 'eft';
  const isCash = paymentData.method === 'cash';
  const subtotal = cartLines.reduce((s, l) => s + l.price * l.quantity, 0);
  const fee = isDelivery ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  const paymentLabel =
    paymentData.method === 'card'
      ? 'Card · •••• ' + (paymentData.card?.number.replace(/\s/g, '').slice(-4) || '****')
      : paymentData.method === 'eft'
        ? 'EFT / Bank transfer'
        : 'Cash on collection';

  return (
    <div className="bg-muted/30 py-8">
      <div className="container-page max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">UG Books</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Second-hand books for students</p>
        </div>

        <CheckoutSteps current={3} />

        <div className="mb-6 py-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
            <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="mb-1 text-xl font-semibold text-foreground">Order placed successfully!</h2>
          <p className="text-sm text-muted-foreground">
            A confirmation will be sent to your email once payment is verified (if applicable).
          </p>
        </div>

        {isEft && (
          <div className="mb-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:bg-blue-950/40">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Awaiting proof of payment verification
              </p>
              <p className="mt-0.5 text-xs text-blue-700 dark:text-blue-300/90">
                Your order is held for 24 hours. Once we verify your EFT, we will confirm and notify you via
                WhatsApp.
              </p>
            </div>
          </div>
        )}

        {isCash && (
          <div className="mb-5 flex gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:bg-amber-950/30">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                Collect within {STORE_DETAILS.holdDays} business days
              </p>
              <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-300/90">
                Bring your order number <strong>#{ORDER_ID}</strong> and student ID. Payment is made in cash at the
                counter.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-medium text-foreground">Order details</h3>
                <div className="space-y-0">
                  {[
                    ['Order number', <span className="font-medium text-violet-600">#{ORDER_ID}</span>],
                    ['Date placed', new Date().toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })],
                    ['Payment method', paymentLabel],
                    [
                      'Payment status',
                      isEft ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Pending verification
                        </span>
                      ) : isCash ? (
                        <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                          Collect in store
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          Paid
                        </span>
                      ),
                    ],
                    ['Delivery method', isDelivery ? 'Company delivery' : 'Self-collection'],
                    ...(isDelivery && deliveryData.address
                      ? ([
                          [
                            'Deliver to',
                            `${deliveryData.address.street}, ${deliveryData.address.city}, ${deliveryData.address.postal}`,
                          ],
                          ['Contact phone', deliveryData.address.phone],
                        ] as [string, string][])
                      : ([['Collect from', STORE_DETAILS.address]] as [string, string][])),
                  ].map(([label, value], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between border-b border-border py-2 last:border-0"
                    >
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="max-w-[60%] text-right text-xs text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-3 text-sm font-medium text-foreground">Books ordered</h3>
                <div className="space-y-3">
                  {cartLines.map((line) => (
                    <div
                      key={line.bookId}
                      className="flex items-center gap-3 border-b border-border py-2 last:border-0"
                    >
                      <div className="relative flex h-11 w-9 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                        {line.imageUrl ? (
                          <img src={line.imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{line.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {line.condition}
                          {line.quantity > 1 ? ` · ×${line.quantity}` : ''}
                        </p>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        R{(line.price * line.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-5">
                <h3 className="mb-4 text-sm font-medium text-foreground">
                  {isEft ? 'What happens next?' : isDelivery ? 'Delivery progress' : 'Collection steps'}
                </h3>
                {isDelivery && !isEft && <Timeline steps={TIMELINE_DELIVERY} />}
                {isEft && <Timeline steps={TIMELINE_EFT} />}
                {isCash && (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    {[
                      { icon: <CheckCircle className="h-3.5 w-3.5 text-green-500" />, text: 'Order reserved in our system' },
                      { icon: <Clock className="h-3.5 w-3.5 text-amber-500" />, text: `Come in within ${STORE_DETAILS.holdDays} business days` },
                      { icon: <MapPin className="h-3.5 w-3.5 text-blue-500" />, text: `Visit us at ${STORE_DETAILS.address}` },
                      { icon: <Truck className="h-3.5 w-3.5 text-muted-foreground" />, text: 'Show order number + student ID at counter' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-start gap-2">
                        {s.icon}
                        <span className="text-xs">{s.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-4">
                <h3 className="mb-3 text-sm font-medium text-foreground">Payment summary</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>R{subtotal.toFixed(2)}</span>
                  </div>
                  {isDelivery && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Delivery fee</span>
                      <span>R{fee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold text-foreground">
                    <span>{isCash ? 'Pay at store' : 'Total'}</span>
                    <span>R{total.toFixed(2)}</span>
                  </div>
                </div>
                <Button className="mt-4 w-full" onClick={onDone}>
                  Back to home
                </Button>
                <Button className="mt-2 w-full" variant="outline" onClick={onDone}>
                  Clear cart &amp; finish
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-4">
                <p className="mb-1 text-xs font-medium text-foreground">Need help?</p>
                <p className="mb-2 text-xs text-muted-foreground">WhatsApp or call us with any questions about your order.</p>
                <p className="text-xs font-medium text-foreground">{STORE_DETAILS.phone}</p>
                <p className="text-xs text-muted-foreground">Mon–Fri 08:00–17:00</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirmationStep;
