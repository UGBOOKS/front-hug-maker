import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const steps = [
  {
    title: 'Search or list',
    body: 'Find a textbook by title or ISBN, or create a listing in minutes.',
  },
  {
    title: 'Choose condition & price',
    body: 'Select the condition that matches your copy and set a fair student price.',
  },
  {
    title: 'Connect & complete',
    body: 'Message when needed, arrange payment and delivery, and confirm receipt.',
  },
];

const HowItWorks = () => {
  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-10 md:py-14">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">How it works</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            UG Books connects buyers and sellers directly. Here is the simple flow from search to sale.
          </p>
        </div>
      </section>
      <section className="container-page py-10">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Card key={step.title} className="border-border shadow-sm">
              <CardHeader>
                <p className="text-sm font-medium text-primary">Step {i + 1}</p>
                <CardTitle className="font-serif text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default HowItWorks;
