import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, CheckCircle, Share2, Download, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Loader from '@/components/Loader';
import d5artLogo from '@/assets/d5art-logo.png';
import { ThemeToggle } from '@/components/ThemeToggle';
import dLogo from '@/assets/d-logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://d5art.com/api/v1';

export default function PublicCertificate() {
  const { key } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(`${API_URL}/divershefy/public-certificate/${key}`);
        if (response.data.success) {
          setCertificate(response.data.certificate);
        } else {
          toast.error("Certificate not found");
        }
      } catch (error) {
        console.error("Error fetching certificate:", error);
        toast.error("Failed to load certificate");
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchCertificate();
    }
  }, [key]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  if (loading) return <Loader />;

  if (!certificate) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Award className="w-16 h-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center">Your certificate not generated</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          The certificate you are looking for is not currently available in our system. 
          Please sign in to your account to check your eligibility and mint your certificate.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="gradient-primary hover:opacity-90 glow-hover min-w-[140px]" asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button variant="outline" className="min-w-[140px]" asChild>
            <Link to="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Public Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={d5artLogo} alt="D Logo" className="h-10 w-auto" />
              <span className="text-muted-foreground text-lg">×</span>
              <img src={dLogo} alt="D5art Logo" className="h-10 w-auto" />
            </div>
            <div className="hidden sm:block border-l border-border/50 pl-4">
              <h1 className="font-bold text-lg">D5art</h1>
              <p className="text-xs text-muted-foreground">Verification Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              Verified on Polygon Blockchain
            </div>
            <ThemeToggle />
            {/* {user && (
               <Button className="gradient-primary hover:opacity-90 glow-hover hidden sm:flex items-center gap-2" asChild>
                  <Link to="/dashboard">
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
               </Button>
            )} */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Certificate Image/Card */}
            <div className="lg:col-span-3">
              <Card className="overflow-hidden border-border/50 shadow-2xl shadow-primary/5">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] bg-muted relative group">
                    <img 
                      src={certificate.s3_url || `https://gateway.pinata.cloud/ipfs/${certificate.token_id}`} 
                      alt="Certificate" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Button onClick={handleShare} variant="outline" className="flex-1 min-w-[140px]">
                  <Share2 className="w-4 h-4 mr-2" /> Share Link
                </Button>
                <Button className="flex-1 min-w-[140px] gradient-primary text-white" asChild>
                  <a href={certificate.s3_url} download target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" /> Download Ref
                  </a>
                </Button>
              </div>
            </div>

            {/* Verification Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-2">{certificate.assessment === 'Divershefy' ? 'Professional Member Certificate' : certificate.assessment}</h2>
                <p className="text-muted-foreground">Certified Professional Verification</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Verified Authenticity</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">This certificate has been issued by D5art and verified on the Polygon blockchain.</p>
                  </div>
                </div>

                <div className="bg-card/50 border border-border/50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Token ID</span>
                    <span className="font-mono font-medium">{certificate.token_id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Blockchain</span>
                    <span className="font-medium">Polygon Amoy</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-500 font-semibold uppercase tracking-wider text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      {certificate.status}
                    </span>
                  </div>
                   <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Issued Date</span>
                    <span className="font-medium font-mono">{new Date(certificate.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Button variant="link" className="px-0 h-auto text-primary" asChild>
                    <a 
                      href={`https://amoy.polygonscan.com/tx/${certificate.trx_hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      View on Polygonscan <ExternalLink className="w-3 h-3" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="pt-8 text-center lg:text-left">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">Secured by D5art Protocol</p>
                <div className="flex items-center justify-center lg:justify-start gap-4 grayscale opacity-50">
                   <img src={d5artLogo} alt="D5art" className="h-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
