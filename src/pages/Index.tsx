
import React from "react";
import AuthForm from "@/components/auth/AuthForm";
import Header from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-16">
        <div className="w-full max-w-screen-xl px-4 md:px-8">
          <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-20 items-center">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                  Extract and Chat with Text from Images
                </h1>
                <p className="text-lg text-muted-foreground">
                  Upload any image with text, extract the content, and engage in an intelligent conversation about it.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6">
                <FeatureCard
                  title="Extract Text"
                  description="Extract text from any image using advanced AI technology"
                />
                <FeatureCard
                  title="Analyze Content"
                  description="Ask questions and get insights about the extracted text"
                />
                <FeatureCard
                  title="Save Conversations"
                  description="All your chat history is saved for future reference"
                />
              </div>
            </div>
            
            <div className="w-full max-w-md lg:max-w-sm">
              <AuthForm />
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground mt-auto">
        &copy; {new Date().getFullYear()} TextExtracto. All rights reserved.
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => {
  return (
    <div className="p-4 rounded-lg bg-secondary/60 border space-y-2">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
