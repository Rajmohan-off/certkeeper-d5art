import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { Certificate } from '@/types/user';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import CertificateCard from '@/components/CertificateCard';
import CertificateModal from '@/components/CertificateModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, Mail, Phone, MapPin, Calendar, Award, Compass, Zap, Info, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import cdLogo from '@/assets/cd-logo.png';
import ibaLogoNew from '@/assets/iba-logo-new.png';

// Dummy certificates data
const dummyCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Divershefy Professional Member',
    issuer: 'D5art',
    issueDate: '2024-01-15T00:00:00.000Z',
    credentialId: 'CERT-2024-001',
    description: 'Blockchain-verified certificate for Divershefy.',
    skills: ['Blockchain', 'Divershefy'],
    verificationUrl: `${window.location.origin}/verify/CERT-2024-001`,
    s3_url: '',
    certificateKey: 'CERT-2024-001'
  }
];

export default function Dashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [certificates] = useState<Certificate[]>(dummyCertificates);
  const navigate = useNavigate();
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssessmentPopupOpen, setIsAssessmentPopupOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  };

  if (!user) return null;
 
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
            <img src={cdLogo} alt="CD Logo" className="h-12 w-auto" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">in collaboration with</span>
              <span className="font-semibold text-foreground">D5art</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm sticky top-24">
              <CardHeader className="text-center pb-2">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-primary/20 overflow-hidden bg-background flex items-center justify-center">
                  <img src={ibaLogoNew} alt="IBA Logo" className="w-20 h-20 object-contain" />
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Member since {user.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : 'N/A'}</p>
              </CardHeader>
              
              <CardContent className="space-y-6 pt-4">
                {/* Main Menu Sidebar */}
                <div className="space-y-1 mb-6">
                   <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-3">Main Menu</p>
                   <button 
                    onClick={() => setIsAssessmentPopupOpen(true)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/80 transition-all group border border-transparent hover:border-primary/20"
                   >
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                         <Compass className="w-4 h-4" />
                       </div>
                       <span className="font-medium text-sm">Holland Assessment</span>
                     </div>
                     <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                   </button>

                   <button className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/80 transition-all group border border-transparent hover:border-primary/20 opacity-60 cursor-not-allowed">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                         <Zap className="w-4 h-4" />
                       </div>
                       <span className="font-medium text-sm">Psychometric Test</span>
                     </div>
                     <Info className="w-4 h-4 text-muted-foreground" />
                   </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-3">Contact Information</p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Mobile</p>
                      <p>{user.mobileNumber}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p>{user.state}, {user.country}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date of Birth</p>
                       <p>{user.dateOfBirth ? format(new Date(user.dateOfBirth), 'MMMM dd, yyyy') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <span className="font-medium">Certificates</span>
                    </div>
                    <span className="text-2xl font-bold gradient-text">{certificates.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Certificates Grid */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">My Certificates</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on a certificate to view details and share
                </p>
              </div>
            </div>
            
            {certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.id}
                    certificate={certificate}
                    onClick={() => handleCertificateClick(certificate)}
                  />
                ))}
              </div>
            ) : (
              <Card className="border-border/50 bg-card/60">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Award className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-lg">No certificates yet</h3>
                   <p className="text-sm text-muted-foreground mt-1 mb-6 text-center max-w-sm px-4">
                    Your earned certificates will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Holland Assessment Popup */}
      {isAssessmentPopupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <Card className="w-full max-w-md border-border/50 bg-card shadow-2xl scale-in-center">
            <CardHeader className="text-center pb-2">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-bold">Start Assessment</CardTitle>
              <p className="text-muted-foreground">
                Ready to discover your professional personality?
              </p>
            </CardHeader>
            <CardContent className="text-center py-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Holland RIASEC assessment helps you identify your career interests and strengths. It takes about 10-15 minutes to complete.
              </p>
              <div className="mt-6 p-4 rounded-xl bg-secondary/50 border border-border/50 text-left flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0" />
                <p className="text-xs text-muted-foreground">
                  You will be redirected to our specialized assessment engine at <strong>d5art.com</strong>.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setIsAssessmentPopupOpen(false)}
              >
                Maybe Later
              </Button>
              <Button 
                className="flex-1 gradient-primary hover:opacity-90 glow-hover"
                onClick={() => window.location.href = "https://d5art.com/event/start-assessment"}
              >
                Start Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}