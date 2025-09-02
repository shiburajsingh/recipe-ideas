import { useEffect, useState } from 'react';
import { X, Heart, Clock, Users, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from './LoadingSpinner';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface DetailedRecipe extends Recipe {
  strInstructions: string;
  strYoutube?: string;
  [key: string]: any; // For ingredient and measure properties
}

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose, isFavorite, onToggleFavorite }: RecipeModalProps) => {
  const [detailedRecipe, setDetailedRecipe] = useState<DetailedRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!recipe || !isOpen) return;

    const fetchRecipeDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipe.idMeal}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipe details');
        }
        
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
          setDetailedRecipe(data.meals[0]);
        } else {
          throw new Error('Recipe not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipe, isOpen]);

  const getIngredients = () => {
    if (!detailedRecipe) return [];
    
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = detailedRecipe[`strIngredient${i}`];
      const measure = detailedRecipe[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          ingredient: ingredient.trim(),
          measure: measure ? measure.trim() : ''
        });
      }
    }
    return ingredients;
  };

  if (!isOpen || !recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-card-foreground">
              {recipe.strMeal}
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(recipe)}
              className={`p-2 ${isFavorite ? 'text-recipe-favorite' : 'text-muted-foreground'}`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="h-[calc(90vh-80px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={onClose} variant="outline">Close</Button>
            </div>
          ) : detailedRecipe ? (
            <div className="p-6">
              {/* Image and basic info */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <img
                    src={detailedRecipe.strMealThumb}
                    alt={detailedRecipe.strMeal}
                    className="w-full h-64 md:h-80 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recipe Info</h3>
                    <div className="space-y-2">
                      {detailedRecipe.strCategory && (
                        <Badge variant="secondary">{detailedRecipe.strCategory}</Badge>
                      )}
                      {detailedRecipe.strArea && (
                        <Badge variant="outline" className="ml-2">{detailedRecipe.strArea} Cuisine</Badge>
                      )}
                    </div>
                  </div>
                  
                  {detailedRecipe.strYoutube && (
                    <Button asChild variant="outline" className="gap-2">
                      <a 
                        href={detailedRecipe.strYoutube} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Watch Video Tutorial
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Ingredients */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {getIngredients().map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <span className="font-medium">{item.measure}</span>
                      <span>{item.ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Instructions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                <div className="prose prose-sm max-w-none">
                  {detailedRecipe.strInstructions.split('\n').map((step, index) => (
                    step.trim() && (
                      <p key={index} className="mb-3 text-muted-foreground leading-relaxed">
                        {step.trim()}
                      </p>
                    )
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </ScrollArea>
      </div>
    </div>
  );
};