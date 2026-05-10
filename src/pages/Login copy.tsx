import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Mail, Lock, User, ArrowRight, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  
  // Password validation states
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false
  });

  // Validate password function
  const validatePassword = (pwd: string) => {
    setPasswordRequirements({
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (!isLogin) {
      validatePassword(newPassword);
    }
  };

  const checkPasswordStrength = () => {
    const requirements = Object.values(passwordRequirements);
    const metCount = requirements.filter(req => req === true).length;
    
    if (metCount === 5) return { text: 'Strong', color: 'text-green-600', bg: 'bg-green-50' };
    if (metCount >= 3) return { text: 'Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (metCount > 0) return { text: 'Weak', color: 'text-red-600', bg: 'bg-red-50' };
    return { text: 'Very Weak', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Password validation for signup
    if (!isLogin) {
      const allRequirementsMet = Object.values(passwordRequirements).every(req => req === true);
      
      if (!allRequirementsMet) {
        toast({
          title: 'Password Requirements Not Met',
          description: 'Please ensure your password meets all the requirements below.',
          variant: 'destructive',
        });
        return;
      }
    }
    
    setIsLoading(true);
    
    try {
      console.log('Submitting:', { isLogin, email, password });
      
      if (isLogin) {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate('/');

      } else {
        // SIGN UP
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });
        
        if (error) throw error;
        
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
        
        // Clear form after signup
        setEmail('');
        setPassword('');
        setName('');
        setPasswordRequirements({
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          specialChar: false
        });
        setIsLogin(true);
      }
      
    } catch (error: any) {
      console.error('Auth error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
  
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `http://localhost:8080/`,
        },
      });
      
      if (error) throw error;
      
    } catch (error: any) {
      console.error('Google login error:', error);
      toast({
        title: 'Google Sign-In Failed',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const strength = checkPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary/80 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <BookOpen className="h-10 w-10 text-primary" />
          <span className="text-2xl font-serif font-bold text-primary">UG Books</span>
        </Link>

        <Card className="card-classic">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-serif">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? 'Sign in to your account to continue'
                : 'Join the marketplace and start buying or selling books'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign-In */}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
              
              {/* Password Field with Eye Icon */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Password Requirements Display - Only show on Signup */}
              {!isLogin && (
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Password Requirements:</span>
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded ${strength.bg} ${strength.color}`}>
                      {strength.text}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-sm">
                      {passwordRequirements.length ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      {passwordRequirements.uppercase ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}>
                        At least one uppercase letter (A-Z)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      {passwordRequirements.lowercase ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}>
                        At least one lowercase letter (a-z)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      {passwordRequirements.number ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordRequirements.number ? 'text-green-600' : 'text-gray-500'}>
                        At least one number (0-9)
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      {passwordRequirements.specialChar ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                      <span className={passwordRequirements.specialChar ? 'text-green-600' : 'text-gray-500'}>
                        At least one special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {isLogin && (
                <div className="text-right">
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  if (!isLogin) {
                    setPasswordRequirements({
                      length: false,
                      uppercase: false,
                      lowercase: false,
                      number: false,
                      specialChar: false
                    });
                  }
                }}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-foreground">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;