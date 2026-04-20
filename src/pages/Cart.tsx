import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, itemCount, subtotal, setQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <section className="container-page py-10">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-2 font-serif text-3xl font-bold">Cart</h1>
            <p className="mb-8 text-muted-foreground">
              Review the books you plan to buy and proceed to checkout when you are ready.
            </p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your cart is empty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Start browsing textbooks and add your favorites to the cart.
                </p>
                <Button asChild>
                  <Link to="/">Browse Books</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container-page py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold">Cart</h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => clearCart()}>
            Clear cart
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <Card className="overflow-hidden">
            <CardContent className="divide-y divide-border p-0">
              {items.map((line) => (
                <div key={line.bookId} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Link to={`/book/${line.bookId}`} className="shrink-0">
                    <img
                      src={line.imageUrl}
                      alt={line.title}
                      className="h-28 w-20 rounded-md border border-border object-cover sm:h-32 sm:w-24"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/book/${line.bookId}`}
                      className="font-serif font-semibold text-foreground hover:text-primary"
                    >
                      {line.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">{line.author}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Condition: {line.condition}</p>
                    <p className="mt-2 font-semibold text-primary">
                      R {line.price.toFixed(2)} <span className="text-xs font-normal">each</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setQuantity(line.bookId, line.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium tabular-nums">{line.quantity}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => setQuantity(line.bookId, line.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeItem(line.bookId)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-lg">Order summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">R {subtotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-serif text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R {subtotal.toFixed(2)}</span>
                </div>
                <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90" size="lg">
                  <Link to="/checkout">Proceed to checkout</Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Secure checkout: delivery or collection, then payment.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/">Continue shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
