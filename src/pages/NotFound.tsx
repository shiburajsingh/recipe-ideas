import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ChefHat, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-8">
          <div className="mb-6">
            <ChefHat className="h-16 w-16 text-primary mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Recipe Not Found</h2>
            <p className="text-muted-foreground">
              Oops! Looks like this recipe has gone missing from our kitchen.
            </p>
          </div>
          
          <div className="space-y-3">
            <Button asChild className="w-full gap-2">
              <a href="/">
                <Home className="h-4 w-4" />
                Back to Recipe Search
              </a>
            </Button>
            
            <Button variant="outline" onClick={() => window.history.back()} className="w-full gap-2">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              Try searching for a delicious ingredient instead!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;