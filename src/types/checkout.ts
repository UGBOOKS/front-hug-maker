export type CheckoutDeliveryMethod = 'delivery' | 'collect';

export interface CheckoutAddress {
  name: string;
  street: string;
  city: string;
  province: string;
  postal: string;
  phone: string;
  note: string;
}

export interface DeliveryCheckoutData {
  method: CheckoutDeliveryMethod;
  address: CheckoutAddress | null;
  whatsapp: string | null;
}

export type PaymentMethodId = 'card' | 'eft' | 'cash';

export interface CardFields {
  name: string;
  number: string;
  expiry: string;
  cvv: string;
}

export interface PaymentCheckoutData {
  method: PaymentMethodId;
  card: CardFields | null;
  popFileName: string | null;
  studentNum: string;
}
