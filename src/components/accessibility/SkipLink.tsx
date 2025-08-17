// src/components/accessibility/SkipLink.tsx
import React from 'react';

const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-lg z-50 font-medium"
    >
      Aller au contenu principal
    </a>
  );
};

export { SkipLink };