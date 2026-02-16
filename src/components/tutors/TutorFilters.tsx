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
import { X, SlidersHorizontal, Star } from 'lucide-react';
import { TutorFilter, UG_DEPARTMENTS, TUTOR_SUBJECTS, DAYS_OF_WEEK } from '@/types/tutor';

interface TutorFiltersProps {
  filters: TutorFilter;
  onFilterChange: (filters: TutorFilter) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const TutorFilters = ({ filters, onFilterChange, onClearFilters, isMobile = false }: TutorFiltersProps) => {
  const hasActiveFilters =
    filters.department !== '' ||
    filters.subject !== '' ||
    filters.priceMin !== null ||
    filters.priceMax !== null ||
    filters.minRating !== null ||
    filters.availability !== '';

  const updateFilter = <K extends keyof TutorFilter>(key: K, value: TutorFilter[K]) => {
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

      <Accordion type="multiple" defaultValue={['department', 'subject', 'price', 'rating', 'availability']} className="w-full">
        {/* Department Filter */}
        <AccordionItem value="department">
          <AccordionTrigger className="text-sm font-medium">Department</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {UG_DEPARTMENTS.map((dept) => (
                <div key={dept} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept}`}
                    checked={filters.department === dept}
                    onCheckedChange={(checked) =>
                      updateFilter('department', checked ? dept : '')
                    }
                  />
                  <Label htmlFor={`dept-${dept}`} className="text-sm cursor-pointer">
                    {dept}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Subject Filter */}
        <AccordionItem value="subject">
          <AccordionTrigger className="text-sm font-medium">Subject</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {TUTOR_SUBJECTS.map((subject) => (
                <div key={subject} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subject-${subject}`}
                    checked={filters.subject === subject}
                    onCheckedChange={(checked) =>
                      updateFilter('subject', checked ? subject : '')
                    }
                  />
                  <Label htmlFor={`subject-${subject}`} className="text-sm cursor-pointer">
                    {subject}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range Filter */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range (R/hr)</AccordionTrigger>
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

        {/* Rating Filter */}
        <AccordionItem value="rating">
          <AccordionTrigger className="text-sm font-medium">Minimum Rating</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={filters.minRating === rating}
                    onCheckedChange={(checked) =>
                      updateFilter('minRating', checked ? rating : null)
                    }
                  />
                  <Label htmlFor={`rating-${rating}`} className="text-sm cursor-pointer flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                    {rating}+
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Availability Filter */}
        <AccordionItem value="availability">
          <AccordionTrigger className="text-sm font-medium">Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={filters.availability === day}
                    onCheckedChange={(checked) =>
                      updateFilter('availability', checked ? day : '')
                    }
                  />
                  <Label htmlFor={`day-${day}`} className="text-sm cursor-pointer">
                    {day}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sort By</Label>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => updateFilter('sortBy', value as TutorFilter['sortBy'])}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="most-reviews">Most Reviews</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TutorFilters;
