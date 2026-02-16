import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { PlusCircle, MoreVertical, Edit, Trash2, Eye, BookOpen } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { myListings, mockBooks } from '@/data/mockBooks';
import { Book, BOOK_CONDITIONS } from '@/types/book';
import { useToast } from '@/hooks/use-toast';

const MyListings = () => {
  const { toast } = useToast();
  const [listings, setListings] = useState<Book[]>(myListings);
  
  // Simulate some sold books
  const activeListings = listings.filter((_, index) => index !== 1);
  const soldListings = mockBooks.slice(0, 2).map(book => ({
    ...book,
    sellerId: 'current-user',
    sellerName: 'Akosua Darko',
  }));

  const handleDelete = (bookId: string) => {
    setListings(listings.filter((book) => book.id !== bookId));
    toast({
      title: 'Listing Deleted',
      description: 'Your listing has been removed.',
    });
  };

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

  const ListingCard = ({ book, showActions = true }: { book: Book; showActions?: boolean }) => {
    const conditionInfo = BOOK_CONDITIONS.find(c => c.value === book.condition);
    
    return (
      <Card className="card-classic">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Link to={`/book/${book.id}`} className="flex-shrink-0">
              <div className="w-20 h-28 rounded overflow-hidden">
                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <Link to={`/book/${book.id}`}>
                    <h3 className="font-serif font-semibold truncate hover:text-primary transition-colors">
                      {book.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground truncate">{book.author}</p>
                </div>
                {showActions && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link to={`/book/${book.id}`} className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            className="text-destructive cursor-pointer"
                            onSelect={(e) => e.preventDefault()}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{book.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(book.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getConditionColor(book.condition)} variant="secondary">
                  {conditionInfo?.label}
                </Badge>
                <span className="text-sm text-muted-foreground">{book.category}</span>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <span className="font-bold text-primary">R {book.price.toFixed(2)}</span>
                <span className="text-xs text-muted-foreground">
                  Listed {book.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Layout>
      <div className="container-page py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your book listings</p>
          </div>
          <Button asChild>
            <Link to="/create-listing">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Listing
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              Active ({activeListings.length})
            </TabsTrigger>
            <TabsTrigger value="sold">
              Sold ({soldListings.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeListings.length > 0 ? (
              <div className="grid gap-4">
                {activeListings.map((book) => (
                  <ListingCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">No active listings</h3>
                <p className="text-muted-foreground mb-4">
                  Start selling by creating your first listing
                </p>
                <Button asChild>
                  <Link to="/create-listing">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Listing
                  </Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold">
            {soldListings.length > 0 ? (
              <div className="grid gap-4">
                {soldListings.map((book) => (
                  <div key={book.id} className="relative">
                    <ListingCard book={book} showActions={false} />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        Sold
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">No sold items yet</h3>
                <p className="text-muted-foreground">
                  Your sold books will appear here
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyListings;
