import { Heart, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite: (recipe: Recipe) => void;
  onViewDetails: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, isFavorite = false, onToggleFavorite, onViewDetails }: RecipeCardProps) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  // Simulate cooking time based on recipe name length and complexity indicators
  const getCookingTime = () => {
    const complexityWords = ['stuffed', 'marinated', 'slow', 'braised', 'roasted'];
    const isComplex = complexityWords.some(word => 
      recipe.strMeal.toLowerCase().includes(word)
    );
    
    if (isComplex || recipe.strMeal.length > 25) return '45+ min';
    if (recipe.strMeal.length > 15) return '30 min';
    return '15 min';
  };

  const cookingTime = getCookingTime();

  return (
    <Card 
      className="group cursor-pointer recipe-card-hover border-0 shadow-md hover:shadow-xl bg-card"
      onClick={() => onViewDetails(recipe)}
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white ${
            isFavorite ? 'text-recipe-favorite' : 'text-muted-foreground hover:text-recipe-favorite'
          }`}
          onClick={handleFavoriteClick}
        >
          <Heart 
            className={`h-4 w-4 ${isFavorite ? 'fill-current favorite-bounce' : ''}`}
          />
        </Button>

        {/* Category badge */}
        {recipe.strCategory && (
          <Badge 
            variant="secondary" 
            className="absolute top-2 left-2 bg-primary/90 text-primary-foreground hover:bg-primary"
          >
            {recipe.strCategory}
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-card-foreground group-hover:text-primary transition-colors">
          {recipe.strMeal}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{cookingTime}</span>
          </div>
          
          {recipe.strArea && (
            <Badge variant="outline" className="text-xs">
              {recipe.strArea}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};