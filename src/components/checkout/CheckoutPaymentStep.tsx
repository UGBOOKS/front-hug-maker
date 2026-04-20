import { useState } from 'react';
import { CreditCard, Banknote, Building2, Lock, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import { BANK_DETAILS, DELIVERY_FEE } from '@/data/checkoutConstants';
import type { CartLine } from '@/context/CartContext';
import type { DeliveryCheckoutData, PaymentCheckoutData, PaymentMethodId } from '@/types/checkout';

const METHODS: {
  id: PaymentMethodId;
  label: string;
  sub: string;
  Icon: typeof CreditCard;
  deliveryOnly?: boolean;
}[] = [
  {
    id: 'card',
    label: 'Debit / Credit card',
    sub: 'Instant confirmation · Visa, Mastercard',
    Icon: CreditCard,
  },
  {
    id: 'eft',
    label: 'EFT / Bank transfer',
    sub: 'Upload proof of payment · 1–2 day verification',
    Icon: Building2,
  },
  {
    id: 'cash',
    label: 'Cash on collection',
    sub: 'Pay when you arrive to collect',
    Icon: Banknote,
    deliveryOnly: true,
  },
];

const formatCard = (v: string) =>
  v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
const formatExpiry = (v: string) => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1 / $2').slice(0, 7);

interface CheckoutPaymentStepProps {
  cartLines: CartLine[];
  deliveryData: DeliveryCheckoutData;
  onBack: () => void;
  onNext: (data: PaymentCheckoutData) => void;
}

const CheckoutPaymentStep = ({
  cartLines,
  deliveryData,
  onBack,
  onNext,
}: CheckoutPaymentStepProps) => {
  const [method, setMethod] = useState<PaymentMethodId>('card');
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [popFile, setPopFile] = useState<File | null>(null);
  const [studentNum, setStudentNum] = useState('');

  const isDelivery = deliveryData.method === 'delivery';
  const subtotal = cartLines.reduce((s, l) => s + l.price * l.quantity, 0);
  const fee = isDelivery ? DELIVERY_FEE : 0;
  const total = subtotal + fee;

  const availableMethods = METHODS.filter((m) => !(m.id === 'cash' && isDelivery));

  const handleSubmit = () => {
    onNext({
      method,
      card: method === 'card' ? card : null,
      popFileName: popFile?.name ?? null,
      studentNum,
    });
  };

  const canSubmit =
    method === 'card'
      ? card.name.trim() && card.number.replace(/\s/g, '').length >= 13 && card.expiry.trim() && card.cvv.length >= 3
      : method === 'eft'
        ? true
        : studentNum.trim().length >= 4;

  return (
    <div className="bg-muted/30 py-8">
      <div className="container-page max-w-4xl">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground">UG Books — Checkout</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Second-hand books for students</p>
        </div>

        <CheckoutSteps current={2} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-sm font-medium text-foreground">Payment method</h2>
                <div className="space-y-2">
                  {availableMethods.map(({ id, label, sub, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setMethod(id)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                        method === id
                          ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:bg-violet-950/40'
                          : 'border-border hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          method === id ? 'border-violet-500 bg-violet-500' : 'border-muted-foreground/40'
                        }`}
                      >
                        {method === id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground">{sub}</p>
                      </div>
                      {id === 'card' && (
                        <div className="flex gap-1">
                          {['VISA', 'MC'].map((c) => (
                            <span
                              key={c}
                              className="rounded border border-border bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {method === 'card' && (
              <Card className="rounded-xl border-border shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <h2 className="text-sm font-medium text-foreground">Card details</h2>
                  <div>
                    <Label className="text-xs text-muted-foreground">Name on card</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. Amara Osei"
                      value={card.name}
                      onChange={(e) => setCard({ ...card, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Card number</Label>
                    <Input
                      className="mt-1"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      value={card.number}
                      onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Expiry</Label>
                      <Input
                        className="mt-1"
                        placeholder="MM / YY"
                        maxLength={7}
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">CVV</Label>
                      <Input
                        className="mt-1"
                        placeholder="•••"
                        maxLength={4}
                        type="password"
                        value={card.cvv}
                        onChange={(e) =>
                          setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-green-600">
                    <Lock className="h-3 w-3 shrink-0" />
                    <span>256-bit SSL encrypted · Card details are never stored</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {method === 'eft' && (
              <Card className="rounded-xl border-border shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <h2 className="text-sm font-medium text-foreground">Bank transfer details</h2>
                  <div className="space-y-2 rounded-xl bg-muted/50 p-4 text-xs">
                    {(
                      [
                        ['Bank', BANK_DETAILS.bank],
                        ['Account name', BANK_DETAILS.accountName],
                        ['Account number', BANK_DETAILS.accountNumber],
                        ['Branch code', BANK_DETAILS.branchCode],
                        ['Reference', '#ORD-20482'],
                      ] as const
                    ).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-2">
                        <span className="text-muted-foreground">{k}</span>
                        <span
                          className={`text-right font-medium text-foreground ${k === 'Reference' ? 'text-violet-600' : ''}`}
                        >
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload your proof of payment after transferring. Your order is held for 24 hours pending
                    verification.
                  </p>
                  <label className="block cursor-pointer rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors hover:bg-muted/50">
                    <Upload className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {popFile ? popFile.name : 'Click to upload proof of payment'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG or PDF · Max 5MB</p>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) => setPopFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </CardContent>
              </Card>
            )}

            {method === 'cash' && (
              <Card className="rounded-xl border-border shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <h2 className="text-sm font-medium text-foreground">Cash on collection</h2>
                  <div className="space-y-1 rounded-xl border border-amber-100 bg-amber-50 p-4 dark:bg-amber-950/30">
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">Pay when you collect</p>
                    <p className="text-xs text-amber-800 dark:text-amber-300/90">
                      Bring the exact amount in cash when you come to collect your books. Payment is made at the
                      counter before we hand over your order.
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      Student number (for ID at collection)
                    </Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. STU20241234"
                      value={studentNum}
                      onChange={(e) => setStudentNum(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="px-6" onClick={onBack}>
                ← Back
              </Button>
              <Button
                type="button"
                className="flex-1 bg-primary py-6 hover:bg-primary/90"
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                Place order — R{total.toFixed(2)}
              </Button>
            </div>

            <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3" /> Secure &amp; encrypted checkout
            </p>
          </div>

          <div>
            <CheckoutOrderSummary
              lines={cartLines}
              deliveryMethod={deliveryData.method}
              paymentMethod={method}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentStep;
