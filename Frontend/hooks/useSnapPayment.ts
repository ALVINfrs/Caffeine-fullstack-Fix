"use client";

import { useEffect, useState } from "react";

// Definisikan interface untuk Midtrans Snap
interface MidtransSnap {
  pay: (
    snapToken: string,
    options?: {
      onSuccess?: (result: any) => void;
      onPending?: (result: any) => void;
      onError?: (result: any) => void;
      onClose?: () => void;
    }
  ) => void;
  hide: () => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}

interface SnapPayment {
  pay: (
    snapToken: string,
    options?: {
      onSuccess?: (result: any) => void;
      onPending?: (result: any) => void;
      onError?: (result: any) => void;
      onClose?: () => void;
    }
  ) => void;
  isReady: boolean;
}

export const useSnapPayment = (
  clientKey: string,
  isProduction: boolean = false
): SnapPayment => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;

    script.onload = () => {
      console.log("Snap script loaded with client key:", clientKey);
      setIsReady(true);
    };

    script.onerror = () => {
      console.error("Failed to load Midtrans Snap script");
      setIsReady(false);
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [clientKey, isProduction]);

  const pay = (
    snapToken: string,
    options: {
      onSuccess?: (result: any) => void;
      onPending?: (result: any) => void;
      onError?: (result: any) => void;
      onClose?: () => void;
    } = {}
  ) => {
    if (!isReady || !window.snap) {
      console.error("Snap is not ready");
      return;
    }

    window.snap.pay(snapToken, {
      onSuccess: options.onSuccess,
      onPending: options.onPending,
      onError: options.onError,
      onClose: options.onClose,
    });
  };

  return { pay, isReady };
};
