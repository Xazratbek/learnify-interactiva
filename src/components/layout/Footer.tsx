
import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/40 bg-background py-8">
      <div className="container flex flex-col gap-6 md:gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">AI Tutor</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 text-sm text-foreground/70">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-foreground/70 hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
        
        <div className="text-xs text-foreground/60 text-center md:text-left">
          &copy; {new Date().getFullYear()} AI Tutor. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
