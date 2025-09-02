import { useState, useEffect } from 'react';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

const FAVORITES_KEY = 'recipe-favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Recipe[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsedFavorites = JSON.parse(stored);
        setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const isCurrentlyFavorite = prev.some(fav => fav.idMeal === recipe.idMeal);
      
      if (isCurrentlyFavorite) {
        // Remove from favorites
        return prev.filter(fav => fav.idMeal !== recipe.idMeal);
      } else {
        // Add to favorites
        return [...prev, recipe];
      }
    });
  };

  const isFavorite = (recipe: Recipe): boolean => {
    return favorites.some(fav => fav.idMeal === recipe.idMeal);
  };

  const addFavorite = (recipe: Recipe) => {
    if (!isFavorite(recipe)) {
      setFavorites(prev => [...prev, recipe]);
    }
  };

  const removeFavorite = (recipe: Recipe) => {
    setFavorites(prev => prev.filter(fav => fav.idMeal !== recipe.idMeal));
  };

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
  };
};