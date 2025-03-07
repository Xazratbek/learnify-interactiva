
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, HomeIcon, SearchIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center animate-ping opacity-30">
              <AlertTriangle className="h-16 w-16 text-amber-500" />
            </div>
            <AlertTriangle className="h-16 w-16 text-amber-500 relative" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <Button 
            variant="default"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => navigate('/')}
          >
            <HomeIcon className="h-4 w-4" />
            Return to Home
          </Button>
          
          <Button 
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={() => navigate('/topics')}
          >
            <SearchIcon className="h-4 w-4" />
            Browse Topics
          </Button>
        </div>
        
        <p className="mt-8 text-sm text-muted-foreground">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
