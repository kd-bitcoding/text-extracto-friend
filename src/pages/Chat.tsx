
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import ChatInterface from "@/components/chat/ChatInterface";
import { useToast } from "@/hooks/use-toast";

const Chat: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Extract session ID from URL query parameters
    const params = new URLSearchParams(location.search);
    const session = params.get('session');
    
    if (session) {
      setSessionId(session);
      // In a real app, you would fetch the chat session data here
      toast({
        title: "Chat session loaded",
        description: `Loaded chat session #${session}`,
      });
    }
  }, [location.search, toast]);

  // Show loading state if auth is still being determined
  if (isLoading) {
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Text Analysis Chat</h1>
            <p className="text-muted-foreground">
              Ask questions and get insights about your extracted text
            </p>
          </div>
          
          <ChatInterface sessionId={sessionId} />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TextExtracto. All rights reserved.
      </footer>
    </div>
  );
};

export default Chat;
