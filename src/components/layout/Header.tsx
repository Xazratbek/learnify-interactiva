
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, LogIn, LogOut, User, MessageCircle } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const Header = () => {
  const { user, signOut } = useAuth();
  const isMobile = useMobile();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error(error);
    }
  };
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold inline-block">EduLearn</span>
          </Link>
          
          {!isMobile && (
            <nav className="flex gap-6">
              <Link to="/" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
                Home
              </Link>
              {user && (
                <Link to="/chat" className="flex items-center text-lg font-medium transition-colors hover:text-primary">
                  <MessageCircle className="mr-1 h-4 w-4" />
                  AI Chat
                </Link>
              )}
            </nav>
          )}
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <div className="px-7">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-bold">EduLearn</span>
                </Link>
              </div>
              <nav className="flex flex-col gap-4 mt-10">
                <Link to="/" className="px-7 py-2 text-lg font-medium hover:text-primary">
                  Home
                </Link>
                {user && (
                  <Link to="/chat" className="px-7 py-2 text-lg font-medium hover:text-primary flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    AI Chat
                  </Link>
                )}
              </nav>
              <div className="mt-auto px-7 py-4">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                      Signed in as <span className="font-medium text-foreground">{user.email}</span>
                    </p>
                    <Button variant="outline" className="w-full justify-start" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild>
                      <Link to="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign in
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/signup">
                        <User className="mr-2 h-4 w-4" />
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">
                    <User className="mr-2 h-4 w-4" />
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
