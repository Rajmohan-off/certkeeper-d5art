import React, { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';

interface RecaptchaComponentProps {
  onTokenGenerated: (token: string) => void;
  onTokenExpired: () => void;
}

export interface RecaptchaRef {
  resetRecaptcha: () => void;
}

const RecaptchaComponent = forwardRef<RecaptchaRef, RecaptchaComponentProps>(({ onTokenGenerated, onTokenExpired }, ref) => {
  const useCloudflare = true; // Defaulting to true as per d5art-client's preferred method
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<any>(null);
  const scriptLoaded = useRef(false);

  useImperativeHandle(ref, () => ({
    resetRecaptcha: () => {
      if (useCloudflare && (window as any).turnstile) {
        (window as any).turnstile.reset();
      } else if (widgetId !== null && (window as any).grecaptcha) {
        (window as any).grecaptcha.reset(widgetId);
      }
    }
  }));

  useEffect(() => {
    const loadRecaptchaScript = () => {
      if (scriptLoaded.current) return;

      const script = document.createElement('script');
      script.async = true;
      script.onload = handleRecaptchaLoad;
      script.src = useCloudflare
        ? 'https://challenges.cloudflare.com/turnstile/v0/api.js'
        : 'https://www.google.com/recaptcha/api.js?render=explicit';
      document.body.appendChild(script);
      scriptLoaded.current = true;
    };

    loadRecaptchaScript();

    return () => {
      if (useCloudflare && (window as any).turnstile) {
        (window as any).turnstile.reset();
      } else if (widgetId !== null && (window as any).grecaptcha) {
        (window as any).grecaptcha.reset(widgetId);
      }
    };
  }, [useCloudflare]);

  const handleRecaptchaLoad = () => {
    if (useCloudflare && (window as any).turnstile) {
      (window as any).turnstile.render(recaptchaRef.current, {
        sitekey: '0x4AAAAAAAzhdXT8tcR1OAVr',
        callback: onTokenGenerated,
        'expired-callback': onTokenExpired,
      });
    } else if (!useCloudflare && (window as any).grecaptcha) {
      const id = (window as any).grecaptcha.render(recaptchaRef.current, {
        sitekey: '6LeDPCoqAAAAAH7ABnqmmz3q7YvSZIXZxbRE4mN2',
        callback: onTokenGenerated,
        'expired-callback': onTokenExpired,
      });
      setWidgetId(id);
    }
  };

  return <div ref={recaptchaRef} id="recaptcha-container" className="flex justify-center my-4"></div>;
});

export default RecaptchaComponent;
