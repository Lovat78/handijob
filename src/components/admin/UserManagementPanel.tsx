// src/components/admin/UserManagementPanel.tsx
import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  ShieldOff,
  Mail,
  Phone,
  Calendar,
  Eye,
  UserPlus,
  Download,
  Upload,
  Clock
} from 'lucide-react';
import { Card, Button, Badge, Input, Modal } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserRole } from '@/types';

interface CompanyUser extends User {
  department?: string;
  position?: string;
  permissions: Permission[];
  status: 'active' | 'inactive' | 'pending';
  invitedBy?: string;
  invitedAt?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'jobs' | 'candidates' | 'analytics' | 'admin';
}

// Permissions disponibles
const availablePermissions: Permission[] = [
  {
    id: 'jobs_create',
    name: 'Créer des offres',
    description: 'Peut créer et publier des offres d\'emploi',
    category: 'jobs'
  },
  {
    id: 'jobs_edit',
    name: 'Modifier des offres',
    description: 'Peut modifier les offres existantes',
    category: 'jobs'
  },
  {
    id: 'jobs_delete',
    name: 'Supprimer des offres',
    description: 'Peut supprimer des offres d\'emploi',
    category: 'jobs'
  },
  {
    id: 'candidates_view',
    name: 'Voir les candidats',
    description: 'Peut accéder aux profils candidats',
    category: 'candidates'
  },
  {
    id: 'candidates_contact',
    name: 'Contacter les candidats',
    description: 'Peut envoyer des messages aux candidats',
    category: 'candidates'
  },
  {
    id: 'analytics_view',
    name: 'Voir les analytics',
    description: 'Peut accéder aux rapports et statistiques',
    category: 'analytics'
  },
  {
    id: 'analytics_export',
    name: 'Exporter les données',
    description: 'Peut exporter les rapports et données',
    category: 'analytics'
  },
  {
    id: 'admin_users',
    name: 'Gérer les utilisateurs',
    description: 'Peut inviter et gérer les utilisateurs',
    category: 'admin'
  }
];

// Données mockées
const mockUsers: CompanyUser[] = [
  {
    id: '1',
    email: 'marie.dubois@techcorp.fr',
    role: 'company',
    firstName: 'Marie',
    lastName: 'Dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b193?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-01-15',
    lastLoginAt: '2024-08-10',
    department: 'RH',
    position: 'Responsable Recrutement',
    permissions: availablePermissions.slice(0, 6),
    status: 'active',
    invitedBy: 'admin'
  },
  {
    id: '2',
    email: 'pierre.martin@techcorp.fr',
    role: 'company',
    firstName: 'Pierre',
    lastName: 'Martin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    isActive: true,
    createdAt: '2024-02-01',
    lastLoginAt: '2024-08-09',
    department: 'RH',
    position: 'Chargé de Recrutement',
    permissions: availablePermissions.slice(0, 4),
    status: 'active',
    invitedBy: 'marie.dubois@techcorp.fr'
  },
  {
    id: '3',
    email: 'sophie.bernard@techcorp.fr',
    role: 'company',
    firstName: 'Sophie',
    lastName: 'Bernard',
    isActive: false,
    createdAt: '2024-07-20',
    department: 'Direction',
    position: 'Directrice RH',
    permissions: availablePermissions,
    status: 'pending',
    invitedBy: 'marie.dubois@techcorp.fr',
    invitedAt: '2024-07-20'
  }
];

const StatusBadge: React.FC<{ status: CompanyUser['status'] }> = ({ status }) => {
  const variants = {
    active: { variant: 'success' as const, label: 'Actif' },
    inactive: { variant: 'error' as const, label: 'Inactif' },
    pending: { variant: 'warning' as const, label: 'En attente' }
  };

  const config = variants[status];

  return (
    <Badge variant={config.variant} size="sm">
      {config.label}
    </Badge>
  );
};

