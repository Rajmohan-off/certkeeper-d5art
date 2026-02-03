import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Mail, ArrowLeft, Loader2, Award } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import RecaptchaComponent, { RecaptchaRef } from '@/components/Recaptcha';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('seeker');
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaRef>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRecaptchaChange = (token: string) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/forgot-password', { 
        email, 
        role, 
        recaptchaToken 
      });
      
      if (response.data.success || response.data.message) {
        setSubmitted(true);
        toast.success(response.data.message || "Password reset link sent to your email!");
      } else {
        toast.error(response.data.message || "Failed to send reset link");
        recaptchaRef.current?.resetRecaptcha();
        setRecaptchaToken(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.response?.data?.error || "An error occurred. Please try again.");
      recaptchaRef.current?.resetRecaptcha();
      setRecaptchaToken(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <Link to="/" className="mx-auto flex items-center gap-2 group">
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
               <Award className="w-6 h-6" />
             </div>
             <span className="text-2xl font-bold gradient-text">D5art</span>
          </Link>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <p className="text-muted-foreground text-sm">
              {submitted 
                ? "If an account exists for this email, you will receive a reset link shortly." 
                : "Enter your email and we'll send you a link to reset your password."}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
           

              <div className="space-y-2">
                <label className="text-sm font-medium px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 bg-secondary/30 border-border/50 focus:border-primary/50"
                    required
                  />
                </div>
              </div>

              <RecaptchaComponent 
                ref={recaptchaRef}
                onTokenGenerated={handleRecaptchaChange}
                onTokenExpired={handleRecaptchaExpired}
              />

              <Button 
                type="submit" 
                className="w-full h-11 gradient-primary hover:opacity-90 glow-hover font-medium" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          ) : (
            <div className="py-6 text-center">
               <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <Mail className="w-8 h-8" />
               </div>
               <p className="text-sm text-muted-foreground mb-6">
                 We've sent an email to <span className="text-foreground font-medium">{email}</span> with instructions to reset your password.
               </p>
               <Button variant="outline" className="w-full h-11" onClick={() => setSubmitted(false)}>
                 Didn't receive it? Try again
               </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 bg-secondary/10 p-4">
          <Link to="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
