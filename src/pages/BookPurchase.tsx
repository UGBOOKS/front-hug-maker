import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, BookOpen, Minus, Plus, ShoppingCart } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockBooks } from '@/data/mockBooks';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { BOOK_CONDITIONS } from '@/types/book';

const BookPurchase = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <Layout>
        <div className="container-page py-16 text-center">
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h1 className="mb-2 font-serif text-2xl font-bold">Book not found</h1>
          <Button asChild>
            <Link to="/">Browse books</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const conditionInfo = BOOK_CONDITIONS.find((c) => c.value === book.condition);

  const handleAddToCart = () => {
    addItem(book, quantity);
    toast({
      title: 'Added to cart',
      description:
        quantity > 1
          ? `${quantity} × ${book.title} is in your cart.`
          : `${book.title} has been added to your cart.`,
    });
  };

  const handleAddAndGoToCart = () => {
    addItem(book, quantity);
    navigate('/cart');
  };

  const lineTotal = book.price * quantity;

  return (
    <Layout>
      <div className="container-page py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to={`/book/${book.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to book details
          </Link>
        </Button>

        <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[3/4]">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3">
                <Badge variant="secondary">{conditionInfo?.label}</Badge>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">{book.category}</p>
            <h1 className="mt-1 font-serif text-2xl font-bold md:text-3xl">{book.title}</h1>
            <p className="text-muted-foreground">by {book.author}</p>

            <p className="mt-6 font-serif text-3xl font-bold text-primary">
              R {book.price.toFixed(2)}
              <span className="ml-2 text-base font-normal text-muted-foreground">each</span>
            </p>

            <Separator className="my-6" />

            <div className="space-y-2">
              <p className="text-sm font-medium">Quantity</p>
              <div className="flex max-w-xs items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-lg font-semibold tabular-nums">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 shrink-0"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-border bg-secondary/40 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">R {lineTotal.toFixed(2)}</span>
              </div>
              {isInCart(book.id) && (
                <p className="mt-2 text-xs text-muted-foreground">
                  This title is already in your cart — adding again will update the quantity.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handleAddAndGoToCart}>
                Add &amp; view cart
              </Button>
            </div>

            <Button variant="link" className="mt-4 h-auto p-0 text-muted-foreground" asChild>
              <Link to="/">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookPurchase;
