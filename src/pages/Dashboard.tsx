import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  PlusCircle,
  MessageCircle,
  Tag,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Eye,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockBooks, mockOffers, mockConversations, myListings } from '@/data/mockBooks';

const Dashboard = () => {
  const pendingOffers = mockOffers.filter((o) => o.status === 'pending').length;
  const unreadMessages = mockConversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeListings = myListings.length;
  const totalViews = 156; // Mock data
  const totalSales = 12;
  const totalEarnings = 485.00;

  const stats = [
    {
      icon: BookOpen,
      label: 'Active Listings',
      value: activeListings,
      href: '/my-listings',
      color: 'text-primary',
    },
    {
      icon: Tag,
      label: 'Pending Offers',
      value: pendingOffers,
      href: '/offers',
      color: 'text-accent',
    },
    {
      icon: MessageCircle,
      label: 'Unread Messages',
      value: unreadMessages,
      href: '/messages',
      color: 'text-info',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: totalViews,
      href: '/my-listings',
      color: 'text-muted-foreground',
    },
  ];

  const earningStats = [
    {
      icon: ShoppingBag,
      label: 'Books Sold',
      value: totalSales,
    },
    {
      icon: DollarSign,
      label: 'Total Earnings',
      value: `R ${totalEarnings.toFixed(2)}`,
    },
    {
      icon: TrendingUp,
      label: 'This Month',
      value: 'R 85.00',
    },
  ];

  const recentListings = myListings.slice(0, 3);

  return (
    <Layout>
      <div className="container-page py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your account.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, href, color }) => (
            <Link key={label} to={href}>
              <Card className="card-classic hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-secondary ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{value}</p>
                      <p className="text-sm text-muted-foreground">{label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Earnings Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {earningStats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="text-center p-4 bg-secondary/50 rounded-lg">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-xl font-bold">{value}</p>
                    <p className="text-xs text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
              
              {/* Placeholder for chart */}
              <div className="h-48 bg-secondary/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Sales chart coming soon</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-start">
                <Link to="/create-listing">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Listing
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/my-listings">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View My Listings
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/messages">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Check Messages
                  {unreadMessages > 0 && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/offers">
                  <Tag className="h-4 w-4 mr-2" />
                  Review Offers
                  {pendingOffers > 0 && (
                    <span className="ml-auto bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">
                      {pendingOffers}
                    </span>
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Listings */}
        <Card className="mt-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Listings</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/my-listings">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentListings.map((book) => (
                <Link
                  key={book.id}
                  to={`/book/${book.id}`}
                  className="flex items-center gap-4 py-3 hover:bg-secondary/30 -mx-2 px-2 rounded transition-colors"
                >
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{book.title}</h4>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">R {book.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                      {book.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
