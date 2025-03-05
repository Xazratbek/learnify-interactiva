
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, Sparkles, Menu } from 'lucide-react';
import { 
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';

const Header: React.FC = () => {
  const isMobile = useIsMobile();
  
  const MenuItems = () => (
    <>
      <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
        Home
      </Link>
      <Link to="/topics" className="text-foreground/80 hover:text-foreground transition-colors">
        Browse Topics
      </Link>
      <Link to="/my-lessons" className="text-foreground/80 hover:text-foreground transition-colors">
        My Lessons
      </Link>
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
          <Avatar className="h-8 w-8 transition-transform hover:scale-105">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-primary/10 text-primary">AI</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
