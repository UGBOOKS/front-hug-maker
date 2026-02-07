import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { TutorReview } from '@/types/tutor';
import { format } from 'date-fns';

interface TutorReviewCardProps {
  review: TutorReview;
}

const TutorReviewCard = ({ review }: TutorReviewCardProps) => {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
            <AvatarFallback className="bg-secondary text-sm">
              {review.reviewerName.split(' ').map((n) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{review.reviewerName}</p>
            <p className="text-xs text-muted-foreground">{review.course}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < review.rating ? 'fill-accent text-accent' : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{review.comment}</p>
      <p className="text-xs text-muted-foreground">
        {format(review.createdAt, 'MMM d, yyyy')}
      </p>
    </div>
  );
};

export default TutorReviewCard;
