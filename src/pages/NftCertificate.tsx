import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Download, Share2, Eye, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';

interface NFTData {
  tokenId: string;
  metadata?: {
    name: string;
    description: string;
    image: string;
    attributes: Array<{ trait_type: string; value: string }>;
  };
  owner?: string;
}

export default function NftCertificate() {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [statusData, setStatusData] = useState<any>(null);
  const [nftData, setNftData] = useState<NFTData | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axiosInstance.get('/psychometric/webinar/check-status');
        setStatusData(response.data.data);
        
        if (response.data.data.assessmentStatus === 'Minted' && response.data.data.tokenId) {
          fetchNFTDetails(response.data.data.tokenId);
        }
      } catch (error) {
        console.error('Error checking webinar status:', error);
        toast({
          title: "Error",
          description: "Failed to fetch certificate status.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [id]);

  const fetchNFTDetails = async (tokenId: string) => {
    try {
      // In a real scenario, this would call Moralis or a backend endpoint that aggregates Moralis data
      // For now, we follow the reference client's pattern of fetching from Moralis if possible
      const response = await axiosInstance.get(`/answerset/nft-details/${tokenId}`);
      setNftData(response.data);
    } catch (error) {
      console.error('Error fetching NFT details:', error);
    }
  };

  const handleMint = async () => {
    setMinting(true);
    try {
      const response = await axiosInstance.post('/holland/webinar/mint-nft');
      if (response.data.success) {
        toast({
          title: "Success",
          description: "Your certificate is being minted on the blockchain!",
        });
        // Success logic - show popup or redirect
        setStatusData((prev: any) => ({ ...prev, assessmentStatus: 'Minted', tokenId: response.data.data.token_id }));
      }
    } catch (error: any) {
      toast({
        title: "Minting Failed",
        description: error.response?.data?.message || "Something went wrong during minting.",
        variant: "destructive",
      });
    } finally {
      setMinting(false);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Downloading",
      description: "Generating your certificate PDF...",
    });
    // PDF generation logic here
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Certificate link copied to clipboard.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const isMinted = statusData?.assessmentStatus === 'Minted';
  const canMint = statusData?.assessmentStatus === 'Eligible';

  return (
    <div className="min-h-screen bg-background text-foreground p-6 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <header className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex p-3 rounded-2xl bg-primary/20 text-primary border border-primary/20 mb-4"
          >
            <Award className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Webinar <span className="text-primary italic">Certificate</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your blockchain-verified proof of knowledge and participation.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Certificate View */}
          <Card className="bg-card border-border backdrop-blur-sm overflow-hidden border-2 transition-all hover:border-primary/30">
            <CardContent className="p-0 aspect-[1.414/1] relative flex items-center justify-center">
              {isMinted ? (
                <img 
                  src={nftData?.metadata?.image || 'https://via.placeholder.com/600x400?text=Certificate+Preview'} 
                  alt="Certificate"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center space-y-4 p-8">
                  <ShieldCheck className="w-16 h-16 text-zinc-700 mx-auto" />
                  <p className="text-zinc-500 font-medium italic">Certificate Preview Locked</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Details & Actions */}
          <div className="space-y-6">
            <Card className="bg-card border-border backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Status: <span className={isMinted ? "text-green-500" : "text-amber-500"}>{statusData?.assessmentStatus}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-zinc-400 text-sm mb-2">Participant</p>
                  <p className="text-lg font-bold">{user?.name || 'Loading...'}</p>
                </div>

                {isMinted && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Token ID</p>
                      <p className="font-mono text-sm text-primary">#{statusData?.tokenId}</p>
                    </div>
                    <div>
                      <p className="text-zinc-400 text-sm mb-1">Blockchain</p>
                      <p className="font-medium">Polygon</p>
                    </div>
                  </motion.div>
                )}

                <div className="pt-4 flex flex-col gap-3">
                  {canMint && (
                    <Button 
                      onClick={handleMint} 
                      className="w-full h-12 gradient-primary text-lg font-bold group"
                      disabled={minting}
                    >
                      {minting ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      ) : (
                        <Award className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      )}
                      Mint NFT Certificate
                    </Button>
                  )}

                  {isMinted && (
                    <>
                      <Button onClick={handleDownload} variant="secondary" className="w-full h-11 bg-secondary hover:bg-secondary/80 text-foreground">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={handleShare} variant="outline" className="border-border hover:bg-secondary text-foreground">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" className="border-border hover:bg-secondary text-foreground">
                          <Eye className="w-4 h-4 mr-2" />
                          Explorer
                        </Button>
                      </div>
                    </>
                  )}

                  {!canMint && !isMinted && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-sm text-center italic">
                      Please complete your assessment to become eligible for binary minting.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
