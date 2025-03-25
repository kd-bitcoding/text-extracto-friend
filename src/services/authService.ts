
// Authentication service using localStorage

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupData extends AuthCredentials {
  name: string;
}

class AuthService {
  private readonly STORAGE_KEY = 'auth_user';
  private readonly USERS_KEY = 'auth_users';

  constructor() {
    // Initialize users array if it doesn't exist
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  // Login user
  async login(credentials: AuthCredentials): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = this.getUsers();
    const user = users.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // In a real app, we would check password hash
    // Here we're just simulating authentication
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    return user;
  }

  // Register new user
  async signup(data: SignupData): Promise<User> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email === data.email)) {
      throw new Error('User already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      createdAt: new Date().toISOString(),
    };
    
    // Save to "database"
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    // Set as current user
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    
    return newUser;
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Private method to get all users
  private getUsers(): User[] {
    const usersData = localStorage.getItem(this.USERS_KEY);
    return usersData ? JSON.parse(usersData) : [];
  }
}

export const authService = new AuthService();
