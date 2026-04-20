import { Mail, Phone, MapPin, LifeBuoy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';

const buyerFaqs = [
  {
    question: 'How do I buy a book?',
    answer:
      'Search by title or ISBN, choose the condition, add to cart, and complete checkout.',
  },
  {
    question: 'How long does delivery take?',
    answer:
      'Delivery typically takes 3-5 working days in major areas. Regional areas may take a little longer.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We support EFT, debit card, and credit card payments.',
  },
];

const sellerFaqs = [
  {
    question: 'How do I list a book for sale?',
    answer:
      'Go to Sell, search the title or ISBN, choose the condition, and submit your listing details.',
  },
  {
    question: 'When will I receive payment?',
    answer:
      'Seller payments are processed to your bank account within 3-5 working days after collection.',
  },
  {
    question: 'What if I cannot find my book?',
    answer:
      "Use the 'Can't find your book?' flow and we will notify you once it is added.",
  },
];

const accountFaqs = [
  {
    question: 'Do I need an account to buy or sell?',
    answer: 'Yes. An account is required for transaction safety and order tracking.',
  },
  {
    question: 'Is it safe to use this platform?',
    answer: 'Yes. We use secure account and transaction handling for buyers and sellers.',
  },
  {
    question: 'How do I get help for an issue not listed?',
    answer:
      'Contact support with your order details and a short description of your issue for fast assistance.',
  },
];

const ContactUs = () => {
  return (
    <Layout>
      <section className="container-page py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <p className="text-sm uppercase tracking-wide text-primary font-medium mb-2">
              Help Centre
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">How can we help you?</h1>
            <p className="text-muted-foreground max-w-3xl">
              Find quick answers for buying, selling, delivery, account support, and refunds.
              If you still need help, contact our support team directly.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                  I am a Buyer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {buyerFaqs.map((faq) => (
                  <div key={faq.question} className="border-b border-border last:border-none pb-4 last:pb-0">
                    <h3 className="font-medium mb-1">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>support@ugbooks.com</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+27 11 123 4567</span>
                </div>
                <div className="flex items-start gap-3 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <span>44 Alsatian Rd, Glen Austin, Midrand</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Response time: usually within one working day.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>I am a Seller</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sellerFaqs.map((faq) => (
                  <div key={faq.question} className="border-b border-border last:border-none pb-4 last:pb-0">
                    <h3 className="font-medium mb-1">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account and Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {accountFaqs.map((faq) => (
                  <div key={faq.question} className="border-b border-border last:border-none pb-4 last:pb-0">
                    <h3 className="font-medium mb-1">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-secondary/40">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Need personalized support? Include your order number, full name, and issue details when you
                email us so we can resolve your request faster.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ContactUs;
