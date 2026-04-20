import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SellBuyTextbooksProps {
  onSellSearch?: (query: string) => void;
  onBuySearch?: (query: string) => void;
}

const SellBuyTextbooks = ({ onSellSearch, onBuySearch }: SellBuyTextbooksProps) => {
  const [sellQuery, setSellQuery] = useState('');
  const [buyQuery, setBuyQuery] = useState('');
  const navigate = useNavigate();

  const handleSellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSellSearch) {
      onSellSearch(sellQuery);
    } else {
      navigate(`/create-listing${sellQuery ? `?search=${encodeURIComponent(sellQuery)}` : ''}`);
    }
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBuySearch) {
      onBuySearch(buyQuery);
    } else {
      navigate(`/?search=${encodeURIComponent(buyQuery)}`);
    }
  };

  return (
    <section className="bg-secondary/40">
      <div className="container-page py-10 md:py-14">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md md:p-10">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0">
          {/* Sell Textbooks */}
          <div className="md:pr-8 md:border-r md:border-dashed md:border-border">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
              Sell Textbooks
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
              Get cash for textbooks you no longer require. Students from around the country will have access to view and buy your used textbooks. Get paid within 5 days of selling your book directly into your bank account. Our couriers will collect each book from your door at no additional cost to you.
            </p>
            <form onSubmit={handleSellSubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Enter book ISBN or title to search..."
                value={sellQuery}
                onChange={(e) => setSellQuery(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
              <Button type="submit" className="w-full uppercase font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                Find Book to Sell
              </Button>
            </form>
          </div>

          {/* Buy Textbooks */}
          <div className="md:pl-8">
            <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-foreground mb-4">
              Buy Textbooks
            </h2>
            <p className="text-muted-foreground text-sm md:text-base mb-6 leading-relaxed">
              Easily find used textbooks listed by students from around the country. Receive books within 5 days from payment delivered free to your door. Books listed first are sold first.
            </p>
            <form onSubmit={handleBuySubmit} className="space-y-3">
              <Input
                type="text"
                placeholder="Enter book ISBN or title to search..."
                value={buyQuery}
                onChange={(e) => setBuyQuery(e.target.value)}
                className="border-primary/30 focus-visible:ring-primary"
              />
              <Button type="submit" className="w-full uppercase font-semibold bg-accent text-accent-foreground hover:bg-accent/90">
                Find Book to Buy
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom banner */}
        <Link
          to="/create-listing"
          className="mt-8 block w-full rounded-lg py-4 bg-primary text-primary-foreground text-center font-semibold uppercase tracking-wide hover:bg-primary/90 transition-colors"
        >
          Sell Your Textbooks in 4 Easy Steps
        </Link>
        </div>
      </div>
    </section>
  );
};

export default SellBuyTextbooks;
