import { Check } from 'lucide-react';

const STEPS = ['Cart', 'Delivery', 'Payment', 'Confirm'] as const;

interface CheckoutStepsProps {
  /** Active step index: 1 = Delivery, 2 = Payment, 3 = Confirmation (Cart = 0 is completed when checkout starts) */
  current: 1 | 2 | 3;
}

const CheckoutSteps = ({ current }: CheckoutStepsProps) => {
  return (
    <div className="mb-8 flex items-center">
      {STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                  done
                    ? 'border border-green-500 bg-green-500 text-white'
                    : active
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border bg-background text-muted-foreground'
                }`}
              >
                {done ? <Check className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  done ? 'text-green-600' : active ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mx-3 h-px flex-1 ${done ? 'bg-green-300' : 'bg-border'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CheckoutSteps;
