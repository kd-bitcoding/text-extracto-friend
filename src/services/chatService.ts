
// Chat history service using localStorage

import { authService } from './authService';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  imageUrl?: string;
  extractedText?: string;
}

class ChatService {
  private readonly SESSIONS_KEY = 'chat_sessions';

  // Get all sessions for current user
  async getSessions(): Promise<ChatSession[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const user = authService.getCurrentUser();
    if (!user) return [];
    
    const sessions = this.getAllSessions();
    return sessions.filter(session => session.userId === user.id)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // Get a specific session
  async getSession(sessionId: string): Promise<ChatSession | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sessions = this.getAllSessions();
    return sessions.find(s => s.id === sessionId) || null;
  }

  // Create a new session
  async createSession(title: string, extractedText?: string, imageUrl?: string): Promise<ChatSession> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = authService.getCurrentUser();
    if (!user) throw new Error('User not authenticated');
    
    const now = new Date().toISOString();
    
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
      messages: [],
      imageUrl,
      extractedText
    };
    
    const sessions = this.getAllSessions();
    sessions.push(newSession);
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    
    return newSession;
  }

  // Add a message to a session
  async addMessage(sessionId: string, content: string, role: 'user' | 'assistant'): Promise<ChatMessage> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      content,
      role,
      timestamp: new Date().toISOString()
    };
    
    sessions[sessionIndex].messages.push(newMessage);
    sessions[sessionIndex].updatedAt = new Date().toISOString();
    
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    return newMessage;
  }

  // Update a session
  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const sessions = this.getAllSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex === -1) {
      throw new Error('Session not found');
    }
    
    const updatedSession = {
      ...sessions[sessionIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    sessions[sessionIndex] = updatedSession;
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
    
    return updatedSession;
  }

  // Delete a session
  async deleteSession(sessionId: string): Promise<void> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const sessions = this.getAllSessions();
    const filteredSessions = sessions.filter(s => s.id !== sessionId);
    
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(filteredSessions));
  }

  // Private method to get all sessions
  private getAllSessions(): ChatSession[] {
    const sessionsData = localStorage.getItem(this.SESSIONS_KEY);
    return sessionsData ? JSON.parse(sessionsData) : [];
  }
}

export const chatService = new ChatService();