const PermissionBadge: React.FC<{ permission: Permission }> = ({ permission }) => {
  const categoryColors = {
    jobs: 'bg-blue-100 text-blue-800',
    candidates: 'bg-green-100 text-green-800',
    analytics: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[permission.category]}`}>
      {permission.name}
    </span>
  );
};

const UserCard: React.FC<{
  user: CompanyUser;
  onEdit: (user: CompanyUser) => void;
  onDelete: (userId: string) => void;
  onToggleStatus: (userId: string) => void;
}> = ({ user, onEdit, onDelete, onToggleStatus }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <Card padding="md" hoverable>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-full h-full object-cover" />
            ) : (
              <Users className="w-6 h-6 text-gray-500" />
            )}
          </div>

          {/* Infos utilisateur */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {user.firstName} {user.lastName}
              </h3>
              <StatusBadge status={user.status} />
            </div>

            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span className="truncate">{user.email}</span>
              </div>
              
              {user.department && (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>{user.department} - {user.position}</span>
                </div>
              )}

              {user.lastLoginAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Dernière connexion: {new Date(user.lastLoginAt).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>

            {/* Permissions */}
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {user.permissions.slice(0, 3).map((permission) => (
                  <PermissionBadge key={permission.id} permission={permission} />
                ))}
                {user.permissions.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{user.permissions.length - 3} autres
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowActions(!showActions)}
          >
            <MoreVertical className="w-4 h-4" />
          </Button>

          <AnimatePresence>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 py-1 min-w-[160px]"
                onMouseLeave={() => setShowActions(false)}
              >
                <button
                  onClick={() => {
                    onEdit(user);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
                
                <button
                  onClick={() => {
                    onToggleStatus(user.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  {user.status === 'active' ? (
                    <>
                      <ShieldOff className="w-4 h-4" />
                      Désactiver
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      Activer
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onDelete(user.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-error-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
};

const InviteUserModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onInvite: (data: any) => void;
}> = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    department: '',
    position: '',
    permissions: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      department: '',
      position: '',
      permissions: []
    });
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Inviter un utilisateur">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Prénom"
            value={formData.firstName}
            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
            required
          />
          <Input
            label="Nom"
            value={formData.lastName}
            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Département"
            value={formData.department}
            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
          />
          <Input
            label="Poste"
            value={formData.position}
            onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Permissions
          </label>
          <div className="space-y-3">
            {Object.entries(
              availablePermissions.reduce((acc, permission) => {
                if (!acc[permission.category]) acc[permission.category] = [];
                acc[permission.category].push(permission);
                return acc;
              }, {} as Record<string, Permission[]>)
            ).map(([category, permissions]) => (
              <div key={category} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize">
                  {category}
                </h4>
                <div className="space-y-2">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => togglePermission(permission.id)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {permission.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {permission.description}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Envoyer l'invitation
          </Button>
        </div>
      </form>
    </Modal>
  );
};

const UserManagementPanel: React.FC = () => {
  const { company } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<CompanyUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'pending'>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleInviteUser = async (userData: any) => {
    const newUser: CompanyUser = {
      id: Date.now().toString(),
      email: userData.email,
      role: 'company',
      firstName: userData.firstName,
      lastName: userData.lastName,
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0],
      department: userData.department,
      position: userData.position,
      permissions: availablePermissions.filter(p => userData.permissions.includes(p.id)),
      status: 'pending',
      invitedBy: company?.email,
      invitedAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);
    setShowInviteModal(false);
    toast.success('Invitation envoyée', `Une invitation a été envoyée à ${userData.email}`);
  };

  const handleEditUser = (user: CompanyUser) => {
    console.log('Edit user:', user);
    toast.info('Fonctionnalité en cours', 'L\'édition des utilisateurs sera bientôt disponible');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('Utilisateur supprimé', 'L\'utilisateur a été supprimé avec succès');
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as CompanyUser['status'] }
        : user
    ));
    toast.success('Statut modifié', 'Le statut de l\'utilisateur a été mis à jour');
  };

  const activeUsersCount = users.filter(u => u.status === 'active').length;
  const pendingUsersCount = users.filter(u => u.status === 'pending').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Gestion des utilisateurs
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez les accès et permissions de votre équipe
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" size="md">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowInviteModal(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Inviter un utilisateur
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Utilisateurs actifs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{activeUsersCount}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 text-warning-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Invitations en attente</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{pendingUsersCount}</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 text-success-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total utilisateurs</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{users.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card padding="md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, email ou département..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des utilisateurs */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <UserCard
                user={user}
                onEdit={handleEditUser}
                onDelete={handleDeleteUser}
                onToggleStatus={handleToggleStatus}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredUsers.length === 0 && (
          <Card padding="lg">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Aucun utilisateur ne correspond à vos critères'
                  : 'Aucun utilisateur pour le moment'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowInviteModal(true)}
                >
                  Inviter votre premier utilisateur
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Modal d'invitation */}
      <InviteUserModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteUser}
      />
    </motion.div>
  );
};

export { UserManagementPanel };