import { useState, useCallback } from 'react';
import { ChefHat, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { Filters, ActiveFilters } from '@/components/Filters';
import { RecipeGrid } from '@/components/RecipeGrid';
import { RecipeModal } from '@/components/RecipeModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { searchRecipesByIngredient, filterRecipes, Recipe } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<ActiveFilters>({
    category: null,
    area: null,
    cookingTime: null,
    diet: null
  });
  const [hasSearched, setHasSearched] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const handleSearch = async (ingredient: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const results = await searchRecipesByIngredient(ingredient);
      setRecipes(results);
      
      // Apply current filters to new results
      const filtered = filterRecipes(results, currentFilters);
      setFilteredRecipes(filtered);
      
      if (results.length === 0) {
        toast({
          title: "No recipes found",
          description: `We couldn't find any recipes with "${ingredient}". Try a different ingredient!`,
        });
      } else {
        toast({
          title: "Recipes found!",
          description: `Found ${results.length} recipe${results.length !== 1 ? 's' : ''} with "${ingredient}"`,
        });
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = useCallback((filters: ActiveFilters) => {
    setCurrentFilters(filters);
    const filtered = filterRecipes(recipes, filters);
    setFilteredRecipes(filtered);
  }, [recipes]);

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-glow to-accent text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ChefHat className="h-12 w-12" />
              <Sparkles className="h-8 w-8 text-accent-light" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing
              <span className="block text-accent-light">Recipe Ideas</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Search thousands of recipes by ingredient and create delicious meals
            </p>
            
            <div className="mb-8">
              <SearchBar 
                onSearch={handleSearch} 
                isLoading={isLoading}
                placeholder="What ingredient do you have? (e.g., chicken, tomato, pasta)"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {hasSearched && (
          <>
            {/* Filters */}
            <Filters 
              onFiltersChange={handleFiltersChange}
              className="mb-8"
            />

            {/* Results Header */}
            {!isLoading && (
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Recipe Results
                  </h2>
                  <p className="text-muted-foreground">
                    Showing {filteredRecipes.length} of {recipes.length} recipes
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-12">
            <LoadingSpinner size="lg" text="Searching for delicious recipes..." />
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && hasSearched && (
          <RecipeGrid
            recipes={filteredRecipes}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Welcome State */}
        {!hasSearched && !isLoading && (
          <section className="py-16 text-center">
            <ChefHat className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Ready to Cook?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Enter any ingredient above to discover hundreds of amazing recipes. 
              From quick weeknight dinners to weekend feasts, we've got you covered!
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { ingredient: 'Chicken', emoji: '🐔' },
                { ingredient: 'Pork', emoji: '🥓' },
                { ingredient: 'Cheese', emoji: '🧀' },
                { ingredient: 'Rice', emoji: '🍚' }
              ].map(({ ingredient, emoji }) => (
                <Button
                  key={ingredient}
                  variant="outline"
                  onClick={() => handleSearch(ingredient.toLowerCase())}
                  className="h-20 flex-col gap-2 text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="text-2xl">{emoji}</span>
                  {ingredient}
                </Button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isModalOpen}
        onClose={closeModal}
        isFavorite={selectedRecipe ? isFavorite(selectedRecipe) : false}
        onToggleFavorite={toggleFavorite}
      />
    </>
  );
};

export default Index;