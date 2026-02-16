import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  CreditCard,
  Tag,
  ArrowRight,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockOffers } from '@/data/mockBooks';
import { Offer } from '@/types/book';
import { useToast } from '@/hooks/use-toast';

const Offers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>(mockOffers);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const receivedOffers = offers.filter((offer) => offer.sellerId === 'current-user');
  const sentOffers = offers.filter((offer) => offer.buyerId === 'current-user');

  const getStatusIcon = (status: Offer['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-accent" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getStatusBadge = (status: Offer['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Pending</Badge>;
      case 'accepted':
        return <Badge variant="secondary" className="bg-success/20 text-success">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-destructive/20 text-destructive">Rejected</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="bg-success/20 text-success">Completed</Badge>;
    }
  };

  const handleAcceptOffer = (offer: Offer) => {
    setOffers(offers.map((o) => 
      o.id === offer.id ? { ...o, status: 'accepted' as const } : o
    ));
    toast({
      title: 'Offer Accepted',
      description: `You've accepted the offer of R ${offer.amount.toFixed(2)}. The buyer will be notified.`,
    });
  };

  const handleRejectOffer = (offer: Offer) => {
    setOffers(offers.map((o) => 
      o.id === offer.id ? { ...o, status: 'rejected' as const } : o
    ));
    toast({
      title: 'Offer Rejected',
      description: 'The offer has been declined.',
    });
  };

  const handleProceedToCheckout = (offer: Offer) => {
    setSelectedOffer(offer);
    setIsCheckoutOpen(true);
  };

  const handleCompletePayment = () => {
    if (selectedOffer) {
      setOffers(offers.map((o) => 
        o.id === selectedOffer.id ? { ...o, status: 'completed' as const } : o
      ));
      toast({
        title: 'Payment Successful!',
        description: 'Your payment has been processed. The seller will be notified.',
      });
      setIsCheckoutOpen(false);
      setSelectedOffer(null);
    }
  };

  const OfferCard = ({ offer, type }: { offer: Offer; type: 'received' | 'sent' }) => (
    <Card className="card-classic">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link to={`/book/${offer.bookId}`} className="flex-shrink-0">
            <div className="w-16 h-20 rounded overflow-hidden">
              <img
                src={offer.bookImage}
                alt={offer.bookTitle}
                className="h-full w-full object-cover"
              />
            </div>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <Link to={`/book/${offer.bookId}`}>
                  <h3 className="font-serif font-semibold truncate hover:text-primary transition-colors">
                    {offer.bookTitle}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Avatar className="h-5 w-5">
                    <AvatarImage
                      src={type === 'received' ? offer.buyerAvatar : undefined}
                      alt={type === 'received' ? offer.buyerName : offer.sellerName}
                    />
                    <AvatarFallback className="text-xs">
                      {(type === 'received' ? offer.buyerName : offer.sellerName).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span>
                    {type === 'received' ? `From: ${offer.buyerName}` : `To: ${offer.sellerName}`}
                  </span>
                </div>
              </div>
              {getStatusBadge(offer.status)}
            </div>

            <div className="flex items-center gap-4 mb-2">
              <div>
                <span className="text-lg font-bold text-primary">
                  R {offer.amount.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground ml-2 line-through">
                  R {offer.originalPrice.toFixed(2)}
                </span>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round(((offer.originalPrice - offer.amount) / offer.originalPrice) * 100)}% off
              </Badge>
            </div>

            {offer.message && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                "{offer.message}"
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              {type === 'received' && offer.status === 'pending' && (
                <>
                  <Button size="sm" onClick={() => handleAcceptOffer(offer)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRejectOffer(offer)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button size="sm" variant="ghost">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
              {type === 'sent' && offer.status === 'accepted' && (
                <Button size="sm" onClick={() => handleProceedToCheckout(offer)}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Checkout
                </Button>
              )}
              {type === 'sent' && offer.status === 'pending' && (
                <Button size="sm" variant="ghost">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message Seller
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              {offer.createdAt.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="container-page py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Offers</h1>
          <p className="text-muted-foreground">Manage offers you've received and sent</p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList>
            <TabsTrigger value="received">
              Received ({receivedOffers.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentOffers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="received">
            {receivedOffers.length > 0 ? (
              <div className="grid gap-4">
                {receivedOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} type="received" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">No offers received</h3>
                <p className="text-muted-foreground">
                  When someone makes an offer on your listings, it will appear here
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sent">
            {sentOffers.length > 0 ? (
              <div className="grid gap-4">
                {sentOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} type="sent" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">No offers sent</h3>
                <p className="text-muted-foreground mb-4">
                  Make offers on books you're interested in
                </p>
                <Button asChild>
                  <Link to="/">Browse Books</Link>
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Checkout Dialog */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Complete Your Purchase</DialogTitle>
              <DialogDescription>
                Checkout with PayPal to complete your order
              </DialogDescription>
            </DialogHeader>
            
            {selectedOffer && (
              <div className="space-y-4 py-4">
                <div className="flex gap-4 p-4 bg-secondary/50 rounded-lg">
                  <img
                    src={selectedOffer.bookImage}
                    alt={selectedOffer.bookTitle}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-serif font-semibold">{selectedOffer.bookTitle}</h4>
                    <p className="text-sm text-muted-foreground">Sold by {selectedOffer.sellerName}</p>
                    <p className="font-bold text-primary mt-2">
                      R {selectedOffer.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>R {selectedOffer.amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span>R {(selectedOffer.amount * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total</span>
                    <span>R {(selectedOffer.amount * 1.05).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="flex-col gap-2 sm:flex-col">
              <Button className="w-full bg-[#0070ba] hover:bg-[#005ea6]" onClick={handleCompletePayment}>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay with PayPal
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setIsCheckoutOpen(false)}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Offers;
