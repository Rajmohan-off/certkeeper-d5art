import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, Share2, ArrowRight, Shield, User } from 'lucide-react';
import d5artLogo from '@/assets/d5art-logo.png';
import { ThemeToggle } from '@/components/ThemeToggle';
import dLogo from '@/assets/d-logo.png';

const Index = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-accent/15 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-10 container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={d5artLogo} alt="D Logo" className="h-10 w-auto" />
              <span className="text-muted-foreground text-lg">×</span>
              <img src={dLogo} alt="D5art Logo" className="h-10 w-auto" />
            </div>
            <div className="hidden sm:block border-l border-border/50 pl-4">
              <h1 className="font-bold text-lg">D5art</h1>
              <p className="text-xs text-muted-foreground">Certificate Vault</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-3">
                <Button variant="ghost" asChild className="hidden sm:flex items-center gap-2">
                  <Link to="/dashboard">
                    <User className="w-4 h-4" />
                    {user.name}
                  </Link>
                </Button>
                <Button className="gradient-primary hover:opacity-90 glow-hover" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="gradient-primary hover:opacity-90 glow-hover" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>
      
      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 text-sm text-muted-foreground mb-8">
            <Award className="w-4 h-4 text-primary" />
            Secure Certificate Storage & Verification
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Your Credentials,{' '}
            <span className="gradient-text">Verified & Secure</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Store, manage, and share your professional certificates with blockchain-level security. 
            Instant verification for employers and institutions.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="gradient-primary hover:opacity-90 glow-hover text-lg px-8" asChild>
              <Link to="/register">
                Create Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border hover:border-primary hover:bg-primary/10 text-lg px-8" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          <div className="group p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:glow transition-all">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure Storage</h3>
            <p className="text-sm text-muted-foreground">
              Your certificates are encrypted and stored with enterprise-grade security protocols.
            </p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:glow transition-all">
              <CheckCircle className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Instant Verification</h3>
            <p className="text-sm text-muted-foreground">
              Anyone can verify your credentials instantly with a unique verification link.
            </p>
          </div>
          
          <div className="group p-6 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm hover:border-primary/30 hover:bg-card/60 transition-all">
            <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mb-4 group-hover:glow transition-all">
              <Share2 className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Easy Sharing</h3>
            <p className="text-sm text-muted-foreground">
              Share your achievements with employers and institutions in just one click.
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 D5art. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
