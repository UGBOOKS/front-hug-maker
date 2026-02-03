import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { Book, BOOK_CONDITIONS } from '@/types/book';

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const conditionInfo = BOOK_CONDITIONS.find(c => c.value === book.condition);
  
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-success text-success-foreground';
      case 'like-new': return 'bg-info text-info-foreground';
      case 'good': return 'bg-accent text-accent-foreground';
      case 'fair': return 'bg-muted text-muted-foreground';
      case 'poor': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="card-classic group overflow-hidden">
      <Link to={`/book/${book.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={book.imageUrl}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <Badge className={getConditionColor(book.condition)}>
              {conditionInfo?.label}
            </Badge>
          </div>
          {book.isNegotiable && (
            <Badge 
              variant="outline" 
              className="absolute top-2 right-2 bg-background/90"
            >
              Negotiable
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-2 right-2 bg-background/90 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Add to wishlist
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/book/${book.id}`}>
          <h3 className="font-serif font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {book.title}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary">
              GHS {book.price.toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="ml-2 text-sm text-muted-foreground line-through">
                GHS {book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={book.sellerAvatar} alt={book.sellerName} />
              <AvatarFallback className="text-xs">{book.sellerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="line-clamp-1">{book.sellerName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span className="line-clamp-1">{book.location.split(',')[0]}</span>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <Button asChild variant="default" size="sm" className="flex-1">
            <Link to={`/book/${book.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
