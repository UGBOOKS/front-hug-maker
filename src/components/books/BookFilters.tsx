import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { X, SlidersHorizontal } from 'lucide-react';
import { BookFilter, BOOK_CATEGORIES, BOOK_CONDITIONS } from '@/types/book';

interface BookFiltersProps {
  filters: BookFilter;
  onFilterChange: (filters: BookFilter) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const BookFilters = ({ filters, onFilterChange, onClearFilters, isMobile = false }: BookFiltersProps) => {
  const hasActiveFilters = 
    filters.category !== '' || 
    filters.condition !== '' || 
    filters.priceMin !== null || 
    filters.priceMax !== null;

  const updateFilter = <K extends keyof BookFilter>(key: K, value: BookFilter[K]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className={`space-y-6 ${isMobile ? '' : 'sticky top-24'}`}>
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-semibold text-lg flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          Filters
        </h2>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['category', 'condition', 'price']} className="w-full">
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {BOOK_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={filters.category === category}
                    onCheckedChange={(checked) => 
                      updateFilter('category', checked ? category : '')
                    }
                  />
                  <Label 
                    htmlFor={`category-${category}`} 
                    className="text-sm cursor-pointer"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition Filter */}
        <AccordionItem value="condition">
          <AccordionTrigger className="text-sm font-medium">Condition</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {BOOK_CONDITIONS.map(({ value, label, description }) => (
                <div key={value} className="flex items-start space-x-2">
                  <Checkbox
                    id={`condition-${value}`}
                    checked={filters.condition === value}
                    onCheckedChange={(checked) => 
                      updateFilter('condition', checked ? value : '')
                    }
                    className="mt-0.5"
                  />
                  <div>
                    <Label 
                      htmlFor={`condition-${value}`} 
                      className="text-sm cursor-pointer"
                    >
                      {label}
                    </Label>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range (GHS)</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters.priceMin ?? ''}
                onChange={(e) => 
                  updateFilter('priceMin', e.target.value ? Number(e.target.value) : null)
                }
                className="w-full"
              />
              <span className="text-muted-foreground">-</span>
              <Input
                type="number"
                placeholder="Max"
                value={filters.priceMax ?? ''}
                onChange={(e) => 
                  updateFilter('priceMax', e.target.value ? Number(e.target.value) : null)
                }
                className="w-full"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sort By</Label>
        <Select 
          value={filters.sortBy} 
          onValueChange={(value) => updateFilter('sortBy', value as BookFilter['sortBy'])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BookFilters;
