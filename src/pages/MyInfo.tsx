import { useState, useEffect, useRef } from 'react';
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
import { Camera, Mail, Phone, MapPin, Star, ShoppingBag, Tag, GraduationCap } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

// Profile schema matching your database
const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  university: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const MyInfo = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // Avatar upload states
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password change states
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const form = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      university: '',
      location: '',
      bio: '',
    },
  });

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('No user logged in');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      setUserProfile(profile);
      
      form.reset({
        full_name: profile.full_name || '',
        email: profile.email || user.email,
        phone: profile.phone || '',
        university: profile.university || '',
        location: profile.location || '',
        bio: profile.bio || '',
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      if (!user) throw new Error('No user logged in');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          university: data.university,
          location: data.location,
          bio: data.bio,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      if (data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email
        });
        
        if (emailError) throw emailError;
        
        await supabase
          .from('profiles')
          .update({ email: data.email })
          .eq('id', user.id);
      }

      await fetchUserProfile();
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been saved successfully.',
      });
      
      setIsEditing(false);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar upload handler
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 2MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ avatar: base64String })
          .eq('id', userProfile?.id);

        if (updateError) throw updateError;

        setUserProfile((prev: any) => ({ ...prev, avatar: base64String }));

        toast({
          title: 'Avatar Updated',
          description: 'Your profile picture has been updated.',
        });
      };
      
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload avatar',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Password change handler
  const handleChangePassword = async () => {
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully.',
      });
      
      setIsPasswordDialogOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update password',
        variant: 'destructive',
      });
    }
  };

  const stats = [
    {
      icon: ShoppingBag,
      label: 'Total Purchases',
      value: userProfile?.total_purchases || 0,
    },
    {
      icon: Tag,
      label: 'Total Sales',
      value: userProfile?.total_sales || 0,
    },
    {
      icon: Star,
      label: 'Rating',
      value: userProfile?.rating?.toFixed(1) || '0.0',
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="container-page py-8 max-w-3xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-page py-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">My Profile</h1>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              {/* Avatar Section with Upload */}
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage 
                    src={userProfile?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.full_name || 'User')}&background=random`} 
                    alt={userProfile?.full_name || 'User'} 
                  />
                  <AvatarFallback className="text-2xl">
                    {userProfile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                
                {/* Camera button */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-serif font-bold">{userProfile?.full_name || 'User'}</h2>
                <p className="text-muted-foreground">
                  Member since {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}
                </p>
                {userProfile?.university && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <GraduationCap className="inline h-3 w-3 mr-1" />
                    {userProfile.university}
                  </p>
                )}
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
                  name="full_name"
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
                          <Input {...field} disabled={!isEditing} className="pl-10" type="email" />
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
                          <Input {...field} disabled={!isEditing} className="pl-10" placeholder="+27 ..." />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input 
                            {...field} 
                            disabled={!isEditing} 
                            className="pl-10" 
                            placeholder="e.g., University of Cape Town, Stellenbosch University" 
                          />
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
                          <Input 
                            {...field} 
                            disabled={!isEditing} 
                            className="pl-10" 
                            placeholder="e.g., Cape Town, Johannesburg" 
                          />
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
                          placeholder="Tell others a bit about yourself - your major, interests, etc."
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
              <Button variant="outline" onClick={() => setIsPasswordDialogOpen(true)}>
                Change
              </Button>
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

      {/* Password Change Modal */}
      {isPasswordDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  placeholder="Confirm new password"
                />
              </div>
              
              {passwordError && (
                <p className="text-sm text-destructive">{passwordError}</p>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPasswordDialogOpen(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordError('');
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleChangePassword} className="flex-1">
                  Update Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MyInfo;