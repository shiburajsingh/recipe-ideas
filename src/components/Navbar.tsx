import { Link, useLocation } from 'react-router-dom';
import { ChefHat, Heart, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-primary hover:text-primary-glow transition-colors"
          >
            <ChefHat className="h-6 w-6" />
            Recipe Ideas
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              asChild
              className="gap-2"
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Link>
            </Button>
            
            <Button
              variant={location.pathname === '/favorites' ? 'default' : 'ghost'}
              asChild
              className="gap-2"
            >
              <Link to="/favorites">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};