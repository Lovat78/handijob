// src/components/publishing/PublicationIntegration.tsx
import React from 'react';
import { Share2, Zap, Globe, Heart } from 'lucide-react';
import { Card, Button, Badge } from '@/components/ui';

interface PublicationIntegrationProps {
  jobTitle: string;
  handibienveillanceScore: number;
  onOpenPublisher: () => void;
}

const PublicationIntegration: React.FC<PublicationIntegrationProps> = ({
  jobTitle,
  handibienveillanceScore,
  onOpenPublisher
}) => {
  const estimatedChannels = 11;
  const estimatedReach = 350000;
  const estimatedBudget = 750;

  return (
    <Card padding="md" className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-primary-600 rounded-lg">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Diffusion Multi-Canaux
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Maximisez la visibilité de "{jobTitle}"
            </p>
          </div>
        </div>
        
        <Badge variant="success" className="flex items-center space-x-1">
          <Heart className="w-3 h-3" />
          <span>{handibienveillanceScore}/100</span>
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-primary-600">{estimatedChannels}</div>
          <div className="text-gray-500">Canaux disponibles</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-green-600">{estimatedReach.toLocaleString()}</div>
          <div className="text-gray-500">Portée maximale</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-orange-600">{estimatedBudget}€</div>
          <div className="text-gray-500">Budget complet</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <Globe className="w-4 h-4" />
          <span>Indeed, LinkedIn, Agefiph + 8 autres canaux</span>
        </div>
        
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenPublisher}
          className="flex items-center space-x-2"
        >
          <Zap className="w-4 h-4" />
          <span>Configurer diffusion</span>
        </Button>
      </div>

      <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          💡 <strong>Conseil :</strong> Avec votre score handibienveillance de {handibienveillanceScore}/100, 
          nous recommandons d'inclure les sites spécialisés (Agefiph, Mission Handicap) pour +25% de candidatures RQTH.
        </p>
      </div>
    </Card>
  );
};

export { PublicationIntegration };
