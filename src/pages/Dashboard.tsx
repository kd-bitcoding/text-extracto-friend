
import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import ImageUploader from "@/components/dashboard/ImageUploader";
import { useToast } from "@/hooks/use-toast";
import { chatService } from "@/services/chatService";

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Show loading state if auth is still being determined
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleExtractionComplete = async (result: {
    imageUrl: string;
    extractedText: string;
    title: string;
  }) => {
    try {
      setIsProcessing(true);
      
      // Create a new chat session with the extracted text
      const session = await chatService.createSession(
        result.title,
        result.extractedText,
        result.imageUrl
      );
      
      // Add a system message explaining what was extracted
      await chatService.addMessage(
        session.id,
        `I've extracted the text from your image. You can now ask me questions about it.`,
        'assistant'
      );
      
      toast({
        title: "Text Extracted Successfully",
        description: "Your image has been processed and a new chat session created.",
      });
      
      // Redirect to the chat page with the new session
      navigate(`/chat?session=${session.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Upload an image to extract text and start a conversation
            </p>
          </div>
          
          <ImageUploader onExtractComplete={handleExtractionComplete} />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TextExtracto. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
