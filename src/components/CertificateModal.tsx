import { Certificate as UserCertificate } from '@/types/user';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Copy, ExternalLink, CheckCircle, Share2, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import certificateImage from '@/assets/certificate-template.png';

interface CertificateModalProps {
  certificate: UserCertificate | any;
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateModal({ certificate, isOpen, onClose }: CertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!certificate) return null;

  const handleVerify = () => {
    const certKey = certificate.certificateKey || certificate.token_id;
    if (certKey) {
      navigate(`/verify/${certKey}`);
      onClose();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificate.verificationUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Verification link copied to clipboard",
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${certificate.title} - Certificate`,
          text: `Check out my ${certificate.title} certificate from ${certificate.issuer}`,
          url: certificate.verificationUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border/50 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center glow">
              <Award className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-xl">{certificate.title}</DialogTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30 cursor-help">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Authenticated
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border-border/50 text-foreground">
                      <p className="text-sm">This certificate is original and authenticated by D5art</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <DialogDescription className="text-muted-foreground">
                {certificate.issuer}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Certificate Image */}
          <div className="rounded-xl overflow-hidden border border-border/50 bg-secondary/20">
            <img 
              src={certificate.s3_url || certificateImage} 
              alt={`${certificate.title} Certificate`}
              className="w-full h-auto object-contain"
            />
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {certificate.description}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Credential ID</p>
              <p className="text-sm font-medium font-mono">{certificate.credentialId}</p>
            </div>
            <div className="bg-secondary/30 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Issue Date</p>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <p className="text-sm font-medium">
                  {certificate.issueDate ? format(new Date(certificate.issueDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            {certificate.expiryDate && (
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Expiry Date</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-warning" />
                  <p className="text-sm font-medium">
                    {certificate.expiryDate ? format(new Date(certificate.expiryDate), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Issued By</p>
            <p className="text-sm font-medium">{certificate.issuer}</p>
          </div>
          
          <div>
            <p className="text-xs text-muted-foreground mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {certificate.skills.map((skill) => (
                <Badge
                  key={skill}
                  className="gradient-primary text-primary-foreground"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <p className="text-sm font-medium">Verification Link</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-xs bg-background/50 rounded px-3 py-2 overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground">
                {certificate.verificationUrl}
              </code>
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className="shrink-0 border-border hover:border-primary hover:bg-primary/10"
              >
                {copied ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link to verify the authenticity of this certificate
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button
              onClick={handleShare}
              className="flex-1 gradient-primary hover:opacity-90 glow-hover"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Certificate
            </Button>
            <Button
              variant="outline"
              onClick={handleVerify}
              className="border-border hover:border-primary hover:bg-primary/10"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Verify
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
