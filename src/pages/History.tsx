import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Helper function moved outside of components to be accessible to both
const formatDate = (date: Date) => {
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString();
  }
};

// Mock chat session data - would come from API in real app
const mockChatSessions = [
  {
    id: "1",
    title: "Receipt from Restaurant",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    messageCount: 8,
    lastMessage: "What was the total amount on the receipt?",
  },
  {
    id: "2",
    title: "Business Card",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 5,
    lastMessage: "What's the email address on this card?",
  },
  {
    id: "3",
    title: "Meeting Notes",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    messageCount: 12,
    lastMessage: "When is the next meeting scheduled?",
  },
];

const History: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState(mockChatSessions);

  // Show loading state if auth is still being determined
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleContinueChat = (sessionId: string) => {
    // In a real app, this would load the chat session data
    navigate(`/chat?session=${sessionId}`);
  };

  const handleDeleteChat = (sessionId: string) => {
    // Filter out the deleted session
    setSessions(sessions.filter(session => session.id !== sessionId));
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Chat History</h1>
            <p className="text-muted-foreground">
              View and continue your previous conversations
            </p>
          </div>
          
          {sessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <ChatSessionCard 
                  key={session.id}
                  session={session}
                  onContinue={() => handleContinueChat(session.id)}
                  onDelete={() => handleDeleteChat(session.id)}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">You don't have any chat sessions yet</p>
                <Button onClick={() => navigate('/dashboard')}>
                  Upload an Image
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TextExtracto. All rights reserved.
      </footer>
    </div>
  );
};

interface ChatSessionProps {
  session: {
    id: string;
    title: string;
    date: Date;
    messageCount: number;
    lastMessage: string;
  };
  onContinue: () => void;
  onDelete: () => void;
}

const ChatSessionCard: React.FC<ChatSessionProps> = ({ session, onContinue, onDelete }) => {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{session.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <span>{formatDate(session.date)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm mb-2 line-clamp-2 text-muted-foreground flex-1">
          {session.lastMessage}
        </p>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>{session.messageCount} messages</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onContinue}
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default History;
