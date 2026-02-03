import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Camera, Mail, Phone, MapPin, Star, ShoppingBag, Tag } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { mockUser } from '@/data/mockBooks';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const MyInfo = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone || '',
      location: mockUser.location || '',
      bio: mockUser.bio || '',
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
    
    setIsSaving(false);
    setIsEditing(false);
  };

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Total Purchases',
      value: mockUser.totalPurchases,
    },
    {
      icon: Tag,
      label: 'Total Sales',
      value: mockUser.totalSales,
    },
    {
      icon: Star,
      label: 'Rating',
      value: mockUser.rating.toFixed(1),
    },
  ];

  return (
    <Layout>
      <div className="container-page py-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">My Profile</h1>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                  <AvatarFallback className="text-2xl">{mockUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-serif font-bold">{mockUser.name}</h2>
                <p className="text-muted-foreground">
                  Member since {mockUser.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Button
                variant={isEditing ? 'outline' : 'default'}
                onClick={() => {
                  if (isEditing) {
                    form.reset();
                  }
                  setIsEditing(!isEditing);
                }}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
              {stats.map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={!isEditing} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input {...field} disabled={!isEditing} className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input {...field} disabled={!isEditing} className="pl-10" placeholder="+233 ..." />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input {...field} disabled={!isEditing} className="pl-10" placeholder="City, Country" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          disabled={!isEditing}
                          placeholder="Tell others a bit about yourself..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isEditing && (
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1" disabled={isSaving}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your account password</p>
              </div>
              <Button variant="outline">Change</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">Notification Preferences</p>
                <p className="text-sm text-muted-foreground">Manage email and push notifications</p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-destructive">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
              </div>
              <Button variant="destructive" size="sm">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MyInfo;
