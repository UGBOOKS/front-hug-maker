import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SlidersHorizontal, GraduationCap, Users, Award } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TutorCard from '@/components/tutors/TutorCard';
import TutorFilters from '@/components/tutors/TutorFilters';
import { mockTutors } from '@/data/mockTutors';
import { TutorFilter, UG_DEPARTMENTS } from '@/types/tutor';

const defaultFilters: TutorFilter = {
  search: '',
  department: '',
  subject: '',
  priceMin: null,
  priceMax: null,
  minRating: null,
  availability: '',
  sortBy: 'rating',
};

const Tutors = () => {
  const [filters, setFilters] = useState<TutorFilter>(defaultFilters);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const filteredTutors = useMemo(() => {
    let result = [...mockTutors];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.bio.toLowerCase().includes(search) ||
          t.subjects.some((s) => s.toLowerCase().includes(search)) ||
          t.department.toLowerCase().includes(search)
      );
    }

    if (filters.department) {
      result = result.filter((t) => t.department === filters.department);
    }

    if (filters.subject) {
      result = result.filter((t) => t.subjects.includes(filters.subject));
    }

    if (filters.priceMin !== null) {
      result = result.filter((t) => t.pricePerHour >= filters.priceMin!);
    }

    if (filters.priceMax !== null) {
      result = result.filter((t) => t.pricePerHour <= filters.priceMax!);
    }

    if (filters.minRating !== null) {
      result = result.filter((t) => t.rating >= filters.minRating!);
    }

    if (filters.availability) {
      result = result.filter((t) =>
        t.availability.some((a) => a.day === filters.availability)
      );
    }

    switch (filters.sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'most-reviews':
        result.sort((a, b) => b.totalReviews - a.totalReviews);
        break;
      case 'newest':
        result.sort((a, b) => b.joinedAt.getTime() - a.joinedAt.getTime());
        break;
    }

    return result;
  }, [filters]);

  const clearFilters = () => setFilters(defaultFilters);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-secondary/80 to-background border-b border-border">
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
              Find Expert Tutors at UG
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with top tutors from universities across South Africa for your coursework, projects, and exam preparation.
            </p>

            {/* Department Quick Links */}
            <div className="flex flex-wrap justify-center gap-2">
              {UG_DEPARTMENTS.slice(0, 6).map((dept) => (
                <Badge
                  key={dept}
                  variant={filters.department === dept ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1.5"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      department: prev.department === dept ? '' : dept,
                    }))
                  }
                >
                  {dept}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border bg-card">
        <div className="container-page py-4">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <span><strong>{mockTutors.length}</strong> Tutors Available</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span><strong>{mockTutors.reduce((a, t) => a + t.totalSessions, 0)}</strong> Sessions Completed</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <span><strong>{mockTutors.filter((t) => t.isVerified).length}</strong> Verified Tutors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-page py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <TutorFilters
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
            />
          </aside>

          {/* Tutors Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing <strong>{filteredTutors.length}</strong> tutors
              </p>

              <Sheet open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <TutorFilters
                      filters={filters}
                      onFilterChange={(newFilters) => setFilters(newFilters)}
                      onClearFilters={() => {
                        clearFilters();
                        setIsMobileFilterOpen(false);
                      }}
                      isMobile
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTutors.map((tutor, index) => (
                  <div
                    key={tutor.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TutorCard tutor={tutor} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-serif font-semibold mb-2">No tutors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Tutors;
