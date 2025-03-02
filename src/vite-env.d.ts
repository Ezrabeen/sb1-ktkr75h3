/// <reference types="vite/client" />

interface Window {
  connex?: {
    thor: any;
    vendor: {
      sign: (type: string, message: any) => {
        request: () => Promise<any>;
      };
    };
  };
}