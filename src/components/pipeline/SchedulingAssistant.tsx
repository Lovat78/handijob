// src/components/pipeline/SchedulingAssistant.tsx - US-038 PIPELINE AUTOMATISÉ
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin,
  Video,
  Users,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  Settings,
  Send,
  Bell,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  User,
  Building,
  Zap
} from 'lucide-react';
import { Card, Button, Badge, Input, Toggle, Modal } from '@/components/ui';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/useAuth';

// Types Planning
interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  available: boolean;
  bookedBy?: string;
  interviewType: 'video' | 'phone' | 'onsite';
  location?: string;
  meetingLink?: string;
  duration: number; // en minutes
  interviewerId: string;
  interviewer: InterviewerInfo;
  notes?: string;
}

interface InterviewerInfo {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar?: string;
  timezone: string;
  workingHours: WorkingHours;
  skills: string[];
  maxInterviewsPerDay: number;
}

interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

interface DaySchedule {
  enabled: boolean;
  startTime: string;
  endTime: string;
  breaks: BreakTime[];
}

interface BreakTime {
  startTime: string;
  endTime: string;
  label: string;
}

interface InterviewBooking {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  jobId: string;
  jobTitle: string;
  timeSlotId: string;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
  createdAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
  interviewType: 'video' | 'phone' | 'onsite';
  location?: string;
  meetingLink?: string;
  duration: number;
  interviewers: InterviewerInfo[];
  agenda?: InterviewAgenda[];
  requirements?: string[];
  documents?: InterviewDocument[];
  notes?: InterviewNote[];
  reminders: ReminderSettings;
  followUp?: FollowUpAction[];
}

interface InterviewAgenda {
  id: string;
  order: number;
  title: string;
  description: string;
  duration: number; // en minutes
  type: 'presentation' | 'technical' | 'discussion' | 'demo' | 'qa';
  responsible?: string;
}

interface InterviewDocument {
  id: string;
  name: string;
  url: string;
  type: 'job_description' | 'company_info' | 'technical_test' | 'presentation' | 'other';
  required: boolean;
  visibleToCandidate: boolean;
}

interface InterviewNote {
  id: string;
  content: string;
  author: string;
  createdAt: string;
  type: 'preparation' | 'feedback' | 'decision' | 'follow_up';
  confidential: boolean;
}

interface ReminderSettings {
  candidateEmail: boolean;
  candidateSMS: boolean;
  recruiterEmail: boolean;
  advanceNotice: number; // en heures
  customMessage?: string;
}

