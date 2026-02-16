import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, BadgeCheck, GraduationCap } from 'lucide-react';
import { Tutor } from '@/types/tutor';

interface TutorCardProps {
  tutor: Tutor;
}

const TutorCard = ({ tutor }: TutorCardProps) => {
  const availableDays = [...new Set(tutor.availability.map((s) => s.day))];

  return (
    <Link to={`/tutor/${tutor.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/30 h-full">
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={tutor.avatar} alt={tutor.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-serif font-bold text-lg">
                {tutor.name.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {tutor.name}
                </h3>
                {tutor.isVerified && (
                  <BadgeCheck className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {tutor.department}
              </p>
            </div>
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center gap-4 mb-3 text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Star className="h-4 w-4 fill-accent text-accent" />
              {tutor.rating}
            </span>
            <span className="text-muted-foreground">
              {tutor.totalReviews} reviews
            </span>
            <span className="text-muted-foreground">
              {tutor.totalSessions} sessions
            </span>
          </div>

          {/* Subjects */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tutor.subjects.slice(0, 3).map((subject) => (
              <Badge key={subject} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
            {tutor.subjects.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tutor.subjects.length - 3}
              </Badge>
            )}
          </div>

          {/* Bio preview */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {tutor.bio}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{availableDays.length} days/week</span>
            </div>
            <p className="font-serif font-bold text-primary text-lg">
              R {tutor.pricePerHour}<span className="text-xs font-normal text-muted-foreground">/hr</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TutorCard;
