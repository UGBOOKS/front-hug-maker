/** Checkout / store constants (aligned with UG Books checkout prototype) */
export const DELIVERY_FEE = 50;

export const BANK_DETAILS = {
  bank: 'Capitec',
  accountName: 'KT Ramagoma',
  accountNumber: '1646089861',
  /** Capitec universal branch code for EFT */
  branchCode: '470010',
} as const;

export const STORE_DETAILS = {
  address: '123 Campus Drive, Student Quarter',
  hours: {
    weekday: '08:00 – 17:00',
    saturday: '09:00 – 13:00',
    sunday: 'Closed',
  },
  phone: '+27 67 058 2019',
  holdDays: 3,
} as const;
