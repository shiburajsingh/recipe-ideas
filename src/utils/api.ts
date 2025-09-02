// TheMealDB API utilities

export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
}

export interface DetailedRecipe extends Recipe {
  strInstructions: string;
  strYoutube?: string;
  [key: string]: any; // For ingredient and measure properties
}

export interface ApiResponse<T> {
  meals: T[] | null;
}

// Search recipes by ingredient
export const searchRecipesByIngredient = async (ingredient: string): Promise<Recipe[]> => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<Recipe> = await response.json();
    return data.meals || [];
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw new Error('Failed to search recipes. Please try again.');
  }
};

// Get detailed recipe by ID
export const getRecipeById = async (id: string): Promise<DetailedRecipe | null> => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ApiResponse<DetailedRecipe> = await response.json();
    return data.meals ? data.meals[0] : null;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw new Error('Failed to load recipe details. Please try again.');
  }
};

// Get all categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.meals ? data.meals.map((item: any) => item.strCategory) : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get all areas/cuisines
export const getAreas = async (): Promise<string[]> => {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.meals ? data.meals.map((item: any) => item.strArea) : [];
  } catch (error) {
    console.error('Error fetching areas:', error);
    return [];
  }
};

// Filter recipes based on criteria
export const filterRecipes = (
  recipes: Recipe[],
  filters: {
    category?: string | null;
    area?: string | null;
    cookingTime?: string | null;
    diet?: string | null;
  }
): Recipe[] => {
  return recipes.filter((recipe) => {
    // Category filter
    if (filters.category && recipe.strCategory !== filters.category) {
      return false;
    }
    
    // Area filter
    if (filters.area && recipe.strArea !== filters.area) {
      return false;
    }
    
    // Diet filter (basic implementation)
    if (filters.diet) {
      const recipeName = recipe.strMeal.toLowerCase();
      const category = recipe.strCategory?.toLowerCase() || '';
      
      if (filters.diet === 'vegetarian') {
        const meatKeywords = ['beef', 'chicken', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'turkey'];
        const hasMeat = meatKeywords.some(keyword => 
          recipeName.includes(keyword) || category.includes(keyword)
        );
        if (hasMeat && !category.includes('vegetarian')) {
          return false;
        }
      }
      
      if (filters.diet === 'vegan') {
        const nonVeganKeywords = ['beef', 'chicken', 'pork', 'lamb', 'fish', 'salmon', 'tuna', 'shrimp', 'turkey', 'cheese', 'cream', 'milk', 'egg', 'butter'];
        const hasNonVegan = nonVeganKeywords.some(keyword => 
          recipeName.includes(keyword) || category.includes(keyword)
        );
        if (hasNonVegan && !category.includes('vegan')) {
          return false;
        }
      }
    }
    
    // Cooking time filter (simulated based on recipe complexity)
    if (filters.cookingTime) {
      const complexityWords = ['stuffed', 'marinated', 'slow', 'braised', 'roasted'];
      const isComplex = complexityWords.some(word => 
        recipe.strMeal.toLowerCase().includes(word)
      );
      
      const estimatedTime = isComplex || recipe.strMeal.length > 25 ? 'long' :
                           recipe.strMeal.length > 15 ? 'medium' : 'quick';
      
      if (filters.cookingTime !== estimatedTime) {
        return false;
      }
    }
    
    return true;
  });
};