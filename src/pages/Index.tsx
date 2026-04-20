import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal, BookOpen, TrendingUp, ShoppingCart, PlusCircle } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
import SellBuyTextbooks from '@/components/books/SellBuyTextbooks';
import TrustStrip from '@/components/home/TrustStrip';
import { mockBooks } from '@/data/mockBooks';
import { BookFilter, BOOK_CATEGORIES } from '@/types/book';

const defaultFilters: BookFilter = {
  search: '',
  category: '',
  condition: '',
  priceMin: null,
  priceMax: null,
  sortBy: 'newest',
};

const partnerInstitutes = [
  { name: 'UNISA', logo: '/institutes/unisa.png' },
  { name: 'Van Schaik Bookstore', logo: '/institutes/van-schaik.png' },
  { name: 'Eduvos', logo: '/institutes/eduvos.png' },
  { name: 'Varsity College', logo: '/institutes/varsity-college.png' },
];

const Index = () => {
  const [filters, setFilters] = useState<BookFilter>(defaultFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [marketMode, setMarketMode] = useState<'buy' | 'sell'>('buy');

  const filteredBooks = useMemo(() => {
    let result = [...mockBooks];

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.description.toLowerCase().includes(search)
      );
    }

    if (filters.category) {
      result = result.filter((book) => book.category === filters.category);
    }

    if (filters.condition) {
      result = result.filter((book) => book.condition === filters.condition);
    }

    if (filters.priceMin !== null) {
      result = result.filter((book) => book.price >= filters.priceMin!);
    }

    if (filters.priceMax !== null) {
      result = result.filter((book) => book.price <= filters.priceMax!);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        // For now, just use a random sort for demo
        break;
    }

    return result;
  }, [filters]);

  const clearFilters = () => setFilters(defaultFilters);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="border-b border-border bg-background">
        <div className="container-page py-10 md:py-14">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
              Buy &amp; sell textbooks
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-foreground mb-4 leading-tight">
              South Africa&apos;s student marketplace for course books
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search by title or ISBN, compare conditions, and trade with students nationwide — all in one place.
            </p>
            
            {/* Category Quick Links */}
            <div className="flex flex-wrap justify-center gap-2">
              {BOOK_CATEGORIES.slice(0, 6).map((category) => (
                <Badge
                  key={category}
                  variant={filters.category === category ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      category: prev.category === category ? '' : category,
                    }))
                  }
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container-page py-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span><strong>{mockBooks.length}</strong> Books Available</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span><strong>24</strong> Sold Today</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sell / Buy Textbooks */}
      <SellBuyTextbooks
        onBuySearch={(query) => {
          setFilters((prev) => ({ ...prev, search: query }));
          document.getElementById('books-grid')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <TrustStrip />

      {/* Institutes We Cater To */}
      <section className="border-b border-border bg-muted/30">
        <div className="container-page py-10 md:py-12">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-3">
              Students from various institutes we cater to
            </h2>
            <p className="text-muted-foreground">
              Trusted by students across leading institutions and academic partners.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {partnerInstitutes.map((institute) => (
              <div
                key={institute.name}
                className="bg-background border border-border rounded-xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow flex items-center justify-center min-h-28 md:min-h-32"
              >
                <img
                  src={institute.logo}
                  alt={`${institute.name} logo`}
                  className="max-h-16 md:max-h-20 w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-page py-8">
        <div className="mb-6 p-3 rounded-lg border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-serif text-lg font-semibold">Marketplace Mode</h3>
            <p className="text-sm text-muted-foreground">
              Switch between buying books and selling your books.
            </p>
          </div>
          <div className="flex items-center rounded-md border border-border overflow-hidden">
            <Button
              type="button"
              variant={marketMode === 'buy' ? 'default' : 'ghost'}
              className="rounded-none"
              onClick={() => setMarketMode('buy')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Buy Option
            </Button>
            <Button
              type="button"
              variant={marketMode === 'sell' ? 'default' : 'ghost'}
              className="rounded-none"
              onClick={() => setMarketMode('sell')}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Sell Option
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <BookFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Books Grid */}
          <div className="flex-1">
            {/* Mobile Filter Button & Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <strong>{filteredBooks.length}</strong> books for{' '}
                <strong>{marketMode === 'buy' ? 'buying' : 'selling'}</strong>
              </p>
              
              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <BookFilters
                      filters={filters}
                      onFilterChange={(newFilters) => {
                        setFilters(newFilters);
                      }}
                      onClearFilters={() => {
                        clearFilters();
                        setIsMobileFilterOpen(false);
                      }}
                      isMobile
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div id="books-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <BookCard book={book} mode={marketMode} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">No books found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
