 import { useParams, Link, useLocation } from 'react-router-dom';
 import { Card, CardContent } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Award, CheckCircle, Share2, Download, ExternalLink, ShieldCheck, Calendar, Copy } from 'lucide-react';
 import { useState } from 'react';
 import { useToast } from '@/hooks/use-toast';
 import dLogo from '@/assets/d-logo.png';
 import d5artLogo from '@/assets/d5art-logo.png';
 import ibaLogo from '@/assets/iba-logo.png';
 import programDetails from '@/assets/program-details.jpg';
 import { ThemeToggle } from '@/components/ThemeToggle';
 import { format } from 'date-fns';
 import certificateImage from '@/assets/certificate-template.png';
 
 export default function CertificateVerification() {
   const { key } = useParams();
   const location = useLocation();
   const [copied, setCopied] = useState(false);
   const { toast } = useToast();
 
   // Get certificate from navigation state or use dummy data
   const certificate = location.state?.certificate || {
     id: key || 'cert-001',
     title: 'Professional Member Certificate',
     issuer: 'India Blockchain Alliance',
     issueDate: '2025-01-08',
     credentialId: 'IBA-2025-CERT-001',
     token_id: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
     trx_hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
     status: 'Verified',
     s3_url: '',
     assessment: 'Divershefy',
     createdAt: '2025-01-08T10:00:00Z',
   };
 
   const handleShare = () => {
     navigator.clipboard.writeText(window.location.href);
     toast({
       title: "Link copied!",
       description: "Verification link copied to clipboard",
     });
   };
 
   const handleCopyCredentialId = async () => {
     try {
       await navigator.clipboard.writeText(certificate?.credentialId || certificate?.token_id || '');
       setCopied(true);
       toast({
         title: "Credential ID copied!",
         description: "The credential ID has been copied to clipboard",
       });
       setTimeout(() => setCopied(false), 2000);
     } catch {
       toast({
         title: "Failed to copy",
         description: "Please try again",
         variant: "destructive",
       });
     }
   };
 
   if (!certificate) {
     return (
       <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
         <Award className="w-16 h-16 text-muted-foreground mb-4" />
         <h1 className="text-2xl font-bold mb-2 text-center">Certificate Not Found</h1>
         <p className="text-muted-foreground mb-8 text-center max-w-md">
           The certificate you are looking for is not currently available in our system.
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
       {/* Header with D logo prominent */}
       <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             {/* D Logo - Primary and Prominent with white background */}
             <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md">
               <img src={dLogo} alt="D Logo" className="h-10 w-auto" />
             </div>
             
             {/* In collaboration with D5art */}
             <div className="flex items-center gap-2">
               <span className="text-xs text-muted-foreground hidden sm:inline">in collaboration with</span>
               <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                 <img src={d5artLogo} alt="D5art Logo" className="h-5 w-auto" />
               </div>
             </div>
           </div>
           
           <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-full">
               <ShieldCheck className="w-4 h-4" />
               Verified Certificate
             </div>
             <ThemeToggle />
           </div>
         </div>
       </header>
 
       <main className="container mx-auto px-4 pt-8">
         <div className="max-w-6xl mx-auto">
           {/* Title Section */}
           <div className="text-center mb-8">
             <Badge className="bg-success/20 text-success border-success/30 mb-4">
               <ShieldCheck className="w-3 h-3 mr-1" />
               Authenticated Certificate
             </Badge>
             <h1 className="text-3xl md:text-4xl font-bold mb-2">
               {certificate.title}
             </h1>
             <p className="text-muted-foreground">Verified and authenticated by India Blockchain Alliance</p>
           </div>
 
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             {/* Left Column - Certificate Image */}
             <div className="space-y-6">
               <Card className="overflow-hidden border-border/50 shadow-2xl shadow-primary/5">
                 <CardContent className="p-0">
                   <div className="bg-muted relative">
                     <img 
                       src={certificate.s3_url || certificateImage} 
                       alt="Certificate" 
                       className="w-full h-auto object-contain"
                     />
                   </div>
                 </CardContent>
               </Card>
 
               {/* Action Buttons */}
               <div className="flex flex-wrap gap-4">
                 <Button onClick={handleShare} variant="outline" className="flex-1 min-w-[140px]">
                   <Share2 className="w-4 h-4 mr-2" /> Share
                 </Button>
                 <Button className="flex-1 min-w-[140px] gradient-primary text-white" asChild>
                   <a href={certificate.s3_url || certificateImage} download target="_blank" rel="noopener noreferrer">
                     <Download className="w-4 h-4 mr-2" /> Download
                   </a>
                 </Button>
               </div>
             </div>
 
             {/* Right Column - Details */}
             <div className="space-y-6">
               {/* IBA Logo */}
               <div className="flex items-center gap-4 p-4 bg-card/50 border border-border/50 rounded-xl">
                 <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md shrink-0">
                   <img src={ibaLogo} alt="IBA Logo" className="h-14 w-auto" />
                 </div>
                 <div>
                   <h3 className="font-semibold">India Blockchain Alliance</h3>
                   <p className="text-sm text-muted-foreground">Issuing Authority</p>
                 </div>
               </div>
 
               {/* Certificate Details */}
               <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4">
                 <h3 className="font-semibold text-lg mb-4">Certificate Details</h3>
                 
                 <div className="space-y-3">
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-muted-foreground">Credential ID</span>
                     <div className="flex items-center gap-2">
                       <span className="font-mono font-medium text-xs">{(certificate.credentialId || certificate.token_id)?.slice(0, 20)}...</span>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-6 w-6"
                         onClick={handleCopyCredentialId}
                       >
                         {copied ? <CheckCircle className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                       </Button>
                     </div>
                   </div>
                   
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Issue Date</span>
                     <div className="flex items-center gap-1.5">
                       <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                       <span className="font-medium">
                         {certificate.issueDate ? format(new Date(certificate.issueDate), 'MMM dd, yyyy') : 'N/A'}
                       </span>
                     </div>
                   </div>
                   
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Blockchain</span>
                     <span className="font-medium">Polygon Amoy</span>
                   </div>
                   
                   <div className="flex justify-between text-sm">
                     <span className="text-muted-foreground">Status</span>
                     <Badge className="bg-success/20 text-success border-success/30">
                       {certificate.status || 'Verified'}
                     </Badge>
                   </div>
                 </div>
 
                 <div className="pt-2 border-t border-border/50">
                   <Button variant="link" className="px-0 h-auto text-primary" asChild>
                     <a 
                       href={`https://amoy.polygonscan.com/tx/${certificate.trx_hash || '0x1234567890abcdef'}`} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="flex items-center gap-1.5"
                     >
                       View on Polygonscan <ExternalLink className="w-3 h-3" />
                     </a>
                   </Button>
                 </div>
               </div>
 
               {/* Verification Status */}
               <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                 <div className="flex items-start gap-3">
                   <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                     <CheckCircle className="w-5 h-5 text-emerald-500" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">Verified Authenticity</h4>
                     <p className="text-xs text-muted-foreground mt-0.5">
                       This certificate has been issued by India Blockchain Alliance and verified on the Polygon blockchain.
                     </p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
 
           {/* Program Details Section */}
           <div className="mt-12">
             <h2 className="text-2xl font-bold mb-6 text-center">Program Details</h2>
             <Card className="overflow-hidden border-border/50 shadow-xl">
               <CardContent className="p-0">
                 <img 
                   src={programDetails} 
                   alt="Program Details" 
                   className="w-full h-auto object-contain"
                 />
               </CardContent>
             </Card>
           </div>
 
           {/* Footer */}
           <div className="mt-12 text-center">
             <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-4">
               Powered by D5art Protocol
             </p>
             <div className="flex items-center justify-center gap-4 opacity-50">
               <img src={d5artLogo} alt="D5art" className="h-6" />
             </div>
           </div>
         </div>
       </main>
     </div>
   );
 }