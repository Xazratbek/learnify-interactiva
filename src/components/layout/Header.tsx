
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, Sparkles, Menu, LogOut, User } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const getUserInitials = () => {
    if (profile?.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'AI';
  };
  
  const MenuItems = () => (
    <>
      <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
        Home
      </Link>
      <Link to="/topics" className="text-foreground/80 hover:text-foreground transition-colors">
        Browse Topics
      </Link>
      {user && (
        <Link to="/my-lessons" className="text-foreground/80 hover:text-foreground transition-colors">
          My Lessons
        </Link>
      )}
      <Link to="/about" className="text-foreground/80 hover:text-foreground transition-colors">
        About
      </Link>
    </>
  );
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 font-medium transition-colors hover:text-foreground/80"
          >
            <Book className="h-5 w-5 text-primary" />
            <span className="text-xl font-semibold">AI Tutor</span>
          </Link>
        </div>
        
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                <MenuItems />
                {!user && (
                  <>
                    <Link 
                      to="/login" 
                      className="text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/signup" 
                      className="text-foreground/80 hover:text-foreground transition-colors"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                {user && (
                  <Button 
                    variant="outline" 
                    className="justify-start px-2" 
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-6">
            <MenuItems />
          </nav>
        )}
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Upgrade</span>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 transition-transform hover:scale-105 cursor-pointer">
                  <AvatarImage src="" alt={profile?.username || user.email || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/my-lessons')}>
                  <Book className="mr-2 h-4 w-4" />My Lessons
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
