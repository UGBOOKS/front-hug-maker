import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Truck, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import { STORE_DETAILS } from '@/data/checkoutConstants';
import type { CartLine } from '@/context/CartContext';
import type { CheckoutAddress, CheckoutDeliveryMethod, DeliveryCheckoutData } from '@/types/checkout';

const provinces = [
  'Western Cape',
  'Gauteng',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Free State',
  'Northern Cape',
];

const emptyAddress: CheckoutAddress = {
  name: '',
  street: '',
  city: '',
  province: 'Western Cape',
  postal: '',
  phone: '',
  note: '',
};

interface CheckoutDeliveryStepProps {
  cartLines: CartLine[];
  onNext: (data: DeliveryCheckoutData) => void;
}

const CheckoutDeliveryStep = ({ cartLines, onNext }: CheckoutDeliveryStepProps) => {
  const [method, setMethod] = useState<CheckoutDeliveryMethod>('delivery');
  const [address, setAddress] = useState<CheckoutAddress>(emptyAddress);
  const [whatsapp, setWhatsapp] = useState('');

  const handleSubmit = () => {
    onNext({
      method,
      address: method === 'delivery' ? address : null,
      whatsapp: method === 'collect' ? whatsapp : null,
    });
  };

  const canSubmit =
    method === 'collect'
      ? whatsapp.trim().length >= 8
      : address.name.trim() &&
        address.street.trim() &&
        address.city.trim() &&
        address.postal.trim() &&
        address.phone.trim();

  return (
    <div className="bg-muted/30 py-8">
      <div className="container-page max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" className="mb-4 -ml-2" asChild>
            <Link to="/cart">← Back to cart</Link>
          </Button>
          <h1 className="text-xl font-semibold text-foreground">UG Books — Checkout</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Second-hand books for students</p>
        </div>

        <CheckoutSteps current={1} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Card className="rounded-xl border-border shadow-sm">
              <CardContent className="p-5">
                <h2 className="mb-4 text-sm font-medium text-foreground">Choose delivery method</h2>

                <button
                  type="button"
                  onClick={() => setMethod('delivery')}
                  className={`mb-3 flex w-full gap-3 rounded-xl border p-4 text-left transition-all ${
                    method === 'delivery'
                      ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:bg-violet-950/40'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      method === 'delivery' ? 'border-violet-500 bg-violet-500' : 'border-muted-foreground/40'
                    }`}
                  >
                    {method === 'delivery' && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">We deliver to you</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Delivered to your address within 1–3 business days
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                      + R50 delivery fee
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('collect')}
                  className={`flex w-full gap-3 rounded-xl border p-4 text-left transition-all ${
                    method === 'collect'
                      ? 'border-violet-500 bg-violet-50 ring-1 ring-violet-500 dark:bg-violet-950/40'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      method === 'collect' ? 'border-violet-500 bg-violet-500' : 'border-muted-foreground/40'
                    }`}
                  >
                    {method === 'collect' && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">Self-collection</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Pick up from our store — no delivery fee</p>
                    <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                      Free
                    </span>
                  </div>
                </button>
              </CardContent>
            </Card>

            {method === 'delivery' && (
              <Card className="rounded-xl border-border shadow-sm">
                <CardContent className="space-y-3 p-5">
                  <h2 className="text-sm font-medium text-foreground">Delivery address</h2>
                  <div>
                    <Label className="text-xs text-muted-foreground">Full name</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. Amara Osei"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Street address</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. 12 Main Street"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">City</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. Cape Town"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Province</Label>
                      <Select
                        value={address.province}
                        onValueChange={(v) => setAddress({ ...address, province: v })}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">Postal code</Label>
                      <Input
                        className="mt-1"
                        placeholder="e.g. 7700"
                        value={address.postal}
                        onChange={(e) => setAddress({ ...address, postal: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phone number</Label>
                      <Input
                        className="mt-1"
                        placeholder="+27 ..."
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Delivery note (optional)</Label>
                    <Input
                      className="mt-1"
                      placeholder="e.g. Leave at gate"
                      value={address.note}
                      onChange={(e) => setAddress({ ...address, note: e.target.value })}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {method === 'collect' && (
              <Card className="rounded-xl border-border shadow-sm">
                <CardContent className="space-y-4 p-5">
                  <h2 className="text-sm font-medium text-foreground">Collection details</h2>
                  <div className="space-y-2 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
                    <p className="text-sm font-medium text-foreground">UG Books Store</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{STORE_DETAILS.address}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5">🕐</span>
                      <div>
                        <p>Mon–Fri: {STORE_DETAILS.hours.weekday}</p>
                        <p>Saturday: {STORE_DETAILS.hours.saturday}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-amber-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        Collect within {STORE_DETAILS.holdDays} business days or order is cancelled
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">
                      WhatsApp number for collection notification
                    </Label>
                    <Input
                      className="mt-1"
                      placeholder="+27 ..."
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <Button
              className="w-full bg-primary py-6 text-sm hover:bg-primary/90"
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              Continue to payment →
            </Button>
          </div>

          <div>
            <CheckoutOrderSummary lines={cartLines} deliveryMethod={method} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDeliveryStep;
