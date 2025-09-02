import { useState, useEffect } from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeModal } from '@/components/RecipeModal';
import { useFavorites } from '@/hooks/useFavorites';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

const Favorites = () => {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
              <Link to="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 fill-current" />
            <h1 className="text-3xl md:text-4xl font-bold">My Favorite Recipes</h1>
          </div>
          <p className="text-lg opacity-90 mt-2">
            {favorites.length} saved recipe{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-muted-foreground mb-6">
              Start exploring recipes and save your favorites by clicking the heart icon!
            </p>
            <Button asChild>
              <Link to="/">Discover Recipes</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((recipe) => (
              <div key={recipe.idMeal} className="fade-in">
                <RecipeCard
                  recipe={recipe}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
};

export default Favorites;