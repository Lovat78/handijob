// src/utils/formatting.ts

// Formatage des devises
export const formatCurrency = (amount: number, currency = 'EUR', locale = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatSalaryRange = (min?: number, max?: number): string => {
  if (!min && !max) return 'Salaire non spécifié';
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (min) return `À partir de ${formatCurrency(min)}`;
  if (max) return `Jusqu'à ${formatCurrency(max)}`;
  return '';
};

// Formatage des dates
export const formatDate = (date: string | Date, locale = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatShortDate = (date: string | Date, locale = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date, locale = 'fr-FR'): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};

export const formatRelativeTime = (date: string | Date, locale = 'fr-FR'): string => {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  // Moins d'une minute
  if (diffInSeconds < 60) return 'À l\'instant';
  
  // Moins d'une heure
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} min`;
  }
  
  // Moins d'un jour
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} h`;
  }
  
  // Moins d'une semaine
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} j`;
  }
  
  // Plus d'une semaine, afficher la date
  return formatShortDate(date, locale);
};

export const formatDuration = (startDate: string | Date, endDate?: string | Date): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  
  const diffInMonths = (end.getFullYear() - start.getFullYear()) * 12 + 
                      (end.getMonth() - start.getMonth());
  
  if (diffInMonths < 1) return 'Moins d\'un mois';
  if (diffInMonths < 12) return `${diffInMonths} mois`;
  
  const years = Math.floor(diffInMonths / 12);
  const months = diffInMonths % 12;
  
  if (months === 0) return `${years} an${years > 1 ? 's' : ''}`;
  return `${years} an${years > 1 ? 's' : ''} et ${months} mois`;
};

// Formatage des nombres
export const formatNumber = (num: number, locale = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale).format(num);
};

export const formatPercentage = (value: number, decimals = 1, locale = 'fr-FR'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value / 100);
};

export const formatFileSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  
  return `${Math.round(size * 100) / 100} ${sizes[i]}`;
};

// Formatage du texte
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length).trim() + suffix;
};

export const truncateWords = (text: string, maxWords: number, suffix = '...'): string => {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + suffix;
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplacer espaces par tirets
    .replace(/-+/g, '-') // Remplacer tirets multiples par un seul
    .replace(/^-|-$/g, ''); // Supprimer tirets au début et à la fin
};

export const initials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const formatFullName = (firstName: string, lastName: string): string => {
  return `${capitalize(firstName)} ${lastName.toUpperCase()}`;
};

// Formatage des identifiants
export const formatPhone = (phone: string): string => {
  // Nettoyer le numéro
  const cleaned = phone.replace(/\D/g, '');
  
  // Format français 01 23 45 67 89
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  // Format international +33 1 23 45 67 89
  if (cleaned.length === 11 && cleaned.startsWith('33')) {
    return `+${cleaned.replace(/(\d{2})(\d{1})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5 $6')}`;
  }
  
  return phone; // Retourner tel quel si format non reconnu
};

export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  if (localPart.length <= 2) return email;
  
  const maskedLocal = localPart.charAt(0) + '*'.repeat(localPart.length - 2) + localPart.slice(-1);
  return `${maskedLocal}@${domain}`;
};

// Formatage des adresses
export const formatAddress = (address: {
  street: string;
  city: string;
  zipCode: string;
  country?: string;
}): string => {
  const parts = [
    address.street,
    `${address.zipCode} ${address.city}`,
    address.country && address.country !== 'France' ? address.country : null
  ].filter(Boolean);
  
  return parts.join(', ');
};

export const formatCompactAddress = (address: {
  city: string;
  zipCode: string;
}): string => {
  return `${address.city} (${address.zipCode})`;
};

// Formatage spécifique métier
export const formatExperience = (years: number): string => {
  if (years === 0) return 'Débutant';
  if (years === 1) return '1 an d\'expérience';
  if (years < 5) return `${years} ans d\'expérience`;
  if (years < 10) return `${years} ans d\'expérience`;
  return `${years}+ ans d\'expérience`;
};

export const formatContractType = (contractType: string): string => {
  const types: Record<string, string> = {
    'CDI': 'Contrat à durée indéterminée',
    'CDD': 'Contrat à durée déterminée',
    'Stage': 'Stage',
    'Freelance': 'Freelance / Indépendant',
    'Alternance': 'Alternance / Apprentissage'
  };
  return types[contractType] || contractType;
};

export const formatWorkMode = (workMode: string): string => {
  const modes: Record<string, string> = {
    'Présentiel': 'Sur site',
    'Télétravail': 'Télétravail complet',
    'Hybride': 'Hybride (présentiel + télétravail)'
  };
  return modes[workMode] || workMode;
};

export const formatCompanySize = (size: string): string => {
  const sizes: Record<string, string> = {
    '1-10': 'Startup (1-10 employés)',
    '11-50': 'Petite entreprise (11-50 employés)',
    '51-200': 'Entreprise moyenne (51-200 employés)',
    '201-500': 'Grande entreprise (201-500 employés)',
    '500+': 'Très grande entreprise (500+ employés)'
  };
  return sizes[size] || size;
};

export const formatAccessibilityType = (type: string): string => {
  const types: Record<string, string> = {
    'wheelchair_accessible': 'Accessible en fauteuil roulant',
    'hearing_impaired': 'Adapté aux déficiences auditives',
    'visually_impaired': 'Adapté aux déficiences visuelles',
    'cognitive_support': 'Support pour difficultés cognitives',
    'flexible_schedule': 'Horaires flexibles',
    'remote_work': 'Télétravail possible'
  };
  return types[type] || type;
};

export const formatMatchScore = (score: number): string => {
  if (score >= 90) return 'Excellent match';
  if (score >= 80) return 'Très bon match';
  if (score >= 70) return 'Bon match';
  if (score >= 60) return 'Match correct';
  if (score >= 50) return 'Match moyen';
  return 'Match faible';
};

export const formatOETHRate = (rate: number): string => {
  return `${rate.toFixed(1)}%`;
};

export const formatOETHStatus = (rate: number): {
  status: 'compliant' | 'warning' | 'non_compliant';
  label: string;
  color: string;
} => {
  if (rate >= 6) {
    return {
      status: 'compliant',
      label: 'Conforme OETH',
      color: 'success'
    };
  } else if (rate >= 4) {
    return {
      status: 'warning',
      label: 'Attention OETH',
      color: 'warning'
    };
  } else {
    return {
      status: 'non_compliant',
      label: 'Non conforme OETH',
      color: 'error'
    };
  }
};

// Formatage pour l'export
export const formatForCSV = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    // Échapper les guillemets et entourer de guillemets si nécessaire
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
  return String(value);
};

export const formatArrayForDisplay = (items: string[], maxItems = 3, separator = ', '): string => {
  if (items.length <= maxItems) {
    return items.join(separator);
  }
  return `${items.slice(0, maxItems).join(separator)} et ${items.length - maxItems} autre${items.length - maxItems > 1 ? 's' : ''}`;
};

// Formatage des URLs
export const formatWebsiteUrl = (url: string): string => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
};

export const extractDomainFromUrl = (url: string): string => {
  try {
    const domain = new URL(formatWebsiteUrl(url)).hostname;
    return domain.replace(/^www\./, '');
  } catch {
    return url;
  }
};