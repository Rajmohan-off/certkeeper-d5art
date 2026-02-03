import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Lock, Eye, EyeOff, Loader2, Award, CheckCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import RecaptchaComponent, { RecaptchaRef } from '@/components/Recaptcha';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<RecaptchaRef>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRecaptchaChange = (token: string) => {
    setRecaptchaToken(token);
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!recaptchaToken) {
      toast.error("Please complete the reCAPTCHA");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/reset-password', { 
        token, 
        password: password,
        recaptchaToken
      });
      
      if (response.data.success || response.data.message) {
        setSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid or expired reset token");
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
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <p className="text-muted-foreground text-sm">
              {success 
                ? "Your password has been updated. Redirecting to login..." 
                : "Create a new secure password for your account."}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium px-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 bg-secondary/30 border-border/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium px-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-11 bg-secondary/30 border-border/50"
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
                    Updating Password...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="py-8 text-center">
               <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4 text-emerald-500">
                  <CheckCircle className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold mb-2">Success!</h3>
               <p className="text-sm text-muted-foreground">
                 Your password has been reset successfully. You will be redirected to the login page momentarily.
               </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t border-border/50 bg-secondary/10 p-4">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
