import Layout from '@/components/layout/Layout';
import { BOOK_CONDITIONS } from '@/types/book';

const BookConditionGuidelines = () => {
  return (
    <Layout>
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-10 md:py-14">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
            Book condition guidelines
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Accurate condition descriptions help buyers know what to expect and reduce disputes after
            delivery.
          </p>
        </div>
      </section>
      <section className="container-page py-10">
        <ul className="mx-auto max-w-3xl space-y-6">
          {BOOK_CONDITIONS.map((c) => (
            <li
              key={c.value}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h2 className="font-serif text-xl font-semibold text-foreground">{c.label}</h2>
              <p className="mt-2 text-muted-foreground">{c.description}</p>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default BookConditionGuidelines;
