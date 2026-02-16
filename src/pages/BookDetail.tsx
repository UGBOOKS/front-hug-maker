import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Calendar,
  BookOpen,
  Star,
  ArrowLeft,
  Tag,
  CheckCircle,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import BookCard from '@/components/books/BookCard';
import { mockBooks } from '@/data/mockBooks';
import { BOOK_CONDITIONS } from '@/types/book';
import { useToast } from '@/hooks/use-toast';

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [offerAmount, setOfferAmount] = useState('');
  const [offerMessage, setOfferMessage] = useState('');
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  const book = mockBooks.find((b) => b.id === id);
  const relatedBooks = mockBooks
    .filter((b) => b.id !== id && b.category === book?.category)
    .slice(0, 4);

  if (!book) {
    return (
      <Layout>
        <div className="container-page py-16 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold mb-2">Book Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/">Browse Books</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const conditionInfo = BOOK_CONDITIONS.find((c) => c.value === book.condition);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-success text-success-foreground';
      case 'like-new':
        return 'bg-info text-info-foreground';
      case 'good':
        return 'bg-accent text-accent-foreground';
      case 'fair':
        return 'bg-muted text-muted-foreground';
      case 'poor':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleMakeOffer = () => {
    toast({
      title: 'Offer Sent!',
      description: `Your offer of R ${offerAmount} has been sent to ${book.sellerName}.`,
    });
    setIsOfferDialogOpen(false);
    setOfferAmount('');
    setOfferMessage('');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Link Copied!',
      description: 'Book link has been copied to your clipboard.',
    });
  };

  return (
    <Layout>
      <div className="container-page py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Book Image */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border bg-card">
              <img
                src={book.imageUrl}
                alt={book.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <Badge className={getConditionColor(book.condition)}>
                  {conditionInfo?.label}
                </Badge>
              </div>
              {book.isNegotiable && (
                <Badge
                  variant="outline"
                  className="absolute top-4 right-4 bg-background/90"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  Negotiable
                </Badge>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" className="flex-1" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">{book.category}</p>
              <h1 className="text-3xl font-serif font-bold mb-2">{book.title}</h1>
              <p className="text-lg text-muted-foreground">by {book.author}</p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                R {book.price.toFixed(2)}
              </span>
              {book.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    R {book.originalPrice.toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="text-success">
                    {Math.round(
                      ((book.originalPrice - book.price) / book.originalPrice) * 100
                    )}
                    % off
                  </Badge>
                </>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>Condition:</strong> {conditionInfo?.label}
                </span>
              </div>
              {book.edition && (
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Edition:</strong> {book.edition}
                  </span>
                </div>
              )}
              {book.yearPublished && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>Published:</strong> {book.yearPublished}
                  </span>
                </div>
              )}
              {book.isbn && (
                <div className="flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>ISBN:</strong> {book.isbn}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-serif font-semibold text-lg mb-2">Description</h2>
              <p className="text-muted-foreground">{book.description}</p>
              <p className="text-xs text-muted-foreground mt-2">
                {conditionInfo?.description}
              </p>
            </div>

            <Separator />

            {/* Seller Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Seller Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={book.sellerAvatar} alt={book.sellerName} />
                      <AvatarFallback>{book.sellerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{book.sellerName}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-accent text-accent" />
                        <span>4.8</span>
                        <span>•</span>
                        <span>12 sales</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{book.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1" size="lg">
                <MessageCircle className="h-5 w-5 mr-2" />
                Message Seller
              </Button>
              {book.isNegotiable && (
                <Dialog open={isOfferDialogOpen} onOpenChange={setIsOfferDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="lg" className="flex-1">
                      <Tag className="h-5 w-5 mr-2" />
                      Make Offer
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Make an Offer</DialogTitle>
                      <DialogDescription>
                        Submit your best offer for "{book.title}"
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Listed Price:</span>
                        <span className="font-semibold">
                          R {book.price.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Your Offer (R)</label>
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={offerAmount}
                          onChange={(e) => setOfferAmount(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Message (Optional)
                        </label>
                        <Textarea
                          placeholder="Add a message to the seller..."
                          value={offerMessage}
                          onChange={(e) => setOfferMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsOfferDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleMakeOffer}
                        disabled={!offerAmount || Number(offerAmount) <= 0}
                      >
                        Send Offer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Posted on{' '}
              {book.createdAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-6">
              More in {book.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBooks.map((relatedBook) => (
                <BookCard key={relatedBook.id} book={relatedBook} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default BookDetail;
