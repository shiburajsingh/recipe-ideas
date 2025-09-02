import { Recipe } from '@/utils/api';
import { RecipeCard } from './RecipeCard';

interface RecipeGridProps {
  recipes: Recipe[];
  favorites: Recipe[];
  onToggleFavorite: (recipe: Recipe) => void;
  onViewDetails: (recipe: Recipe) => void;
}

export const RecipeGrid = ({ 
  recipes, 
  favorites, 
  onToggleFavorite, 
  onViewDetails 
}: RecipeGridProps) => {
  const isFavorite = (recipe: Recipe) => {
    return favorites.some(fav => fav.idMeal === recipe.idMeal);
  };

  if (recipes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">No recipes found. Try a different ingredient!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe, index) => (
        <div key={recipe.idMeal} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <RecipeCard
            recipe={recipe}
            isFavorite={isFavorite(recipe)}
            onToggleFavorite={onToggleFavorite}
            onViewDetails={onViewDetails}
          />
        </div>
      ))}
    </div>
  );
};