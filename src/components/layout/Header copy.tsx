import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  BookOpen,
  PlusCircle,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Heart,
} from 'lucide-react';
import { mockUser } from '@/data/mockBooks';
import { useCart } from '@/context/CartContext';

// Mock conversations data - add this or import from a file
const mockConversations = [
  { unreadCount: 0 },
  // Add your actual conversations data here
];

const primaryNav = [
  { path: '/', label: 'Home' },
  { path: '/how-it-works', label: 'How it Works' },
  { path: '/book-condition', label: 'Book Condition' },
  { path: '/tutors', label: 'Tutors' },
  { path: '/contact-us', label: 'Contact Us' },
] as const;

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  
  const unreadMessages = mockConversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
  
  // Fixed: Only one isActive function
  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background shadow-sm">
      <div className="container-page">
        <div className="flex h-14 md:h-16 items-center justify-between gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="font-serif text-xl font-bold text-primary">UG Books</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {primaryNav.map(({ path, label }) => (
              <Link key={path} to={path}>
                <span
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                  }`}
                >
                  {label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-md min-w-0 justify-end xl:justify-center xl:mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or ISBN…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 border-border bg-secondary/40 pl-10"
              />
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/create-listing">
                <PlusCircle className="mr-2 h-4 w-4" />
                Sell
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="relative">
              <Link to="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{mockUser.name}</p>
                  <p className="text-sm text-muted-foreground">{mockUser.email}</p>
                </div>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/my-listings" className="flex cursor-pointer items-center">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex cursor-pointer items-center">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-info" className="flex cursor-pointer items-center">
                    <User className="mr-2 h-4 w-4" />
                    My Info
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 border-border bg-secondary/40 pl-10"
            />
          </div>
        </div>

        {isMenuOpen && (
          <div className="border-t border-border pb-4 lg:hidden">
            <div className="flex flex-col gap-1 pt-3">
              {primaryNav.map(({ path, label }) => (
                <Link key={path} to={path} onClick={() => setIsMenuOpen(false)}>
                  <span
                    className={`block rounded-md px-3 py-2.5 text-sm font-medium ${
                      isActive(path) ? 'bg-secondary text-primary' : 'text-foreground'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              ))}
              <div className="my-2 border-t border-border" />
              <Button asChild className="w-full justify-start bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to="/create-listing" onClick={() => setIsMenuOpen(false)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Sell a book
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link
                  to="/cart"
                  className="flex w-full items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                  {itemCount > 0 && (
                    <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </Link>
              </Button>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/my-listings" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Listings
                </Button>
              </Link>
              <Link to="/my-info" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="mr-2 h-4 w-4" />
                  My Info
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-destructive"
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;