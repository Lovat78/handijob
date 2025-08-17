// src/services/authService.ts
import { AuthResponse, LoginCredentials, RegisterData, User, Company } from '@/types';

// Mock data pour démonstration - FORCE CANDIDAT VISIBLE
const MOCK_USERS: (User & { password: string })[] = [
  {  
    id: 'user-2',
    email: 'ahmed.benali@example.fr',
    password: 'password123',
    role: 'candidate',
    firstName: 'Ahmed',
    lastName: 'Benali',
    avatar: undefined,
    isActive: true,
    createdAt: '2024-01-10T14:20:00Z',
    lastLoginAt: new Date().toISOString()
  },
  {
    id: 'user-1',
    email: 'marie.dubois@techcorp.fr',
    password: 'password123',
    role: 'company',
    firstName: 'Marie',
    lastName: 'Dubois',
    avatar: undefined,
    isActive: true,
    createdAt: '2024-01-15T08:00:00Z',
    lastLoginAt: '2024-01-20T10:30:00Z'
  },
  {
    id: 'user-3',
    email: 'pierre@handijobs.fr',
    password: 'pierre123',
    role: 'candidate',
    firstName: 'Pierre',
    lastName: 'Chef de Projet',
    avatar: undefined,
    isActive: true,
    createdAt: '2024-01-10T14:20:00Z',
    lastLoginAt: '2024-01-20T16:45:00Z'
  },
  {
    id: 'user-4',
    email: 'admin@handijobs.fr',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'System',
    avatar: undefined,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-20T09:15:00Z'
  }
];

const MOCK_COMPANIES: Company[] = [
  {
    id: 'company-1',
    userId: 'user-1',
    name: 'TechCorp Innovation',
    description: 'Entreprise leader dans le développement de solutions technologiques inclusives.',
    website: 'https://techcorp-innovation.fr',
    email: 'contact@techcorp.fr',
    phone: '+33 1 23 45 67 89',
    logo: undefined,
    industry: 'Technologie',
    size: '51-200',
    foundedYear: 2015,
    address: {
      street: '123 Avenue de la Innovation',
      city: 'Paris',
      zipCode: '75001',
      country: 'France'
    },
    values: ['Innovation', 'Inclusion', 'Excellence'],
    benefits: ['Télétravail flexible', 'Formation continue', 'Accessibilité renforcée'],
    accessibilityCommitment: 'Engagement fort pour l\'inclusion des personnes en situation de handicap',
    oethStatus: true,
    oethRate: 8.5,
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  }
];

// Simulation d'une API avec délais
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class AuthService {
  private tokenKey = 'auth-token';

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🔐 AuthService.login called with:', credentials.email);
    await delay(800);

    const user = MOCK_USERS.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );

    console.log('👤 User found:', user ? `${user.firstName} ${user.lastName} (${user.role})` : 'NONE');

    if (!user) {
      throw new Error('Identifiants invalides');
    }

    const company = user.role === 'company' 
      ? MOCK_COMPANIES.find(c => c.userId === user.id)
      : undefined;

    const token = this.generateToken(user.id);
    
    // Update last login
    user.lastLoginAt = new Date().toISOString();

    const { password, ...userWithoutPassword } = user;
    
    console.log('✅ Login success for:', userWithoutPassword.role, userWithoutPassword.email);

    return {
      user: userWithoutPassword,
      company,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('Un compte avec cet email existe déjà');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email: data.email,
      role: data.role,
      firstName: data.firstName,
      lastName: data.lastName,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // Create company if user is company type
    let company: Company | undefined;
    if (data.role === 'company' && data.companyName) {
      company = {
        id: `company-${Date.now()}`,
        userId: newUser.id,
        name: data.companyName,
        industry: data.companyIndustry || 'Non spécifié',
        size: (data.companySize as any) || '1-10',
        address: {
          street: '',
          city: '',
          zipCode: '',
          country: 'France'
        },
        oethStatus: false,
        oethRate: 0,
        createdAt: new Date().toISOString()
      };
    }

    const token = this.generateToken(newUser.id);

    return {
      user: newUser,
      company,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  async logout(): Promise<void> {
    await delay(300);
    // In a real app, invalidate token on server
    localStorage.removeItem(this.tokenKey);
  }

  async getCurrentUser(): Promise<User | null> {
    console.log('👤 AuthService.getCurrentUser called');
    await delay(200); // Shorter delay for better UX

    const token = localStorage.getItem(this.tokenKey);
    console.log('🎫 Token found:', !!token);
    
    if (!token) {
      console.log('❌ No token found');
      return null;
    }

    try {
      const userId = this.parseToken(token);
      console.log('🔍 Looking for user ID:', userId);
      
      const user = MOCK_USERS.find(u => u.id === userId);
      
      if (!user) {
        console.log('❌ User not found for ID:', userId);
        return null;
      }

      const { password, ...userWithoutPassword } = user;
      console.log('✅ Current user found:', userWithoutPassword.role, userWithoutPassword.email);
      
      return userWithoutPassword;
    } catch (error) {
      console.log('❌ Token parse error:', error);
      return null;
    }
  }

  async refreshToken(): Promise<string> {
    await delay(300);
    
    const currentToken = localStorage.getItem(this.tokenKey);
    if (!currentToken) {
      throw new Error('No token to refresh');
    }

    const userId = this.parseToken(currentToken);
    return this.generateToken(userId);
  }

  private generateToken(userId: string): string {
    // In a real app, this would be a JWT from the server
    return btoa(JSON.stringify({
      userId,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24h
    }));
  }

  private parseToken(token: string): string {
    try {
      const decoded = JSON.parse(atob(token));
      
      // Check if token is expired
      if (decoded.exp < Date.now()) {
        throw new Error('Token expired');
      }
      
      return decoded.userId;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

export const authService = new AuthService();