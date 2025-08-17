// src/components/modals/ContactModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  User, 
  Building, 
  Send,
  Briefcase,
  Mail,
  Phone
} from 'lucide-react';
import { Button, Input, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useCandidateStore } from '@/stores/candidateStore';
import { useJobStore } from '@/stores/jobStore';

interface ContactModalProps {
  isOpen: boolean;
  type: 'candidate' | 'company';
  targetId: string | null;
  jobId?: string; // Contexte optionnel
  onClose: () => void;
  onSend?: (message: string, targetId: string) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  type,
  targetId,
  jobId,
  onClose,
  onSend
}) => {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { candidates } = useCandidateStore();
  const { jobs } = useJobStore();

  // Données du destinataire
  const targetCandidate = type === 'candidate' && targetId 
    ? candidates.find(c => c.id === targetId) 
    : null;
  
  const targetJob = jobId ? jobs.find(j => j.id === jobId) : null;

  // Réinitialiser le formulaire à l'ouverture
  useEffect(() => {
    if (isOpen) {
      setMessage('');
      setSubject('');
      
      // Pré-remplir le sujet selon le contexte
      if (type === 'candidate' && targetCandidate && targetJob) {
        setSubject(`Opportunité : ${targetJob.title}`);
      } else if (type === 'company' && targetJob) {
        setSubject(`Candidature : ${targetJob.title}`);
      } else if (type === 'candidate' && targetCandidate) {
        setSubject(`Prise de contact - ${targetCandidate.profile.title}`);
      } else {
        setSubject('Prise de contact');
      }
    }
  }, [isOpen, type, targetCandidate, targetJob]);

  const handleSend = async () => {
    if (!message.trim() || !targetId) {
      toast.error('Message requis', 'Veuillez saisir un message.');
      return;
    }

    setIsLoading(true);
    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSend) {
        onSend(message, targetId);
      }
      
      toast.success(
        'Message envoyé !', 
        `Votre message a été transmis ${type === 'candidate' ? 'au candidat' : 'à l\'entreprise'}.`
      );
      
      onClose();
    } catch (error) {
      toast.error('Erreur', 'Impossible d\'envoyer le message. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const getModalTitle = () => {
    if (type === 'candidate' && targetCandidate) {
      return `Contacter ${targetCandidate.profile.firstName} ${targetCandidate.profile.lastName}`;
    }
    if (type === 'company') {
      return 'Contacter l\'entreprise';
    }
    return 'Nouveau message';
  };

  const getTemplateMessage = () => {
    if (type === 'candidate' && targetCandidate && targetJob) {
      return `Bonjour ${targetCandidate.profile.firstName},\n\nJ'ai consulté votre profil et je pense que vous pourriez être intéressé(e) par notre offre "${targetJob.title}".\n\nVotre expérience en ${targetCandidate.profile.title} correspond parfaitement à ce que nous recherchons.\n\nSeriez-vous disponible pour en discuter ?\n\nCordialement,\n${user?.firstName} ${user?.lastName}`;
    }
    
    if (type === 'company' && targetJob) {
      return `Bonjour,\n\nJe suis très intéressé(e) par votre offre "${targetJob.title}" et souhaiterais obtenir plus d'informations.\n\nMon profil correspond aux exigences mentionnées et je serais ravi(e) de vous présenter ma candidature plus en détail.\n\nPourrions-nous programmer un échange ?\n\nCordialement,\n${user?.firstName} ${user?.lastName}`;
    }
    
    return '';
  };

  const fillTemplate = () => {
    const template = getTemplateMessage();
    if (template) {
      setMessage(template);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size="lg"
    >
      <div className="space-y-6">
        {/* Informations destinataire */}
        {type === 'candidate' && targetCandidate && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {targetCandidate.profile.firstName} {targetCandidate.profile.lastName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {targetCandidate.profile.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {targetCandidate.profile.location.city} • {targetCandidate.profile.experience} ans d'exp.
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'company' && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  TechCorp Innovation
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Entreprise technologique
                </p>
                {targetJob && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Concernant : {targetJob.title}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Formulaire */}
        <div className="space-y-4">
          <Input
            label="Sujet"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Objet de votre message"
            fullWidth
          />

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message
              </label>
              {getTemplateMessage() && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fillTemplate}
                  className="text-xs"
                >
                  Utiliser un modèle
                </Button>
              )}
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Votre message..."
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {message.length}/1000 caractères
            </p>
          </div>
        </div>

        {/* Conseils */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
            💡 Conseils pour un message efficace
          </h4>
          <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <li>• Soyez personnel et mentionnez des éléments spécifiques du profil</li>
            <li>• Expliquez clairement pourquoi vous les contactez</li>
            <li>• Proposez une prochaine étape concrète (appel, entretien)</li>
            <li>• Restez professionnel mais authentique</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 mr-1" />
            Envoyé depuis Handi.jobs
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSend}
              isLoading={isLoading}
              disabled={!message.trim() || message.length > 1000}
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { ContactModal };