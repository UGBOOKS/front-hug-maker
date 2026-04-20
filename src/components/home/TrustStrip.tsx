import { ShieldCheck, Truck, Users } from 'lucide-react';

const items = [
  {
    icon: ShieldCheck,
    title: 'Safe shopping',
    description: 'Trade with confidence on a student-focused marketplace.',
  },
  {
    icon: Users,
    title: 'Built for students',
    description: 'Thousands of listings from campuses across South Africa.',
  },
  {
    icon: Truck,
    title: 'Nationwide delivery',
    description: 'Arrange collection and delivery options that suit you.',
  },
];

const TrustStrip = () => {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-page py-8 md:py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex gap-4 rounded-xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" aria-hidden />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
