
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, User } from "lucide-react";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass py-4 animate-slide-down">
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight flex items-center"
        >
          <span className="bg-primary rounded-md w-8 h-8 flex items-center justify-center text-white mr-2">T</span>
          TextExtracto
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {isAuthenticated && (
            <>
              <NavLink to="/dashboard" current={location.pathname}>
                Dashboard
              </NavLink>
              <NavLink to="/chat" current={location.pathname}>
                Chats
              </NavLink>
            </>
          )}
        </nav>

        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex text-sm items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                  <User size={16} className="text-muted-foreground" />
                </div>
                <span>{user?.name}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-1.5"
              >
                <LogOut size={14} />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
              >
                <Link to="/?tab=login">Sign In</Link>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                asChild
              >
                <Link to="/?tab=register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// Helper component for nav links
const NavLink: React.FC<{ 
  to: string; 
  current: string; 
  children: React.ReactNode 
}> = ({ to, current, children }) => {
  const isActive = current === to;
  
  return (
    <Link
      to={to}
      className={`relative text-sm transition-colors duration-200 ${
        isActive 
          ? "text-primary font-medium" 
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
      )}
    </Link>
  );
};

export default Header;
