
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import ImageUploader from "@/components/dashboard/ImageUploader";

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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
            <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Upload an image to extract text and start a conversation
            </p>
          </div>
          
          <ImageUploader />
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} TextExtracto. All rights reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
