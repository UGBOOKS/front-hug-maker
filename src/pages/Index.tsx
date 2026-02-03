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
import { SlidersHorizontal, BookOpen, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BookCard from '@/components/books/BookCard';
import BookFilters from '@/components/books/BookFilters';
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

const Index = () => {
  const [filters, setFilters] = useState<BookFilter>(defaultFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

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
      <section className="bg-gradient-to-b from-secondary/80 to-background border-b border-border">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Discover Your Next Great Read
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Buy and sell books with fellow readers. Find textbooks, novels, and rare finds at great prices.
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
      <section className="border-b border-border bg-card">
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

      {/* Main Content */}
      <section className="container-page py-8">
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
                Showing <strong>{filteredBooks.length}</strong> books
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book, index) => (
                  <div
                    key={book.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <BookCard book={book} />
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