interface FollowUpAction {
  id: string;
  type: 'email' | 'call' | 'task' | 'meeting';
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface SchedulingStats {
  totalBookings: number;
  pendingConfirmations: number;
  completedInterviews: number;
  cancelledInterviews: number;
  averageBookingTime: number; // en heures depuis demande
  mostPopularSlots: string[];
  busyInterviewers: InterviewerInfo[];
  upcomingInterviews: number;
}

const SchedulingAssistant: React.FC = () => {
  const [activeView, setActiveView] = useState<'calendar' | 'bookings' | 'availability' | 'settings'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [bookings, setBookings] = useState<InterviewBooking[]>([]);
  const [interviewers, setInterviewers] = useState<InterviewerInfo[]>([]);
  const [stats, setStats] = useState<SchedulingStats | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<InterviewBooking | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [autoConfirm, setAutoConfirm] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadSchedulingData();
  }, [currentDate]);

  const loadSchedulingData = async () => {
    setIsLoading(true);
    
    // Simulation données planning
    const mockInterviewers: InterviewerInfo[] = [
      {
        id: 'int-1',
        name: 'Pierre Martin',
        email: 'pierre.martin@handijob.com',
        role: 'CTO',
        department: 'Technique',
        timezone: 'Europe/Paris',
        workingHours: {
          monday: { enabled: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          tuesday: { enabled: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          wednesday: { enabled: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          thursday: { enabled: true, startTime: '09:00', endTime: '18:00', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          friday: { enabled: true, startTime: '09:00', endTime: '17:00', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] }
        },
        skills: ['React', 'Node.js', 'Architecture', 'Leadership'],
        maxInterviewsPerDay: 4
      },
      {
        id: 'int-2',
        name: 'Marie Dupont',
        email: 'marie.dupont@handijob.com',
        role: 'Responsable RH',
        department: 'Ressources Humaines',
        timezone: 'Europe/Paris',
        workingHours: {
          monday: { enabled: true, startTime: '08:30', endTime: '17:30', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          tuesday: { enabled: true, startTime: '08:30', endTime: '17:30', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          wednesday: { enabled: true, startTime: '08:30', endTime: '17:30', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          thursday: { enabled: true, startTime: '08:30', endTime: '17:30', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] },
          friday: { enabled: true, startTime: '08:30', endTime: '16:30', breaks: [{ startTime: '12:00', endTime: '13:00', label: 'Déjeuner' }] }
        },
        skills: ['Recrutement', 'Entretiens RH', 'Handibienveillance', 'Communication'],
        maxInterviewsPerDay: 6
      },
      {
        id: 'int-3',
        name: 'Sophie Laurent',
        email: 'sophie.laurent@handijob.com',
        role: 'Lead Designer',
        department: 'Design',
        timezone: 'Europe/Paris',
        workingHours: {
          monday: { enabled: true, startTime: '10:00', endTime: '18:30', breaks: [{ startTime: '12:30', endTime: '13:30', label: 'Déjeuner' }] },
          tuesday: { enabled: true, startTime: '10:00', endTime: '18:30', breaks: [{ startTime: '12:30', endTime: '13:30', label: 'Déjeuner' }] },
          wednesday: { enabled: true, startTime: '10:00', endTime: '18:30', breaks: [{ startTime: '12:30', endTime: '13:30', label: 'Déjeuner' }] },
          thursday: { enabled: true, startTime: '10:00', endTime: '18:30', breaks: [{ startTime: '12:30', endTime: '13:30', label: 'Déjeuner' }] },
          friday: { enabled: true, startTime: '10:00', endTime: '17:00', breaks: [{ startTime: '12:30', endTime: '13:30', label: 'Déjeuner' }] }
        },
        skills: ['UX/UI', 'Figma', 'Accessibilité', 'Design System'],
        maxInterviewsPerDay: 3
      }
    ];

    const mockTimeSlots: TimeSlot[] = [
      {
        id: 'slot-1',
        startTime: '09:00',
        endTime: '10:00',
        date: '2025-08-17',
        available: true,
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/abc-def-ghi',
        duration: 60,
        interviewerId: 'int-1',
        interviewer: mockInterviewers[0]
      },
      {
        id: 'slot-2',
        startTime: '10:30',
        endTime: '11:30',
        date: '2025-08-17',
        available: false,
        bookedBy: 'Ahmed Benali',
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/xyz-abc-def',
        duration: 60,
        interviewerId: 'int-1',
        interviewer: mockInterviewers[0]
      },
      {
        id: 'slot-3',
        startTime: '14:00',
        endTime: '15:00',
        date: '2025-08-17',
        available: true,
        interviewType: 'onsite',
        location: 'Salle de réunion A - 15 Rue de la Paix, Paris',
        duration: 60,
        interviewerId: 'int-2',
        interviewer: mockInterviewers[1]
      },
      {
        id: 'slot-4',
        startTime: '15:30',
        endTime: '16:15',
        date: '2025-08-17',
        available: true,
        interviewType: 'phone',
        duration: 45,
        interviewerId: 'int-2',
        interviewer: mockInterviewers[1]
      },
      {
        id: 'slot-5',
        startTime: '11:00',
        endTime: '12:00',
        date: '2025-08-18',
        available: true,
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/design-interview',
        duration: 60,
        interviewerId: 'int-3',
        interviewer: mockInterviewers[2]
      },
      {
        id: 'slot-6',
        startTime: '16:00',
        endTime: '17:00',
        date: '2025-08-18',
        available: false,
        bookedBy: 'Sarah Martinez',
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/tech-interview',
        duration: 60,
        interviewerId: 'int-1',
        interviewer: mockInterviewers[0]
      }
    ];

    const mockBookings: InterviewBooking[] = [
      {
        id: 'booking-1',
        candidateId: 'cand-2',
        candidateName: 'Ahmed Benali',
        candidateEmail: 'ahmed.benali@example.com',
        candidatePhone: '+33612345678',
        jobId: 'job-1',
        jobTitle: 'Développeur Full Stack Senior',
        timeSlotId: 'slot-2',
        timeSlot: mockTimeSlots[1],
        status: 'confirmed',
        createdAt: '2025-08-15T14:30:00Z',
        confirmedAt: '2025-08-15T15:45:00Z',
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/xyz-abc-def',
        duration: 60,
        interviewers: [mockInterviewers[0]],
        agenda: [
          {
            id: 'agenda-1',
            order: 1,
            title: 'Présentation candidat',
            description: 'Présentation du parcours et motivations',
            duration: 15,
            type: 'presentation'
          },
          {
            id: 'agenda-2',
            order: 2,
            title: 'Questions techniques',
            description: 'Architecture, React, accessibilité',
            duration: 30,
            type: 'technical',
            responsible: 'Pierre Martin'
          },
          {
            id: 'agenda-3',
            order: 3,
            title: 'Questions candidat',
            description: 'Questions sur l\'équipe et l\'entreprise',
            duration: 15,
            type: 'qa'
          }
        ],
        requirements: [
          'Vérifier la qualité audio/vidéo 15 min avant',
          'Préparer les questions techniques',
          'Avoir le CV du candidat sous les yeux'
        ],
        reminders: {
          candidateEmail: true,
          candidateSMS: true,
          recruiterEmail: true,
          advanceNotice: 24
        },
        notes: [
          {
            id: 'note-1',
            content: 'Candidat très motivé, expertise accessibilité remarquable',
            author: 'Marie Dupont',
            createdAt: '2025-08-15T16:00:00Z',
            type: 'preparation',
            confidential: false
          }
        ]
      },
      {
        id: 'booking-2',
        candidateId: 'cand-1',
        candidateName: 'Sarah Martinez',
        candidateEmail: 'sarah.martinez@example.com',
        candidatePhone: '+33687654321',
        jobId: 'job-1',
        jobTitle: 'Développeur Full Stack Senior',
        timeSlotId: 'slot-6',
        timeSlot: mockTimeSlots[5],
        status: 'pending',
        createdAt: '2025-08-16T09:15:00Z',
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/tech-interview',
        duration: 60,
        interviewers: [mockInterviewers[0]],
        agenda: [
          {
            id: 'agenda-4',
            order: 1,
            title: 'Présentation entreprise',
            description: 'Vision HandiJob et valeurs inclusion',
            duration: 10,
            type: 'presentation',
            responsible: 'Pierre Martin'
          },
          {
            id: 'agenda-5',
            order: 2,
            title: 'Entretien technique',
            description: 'Code review et architecture',
            duration: 35,
            type: 'technical',
            responsible: 'Pierre Martin'
          },
          {
            id: 'agenda-6',
            order: 3,
            title: 'Discussion équipe',
            description: 'Intégration et collaboration',
            duration: 15,
            type: 'discussion'
          }
        ],
        reminders: {
          candidateEmail: true,
          candidateSMS: false,
          recruiterEmail: true,
          advanceNotice: 48,
          customMessage: 'N\'oubliez pas de préparer votre environnement de développement'
        }
      },
      {
        id: 'booking-3',
        candidateId: 'cand-4',
        candidateName: 'Julie Moreau',
        candidateEmail: 'julie.moreau@example.com',
        jobId: 'job-2',
        jobTitle: 'UX Designer Inclusif',
        timeSlotId: 'slot-5',
        timeSlot: mockTimeSlots[4],
        status: 'confirmed',
        createdAt: '2025-08-14T11:20:00Z',
        confirmedAt: '2025-08-16T08:30:00Z',
        interviewType: 'video',
        meetingLink: 'https://meet.google.com/design-interview',
        duration: 60,
        interviewers: [mockInterviewers[2], mockInterviewers[1]],
        agenda: [
          {
            id: 'agenda-7',
            order: 1,
            title: 'Portfolio review',
            description: 'Présentation des projets design',
            duration: 20,
            type: 'demo',
            responsible: 'Julie Moreau'
          },
          {
            id: 'agenda-8',
            order: 2,
            title: 'Cas pratique UX',
            description: 'Amélioration accessibilité interface',
            duration: 25,
            type: 'technical',
            responsible: 'Sophie Laurent'
          },
          {
            id: 'agenda-9',
            order: 3,
            title: 'Fit culturel',
            description: 'Valeurs et vision inclusion',
            duration: 15,
            type: 'discussion',
            responsible: 'Marie Dupont'
          }
        ],
        requirements: [
          'Portfolio accessible via partage d\'écran',
          'Préparer cas pratique accessibilité',
          'Questions sur design inclusif'
        ],
        reminders: {
          candidateEmail: true,
          candidateSMS: true,
          recruiterEmail: true,
          advanceNotice: 24
        }
      }
    ];

    const mockStats: SchedulingStats = {
      totalBookings: mockBookings.length,
      pendingConfirmations: mockBookings.filter(b => b.status === 'pending').length,
      completedInterviews: 12,
      cancelledInterviews: 2,
      averageBookingTime: 6.5,
      mostPopularSlots: ['14:00-15:00', '10:00-11:00', '16:00-17:00'],
      busyInterviewers: [mockInterviewers[0], mockInterviewers[1]],
      upcomingInterviews: mockBookings.filter(b => b.status === 'confirmed').length
    };

    setTimeSlots(mockTimeSlots);
    setBookings(mockBookings);
    setInterviewers(mockInterviewers);
    setStats(mockStats);
    setIsLoading(false);
  };

  const confirmBooking = async (bookingId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'confirmed',
          confirmedAt: new Date().toISOString()
        };
      }
      return booking;
    }));

    const booking = bookings.find(b => b.id === bookingId);
    toast.success('Entretien confirmé', `Entretien avec ${booking?.candidateName} confirmé`);
  };

  const cancelBooking = async (bookingId: string, reason?: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancellationReason: reason
        };
      }
      return booking;
    }));

    // Libérer le créneau
    setTimeSlots(prev => prev.map(slot => {
      const booking = bookings.find(b => b.id === bookingId);
      if (slot.id === booking?.timeSlotId) {
        return {
          ...slot,
          available: true,
          bookedBy: undefined
        };
      }
      return slot;
    }));

    const booking = bookings.find(b => b.id === bookingId);
    toast.success('Entretien annulé', `Entretien avec ${booking?.candidateName} annulé`);
  };

  const sendReminder = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Simulation envoi rappel
    toast.success('Rappel envoyé', `Rappel envoyé à ${booking.candidateName}`);
  };

  const generateCalendarDays = () => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - startOfMonth.getDay());
    
    const days = [];
    const currentDateObj = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dateStr = currentDateObj.toISOString().split('T')[0];
      const isCurrentMonth = currentDateObj.getMonth() === currentDate.getMonth();
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      const daySlots = timeSlots.filter(slot => slot.date === dateStr);
      const dayBookings = bookings.filter(booking => booking.timeSlot.date === dateStr);
      
      days.push({
        date: new Date(currentDateObj),
        dateStr,
        isCurrentMonth,
        isToday,
        slots: daySlots,
        bookings: dayBookings,
        availableSlots: daySlots.filter(slot => slot.available).length,
        bookedSlots: daySlots.filter(slot => !slot.available).length
      });
      
      currentDateObj.setDate(currentDateObj.getDate() + 1);
    }
    
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'cancelled':
        return <X className="w-4 h-4 text-red-600" />;
      case 'completed':
        return <Check className="w-4 h-4 text-blue-600" />;
      case 'rescheduled':
        return <RefreshCw className="w-4 h-4 text-purple-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInterviewTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'onsite':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = !searchTerm || 
      booking.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calendar className="w-8 h-8 mx-auto mb-4 animate-pulse text-primary-600" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Assistant de Planification
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestion intelligente des entretiens et disponibilités
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {stats && (
            <>
              <Badge variant="primary" className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{stats.upcomingInterviews} prévus</span>
              </Badge>
              {stats.pendingConfirmations > 0 && (
                <Badge variant="warning" className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{stats.pendingConfirmations} en attente</span>
                </Badge>
              )}
            </>
          )}
          
          <Toggle
            checked={autoConfirm}
            onChange={setAutoConfirm}
            label="Confirmation auto"
          />
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBookingModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nouveau créneau
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setActiveView('calendar')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'calendar'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Calendrier
        </button>
        <button
          onClick={() => setActiveView('bookings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'bookings'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Entretiens ({filteredBookings.length})
        </button>
        <button
          onClick={() => setActiveView('availability')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'availability'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 inline mr-2" />
          Disponibilités
        </button>
        <button
          onClick={() => setActiveView('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeView === 'settings'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Paramètres
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Vue Calendrier */}
        {activeView === 'calendar' && (
          <motion.div
            key="calendar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Navigation mois */}
            <Card padding="md">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </h2>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Grille calendrier */}
            <Card padding="md">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => (
                  <div
                    key={index}
                    className={`p-2 min-h-[80px] border rounded cursor-pointer transition-colors ${
                      day.isCurrentMonth
                        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        : 'bg-gray-50 dark:bg-gray-900 border-gray-100 dark:border-gray-800'
                    } ${
                      day.isToday
                        ? 'ring-2 ring-primary-500'
                        : ''
                    }`}
                    onClick={() => setSelectedDate(day.dateStr)}
                  >
                    <div className={`text-sm font-medium mb-1 ${
                      day.isCurrentMonth
                        ? day.isToday
                          ? 'text-primary-600'
                          : 'text-gray-900 dark:text-white'
                        : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    
                    {day.isCurrentMonth && (
                      <div className="space-y-1">
                        {day.availableSlots > 0 && (
                          <div className="text-xs bg-green-100 text-green-800 px-1 rounded">
                            {day.availableSlots} libres
                          </div>
                        )}
                        {day.bookedSlots > 0 && (
                          <div className="text-xs bg-blue-100 text-blue-800 px-1 rounded">
                            {day.bookedSlots} réservés
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Détail jour sélectionné */}
            {selectedDate && (
              <Card padding="md">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Créneaux du {new Date(selectedDate).toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timeSlots
                    .filter(slot => slot.date === selectedDate)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime))
                    .map(slot => (
                      <div
                        key={slot.id}
                        className={`p-4 border rounded-lg ${
                          slot.available
                            ? 'border-green-200 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 bg-gray-50 dark:bg-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`p-1 rounded ${
                              slot.interviewType === 'video' ? 'bg-blue-100 text-blue-600' :
                              slot.interviewType === 'phone' ? 'bg-green-100 text-green-600' :
                              'bg-purple-100 text-purple-600'
                            }`}>
                              {getInterviewTypeIcon(slot.interviewType)}
                            </div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {slot.startTime} - {slot.endTime}
                            </span>
                          </div>
                          
                          <Badge variant={slot.available ? 'success' : 'secondary'} size="sm">
                            {slot.available ? 'Libre' : 'Réservé'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          👤 {slot.interviewer.name} ({slot.interviewer.role})
                        </div>
                        
                        {slot.bookedBy && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            📅 Réservé par {slot.bookedBy}
                          </div>
                        )}
                        
                        {slot.available && (
                          <Button variant="primary" size="sm" className="w-full">
                            Réserver ce créneau
                          </Button>
                        )}
                      </div>
                    ))}
                </div>
                
                {timeSlots.filter(slot => slot.date === selectedDate).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Aucun créneau disponible ce jour
                    </p>
                  </div>
                )}
              </Card>
            )}
          </motion.div>
        )}

        {/* Vue Entretiens */}
        {activeView === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Filtres */}
            <Card padding="md">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Rechercher entretiens..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="all">Tous statuts</option>
                    <option value="pending">En attente</option>
                    <option value="confirmed">Confirmé</option>
                    <option value="completed">Terminé</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>
            </Card>

            {/* Liste entretiens */}
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <Card key={booking.id} padding="md" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {booking.candidateName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {booking.candidateName}
                          </h3>
                          
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(booking.status)}
                            <Badge variant={
                              booking.status === 'confirmed' ? 'success' :
                              booking.status === 'pending' ? 'warning' :
                              booking.status === 'cancelled' ? 'error' :
                              booking.status === 'completed' ? 'info' : 'secondary'
                            } size="sm">
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div className={`p-1 rounded ${
                            booking.interviewType === 'video' ? 'bg-blue-100 text-blue-600' :
                            booking.interviewType === 'phone' ? 'bg-green-100 text-green-600' :
                            'bg-purple-100 text-purple-600'
                          }`}>
                            {getInterviewTypeIcon(booking.interviewType)}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          📋 {booking.jobTitle}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {new Date(booking.timeSlot.date).toLocaleDateString('fr-FR')}</span>
                          <span>🕐 {booking.timeSlot.startTime} - {booking.timeSlot.endTime}</span>
                          <span>👤 {booking.interviewers.map(i => i.name).join(', ')}</span>
                        </div>
                        
                        {booking.meetingLink && booking.interviewType === 'video' && (
                          <div className="mt-2">
                            <a
                              href={booking.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                            >
                              <Video className="w-4 h-4" />
                              <span>Rejoindre la réunion</span>
                            </a>
                          </div>
                        )}
                        
                        {booking.location && booking.interviewType === 'onsite' && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{booking.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {booking.status === 'pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => confirmBooking(booking.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendReminder(booking.id)}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setIsBookingModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Agenda entretien */}
                  {booking.agenda && booking.agenda.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Agenda</h4>
                      <div className="space-y-2">
                        {booking.agenda.map(item => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                            <div>
                              <div className="font-medium text-sm">{item.title}</div>
                              <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.duration}min
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {filteredBookings.length === 0 && (
              <Card padding="lg">
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                    Aucun entretien trouvé
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Les entretiens planifiés apparaîtront ici
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Vue Disponibilités */}
        {activeView === 'availability' && (
          <motion.div
            key="availability"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Équipe d'interviewers */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Équipe d'entretiens
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {interviewers.map(interviewer => (
                  <div key={interviewer.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {interviewer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {interviewer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {interviewer.role} • {interviewer.department}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Entretiens/jour max:</span>
                        <span className="font-medium">{interviewer.maxInterviewsPerDay}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Créneaux cette semaine:</span>
                        <span className="font-medium text-green-600">
                          {timeSlots.filter(slot => 
                            slot.interviewerId === interviewer.id && 
                            slot.available
                          ).length} libres
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-gray-500 mb-1">Compétences:</div>
                      <div className="flex flex-wrap gap-1">
                        {interviewer.skills.slice(0, 3).map(skill => (
                          <Badge key={skill} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                        {interviewer.skills.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{interviewer.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex space-x-2">
                      <Button variant="ghost" size="sm" className="flex-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Planning
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Statistiques équipe */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card padding="md" className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalBookings}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total entretiens</div>
                </Card>
                
                <Card padding="md" className="text-center">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.completedInterviews}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Terminés</div>
                </Card>
                
                <Card padding="md" className="text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageBookingTime}h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Délai moyen</div>
                </Card>
                
                <Card padding="md" className="text-center">
                  <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-yellow-600" />
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.pendingConfirmations}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">En attente</div>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* Vue Paramètres */}
        {activeView === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Paramètres de planification
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Confirmation automatique
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Confirmer automatiquement les réservations
                    </div>
                  </div>
                  <Toggle
                    checked={autoConfirm}
                    onChange={setAutoConfirm}
                  />
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">
                    Intégrations calendrier
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Google Calendar</div>
                          <div className="text-sm text-gray-500">Synchronisation bidirectionnelle</div>
                        </div>
                      </div>
                      <Badge variant="success">Connecté</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Outlook Calendar</div>
                          <div className="text-sm text-gray-500">Import/export événements</div>
                        </div>
                      </div>
                      <Badge variant="warning">Configuration requise</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="font-medium text-gray-900 dark:text-white mb-2">
                    Paramètres par défaut
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Durée entretien par défaut
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60" selected>60 minutes</option>
                        <option value="90">90 minutes</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Buffer entre entretiens
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                        <option value="0">0 minutes</option>
                        <option value="15" selected>15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">60 minutes</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { SchedulingAssistant };