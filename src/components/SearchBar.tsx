import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  onSearch: (ingredient: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, isLoading = false, placeholder = "Enter an ingredient (e.g., chicken, tomato, rice)..." }: SearchBarProps) => {
  const [ingredient, setIngredient] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      onSearch(ingredient.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-24 h-12 text-base bg-card text-foreground border-2 border-border focus:border-primary transition-colors"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !ingredient.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 px-4"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      
      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-muted-foreground">Popular:</span>
        {['chicken', 'beef', 'pasta', 'rice', 'tomato', 'cheese'].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            onClick={() => {
              setIngredient(suggestion);
              onSearch(suggestion);
            }}
            disabled={isLoading}
            className="text-xs capitalize text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};