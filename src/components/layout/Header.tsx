import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  PlusCircle, 
  MessageCircle, 
  User, 
  LogOut, 
  Menu, 
  X,
  Tag,
  LayoutDashboard,
  Heart
} from 'lucide-react';
import { mockUser, mockConversations } from '@/data/mockBooks';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  const unreadMessages = mockConversations.reduce((acc, conv) => acc + conv.unreadCount, 0);
  
  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Browse', icon: BookOpen },
    { path: '/create-listing', label: 'Sell', icon: PlusCircle },
    { path: '/messages', label: 'Messages', icon: MessageCircle, badge: unreadMessages },
    { path: '/offers', label: 'Offers', icon: Tag },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-page">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl font-serif font-bold text-primary hidden sm:inline">
              UG Books
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search books, authors, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary/50"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon, badge }) => (
              <Link key={path} to={path}>
                <Button 
                  variant={isActive(path) ? 'secondary' : 'ghost'} 
                  size="sm"
                  className="relative"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                  {badge && badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-2">
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
                  <Link to="/dashboard" className="flex items-center cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-listings" className="flex items-center cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Listings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex items-center cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/my-info" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    My Info
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/50"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2 animate-fade-in">
            {navLinks.map(({ path, label, icon: Icon, badge }) => (
              <Link 
                key={path} 
                to={path}
                onClick={() => setIsMenuOpen(false)}
              >
                <Button 
                  variant={isActive(path) ? 'secondary' : 'ghost'} 
                  className="w-full justify-start relative"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                  {badge && badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto"
                    >
                      {badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
            <div className="border-t border-border pt-2 mt-2">
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/my-listings" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Listings
                </Button>
              </Link>
              <Link to="/my-info" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  My Info
                </Button>
              </Link>
              <Button variant="ghost" className="w-full justify-start text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
