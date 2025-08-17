// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: 'development' | 'staging' | 'production'
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_MOCK_DATA: string
  readonly VITE_SENTRY_DSN?: string
  readonly VITE_POSTHOG_KEY?: string
  readonly VITE_STRIPE_PUBLIC_KEY?: string
  readonly VITE_MAPBOX_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Déclarations globales pour les modules non typés
declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}

declare module '*.ico' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.svg?inline' {
  const src: string;
  export default src;
}

declare module '*.svg?url' {
  const src: string;
  export default src;
}

// Déclarations pour les fichiers CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Déclarations pour les web workers
declare module '*.worker.ts' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

declare module '*.worker.js' {
  class WebpackWorker extends Worker {
    constructor();
  }
  export default WebpackWorker;
}

// Extension du type Window pour des propriétés globales
declare global {
  interface Window {
    // Analytics
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    
    // PWA
    workbox?: any;
    
    // Debugging
    __REDUX_DEVTOOLS_EXTENSION__?: any;
    
    // Feature detection
    ResizeObserver?: ResizeObserver;
    IntersectionObserver?: IntersectionObserver;
    
    // Polyfills
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
    
    // Custom app properties
    handiJobsApp?: {
      version: string;
      environment: string;
      buildTime: string;
    };
  }

  // Web APIs extensions
  interface Navigator {
    // PWA
    serviceWorker?: ServiceWorkerContainer;
    
    // Permissions API
    permissions?: Permissions;
    
    // Web Share API
    share?: (data: ShareData) => Promise<void>;
    
    // Device Memory API
    deviceMemory?: number;
    
    // Network Information API
    connection?: {
      effectiveType: string;
      downlink: number;
      rtt: number;
      saveData: boolean;
    };
  }

  // Geolocation extensions
  interface GeolocationCoordinates {
    readonly accuracy: number;
    readonly altitude: number | null;
    readonly altitudeAccuracy: number | null;
    readonly heading: number | null;
    readonly latitude: number;
    readonly longitude: number;
    readonly speed: number | null;
  }

  // File System Access API
  interface FileSystemFileHandle {
    getFile(): Promise<File>;
    createWritable(): Promise<FileSystemWritableFileStream>;
  }

  interface FileSystemWritableFileStream extends WritableStream {
    write(data: any): Promise<void>;
    close(): Promise<void>;
  }

  // Handi.jobs specific types
  namespace HandiJobs {
    interface Config {
      apiUrl: string;
      version: string;
      environment: string;
      features: {
        analytics: boolean;
        mockData: boolean;
        debugging: boolean;
      };
    }

    interface UserPreferences {
      theme: 'light' | 'dark' | 'auto';
      fontSize: 'small' | 'normal' | 'large';
      accessibilityMode: boolean;
      reducedMotion: boolean;
      language: string;
    }

    interface AnalyticsEvent {
      name: string;
      properties?: Record<string, any>;
      timestamp?: number;
      userId?: string;
      sessionId?: string;
    }
  }
}

// Déclarations pour les types React étendus
declare namespace React {
  interface CSSProperties {
    '--custom-property'?: string;
    [key: `--${string}`]: string | number | undefined;
  }
}

// Déclarations pour les modules CSS-in-JS
declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: Record<string, string>;
      success: Record<string, string>;
      warning: Record<string, string>;
      error: Record<string, string>;
      gray: Record<string, string>;
    };
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    shadows: Record<string, string>;
    typography: {
      fontFamily: Record<string, string>;
      fontSize: Record<string, string>;
      fontWeight: Record<string, number>;
    };
  }
}

// Type guards utilitaires
type NonEmptyArray<T> = [T, ...T[]];

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Utilitaires pour les APIs
interface APIResponse<T = any> {
  data: T;
  message?: string;
  status: 'success' | 'error';
  timestamp: string;
}

interface APIError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Export des types pour utilisation dans l'app
export type {
  NonEmptyArray,
  DeepPartial,
  DeepRequired,
  APIResponse,
  APIError,
  PaginatedResponse
};