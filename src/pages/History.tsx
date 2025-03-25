
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MessageSquare, Trash2, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  {
    id: "4",
    title: "Product Invoice",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    messageCount: 7,
    lastMessage: "Can you list all the items on this invoice?",
  },
  {
    id: "5",
    title: "Train Ticket",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    messageCount: 4,
    lastMessage: "What's the departure time for this train?",
  },
];

const History: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sessions, setSessions] = useState(mockChatSessions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 6;

  // Show loading state if auth is still being determined
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Paginate sessions
  const indexOfLastSession = currentPage * sessionsPerPage;
  const indexOfFirstSession = indexOfLastSession - sessionsPerPage;
  const currentSessions = filteredSessions.slice(indexOfFirstSession, indexOfLastSession);
  const totalPages = Math.ceil(filteredSessions.length / sessionsPerPage);

  const handleContinueChat = (sessionId: string) => {
    // In a real app, this would load the chat session data
    navigate(`/chat?session=${sessionId}`);
    toast({
      title: "Loading chat session",
      description: "Retrieving your conversation...",
    });
  };

  const handleDeleteChat = (sessionId: string) => {
    // Filter out the deleted session
    setSessions(sessions.filter(session => session.id !== sessionId));
    setSessionToDelete(null);
    
    toast({
      title: "Chat session deleted",
      description: "The chat session has been removed from your history.",
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
            <>
              <div className="mb-6">
                <div className="relative w-full max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or message content..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {currentSessions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentSessions.map((session) => (
                    <ChatSessionCard 
                      key={session.id}
                      session={session}
                      onContinue={() => handleContinueChat(session.id)}
                      onDelete={() => setSessionToDelete(session.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <p className="text-muted-foreground mb-4">No matching results found</p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Card className="text-center py-12">
              <CardContent className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-secondary/40 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-xl font-medium mb-2">No chat history</p>
                <p className="text-muted-foreground mb-6">You don't have any chat sessions yet</p>
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
      
      <AlertDialog open={sessionToDelete !== null} onOpenChange={(open) => !open && setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this chat
              session and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => sessionToDelete && handleDeleteChat(sessionToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
