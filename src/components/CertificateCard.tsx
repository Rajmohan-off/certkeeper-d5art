import { Certificate } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, ExternalLink, ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CertificateCardProps {
  certificate: Certificate;
  onClick: () => void;
}

export default function CertificateCard({ certificate, onClick }: CertificateCardProps) {
  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shrink-0 group-hover:glow transition-all duration-300">
            <Award className="w-6 h-6 text-primary-foreground" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                {certificate.title}
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="shrink-0">
                      <Badge className="bg-success/20 text-success border-success/30 hover:bg-success/30 cursor-help">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Authenticated
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-card border-border/50 text-foreground">
                    <p className="text-sm">This certificate is original and authenticated by D5art</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {certificate.issuer}
            </p>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Issued: {certificate.issueDate ? format(new Date(certificate.issueDate), 'MMM dd, yyyy') : 'N/A'}</span>
              </div>
              {certificate.expiryDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-warning" />
                  <span>Expires: {certificate.expiryDate ? format(new Date(certificate.expiryDate), 'MMM dd, yyyy') : 'N/A'}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5 mt-3">
              {certificate.skills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="text-xs bg-secondary/80 hover:bg-secondary"
                >
                  {skill}
                </Badge>
              ))}
              {certificate.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-secondary/80">
                  +{certificate.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
          
          <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}
