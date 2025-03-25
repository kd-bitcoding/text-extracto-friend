
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import ChatInterface from "@/components/chat/ChatInterface";
import { useToast } from "@/hooks/use-toast";
import { chatService, ChatSession } from "@/services/chatService";
import { Loader2 } from "lucide-react";

const Chat: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract session ID from URL query parameters
    const params = new URLSearchParams(location.search);
    const sessionParam = params.get('session');
    
    if (sessionParam) {
      setSessionId(sessionParam);
      fetchChatSession(sessionParam);
    }
  }, [location.search]);

  const fetchChatSession = async (id: string) => {
    setIsLoading(true);
    try {
      const sessionData = await chatService.getSession(id);
      if (sessionData) {
        setSession(sessionData);
        toast({
          title: "Chat session loaded",
          description: `Loaded "${sessionData.title}"`,
        });
      } else {
        toast({
          title: "Session not found",
          description: "The requested chat session could not be found",
          variant: "destructive",
        });
        navigate('/history');
      }
    } catch (error) {
      toast({
        title: "Error loading session",
        description: "Failed to load the chat session",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state if auth is still being determined
  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {session ? session.title : "Text Analysis Chat"}
            </h1>
            <p className="text-muted-foreground">
              Ask questions and get insights about your extracted text
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading chat session...</span>
            </div>
          ) : (
            <ChatInterface 
              sessionId={sessionId} 
              initialSession={session}
            />
          )}
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TextExtracto. All rights reserved.
      </footer>
    </div>
  );
};

export default Chat;
