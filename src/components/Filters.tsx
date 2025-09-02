import { useState, useEffect } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FiltersProps {
  onFiltersChange: (filters: ActiveFilters) => void;
  className?: string;
}

export interface ActiveFilters {
  category: string | null;
  area: string | null;
  cookingTime: string | null;
  diet: string | null;
}

const CATEGORIES = [
  'Beef', 'Chicken', 'Dessert', 'Lamb', 'Miscellaneous', 'Pasta', 'Pork', 
  'Seafood', 'Side', 'Starter', 'Vegan', 'Vegetarian', 'Breakfast', 'Goat'
];

const AREAS = [
  'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 
  'Egyptian', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican', 
  'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish', 
  'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Vietnamese'
];

const COOKING_TIMES = [
  { label: 'Quick (15 min)', value: 'quick' },
  { label: 'Medium (30 min)', value: 'medium' },
  { label: 'Long (45+ min)', value: 'long' }
];

const DIET_OPTIONS = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Vegan', value: 'vegan' },
  { label: 'No Restrictions', value: 'none' }
];

export const Filters = ({ onFiltersChange, className }: FiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<ActiveFilters>({
    category: null,
    area: null,
    cookingTime: null,
    diet: null
  });

  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof ActiveFilters, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      category: null,
      area: null,
      cookingTime: null,
      diet: null
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={className}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between mb-4">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </CollapsibleTrigger>
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearAllFilters} className="gap-1 text-muted-foreground">
              <X className="h-3 w-3" />
              Clear all
            </Button>
          )}
        </div>

        <CollapsibleContent>
          <Card>
            <CardContent className="p-4 space-y-6">
              {/* Category Filter */}
              <div>
                <h4 className="font-medium mb-3">Category</h4>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={filters.category === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('category', category)}
                      className="text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <h4 className="font-medium mb-3">Cuisine</h4>
                <div className="flex flex-wrap gap-2">
                  {AREAS.slice(0, 12).map((area) => (
                    <Button
                      key={area}
                      variant={filters.area === area ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('area', area)}
                      className="text-xs"
                    >
                      {area}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Cooking Time Filter */}
              <div>
                <h4 className="font-medium mb-3">Cooking Time</h4>
                <div className="flex flex-wrap gap-2">
                  {COOKING_TIMES.map((time) => (
                    <Button
                      key={time.value}
                      variant={filters.cookingTime === time.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('cookingTime', time.value)}
                      className="text-xs"
                    >
                      {time.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Diet Filter */}
              <div>
                <h4 className="font-medium mb-3">Diet</h4>
                <div className="flex flex-wrap gap-2">
                  {DIET_OPTIONS.map((diet) => (
                    <Button
                      key={diet.value}
                      variant={filters.diet === diet.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateFilter('diet', diet.value)}
                      className="text-xs"
                    >
                      {diet.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};