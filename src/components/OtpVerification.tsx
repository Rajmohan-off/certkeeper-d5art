import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, sendOtp } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import { toast } from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OtpVerificationProps {
  email: string;
  role: string;
  onVerified: () => void;
  onClose: () => void;
}

const OtpVerification: React.FC<OtpVerificationProps> = ({ email, role, onVerified, onClose }) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (value: string, index: number) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return toast.error("Please enter a 6-digit OTP");
    }

    setVerifying(true);
    try {
      const resultAction = await dispatch(verifyOtp({ email, otp: otpValue }));
      if (verifyOtp.fulfilled.match(resultAction)) {
        toast.success("OTP verified successfully!");
        onVerified();
      } else {
        toast.error(resultAction.payload as string || "Verification failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const resultAction = await dispatch(sendOtp({ email, role }));
      if (sendOtp.fulfilled.match(resultAction)) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(resultAction.payload as string || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white">Verify Email</h2>
          <p className="text-zinc-400">
            Enter the 6-digit code sent to <br />
            <span className="text-primary font-medium">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2 mb-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-14 text-center text-2xl font-bold bg-zinc-800 border border-zinc-700 rounded-xl focus:border-primary focus:ring-1 focus:ring-primary outline-none text-white transition-all shadow-inner"
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleVerify}
            className="w-full h-12 gradient-primary text-lg font-bold"
            disabled={verifying}
          >
            {verifying ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : "Verify OTP"}
          </Button>

          <div className="text-center">
            <button 
              onClick={handleResend}
              disabled={resending}
              className="text-sm text-zinc-400 hover:text-primary transition-colors disabled:opacity-50"
            >
              {resending ? "Resending..." : "Didn't receive code? Resend"}
            </button>
          </div>
        </div>

        <p className="mt-8 text-xs text-center text-zinc-500 italic">
          Tip: Check your spam folder if the code doesn't arrive in a few minutes.
        </p>
      </div>
    </div>
  );
};

export default OtpVerification;
