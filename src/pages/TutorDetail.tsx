import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Star,
  Clock,
  BadgeCheck,
  GraduationCap,
  Calendar,
  MessageCircle,
  ArrowLeft,
  BookOpen,
  Award,
  MapPin,
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import TutorReviewCard from '@/components/tutors/TutorReviewCard';
import { mockTutors, mockTutorReviews } from '@/data/mockTutors';
import { useToast } from '@/hooks/use-toast';

const TutorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const tutor = mockTutors.find((t) => t.id === id);
  const reviews = mockTutorReviews.filter((r) => r.tutorId === id);

  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingDay, setBookingDay] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [messageText, setMessageText] = useState('');

  if (!tutor) {
    return (
      <Layout>
        <div className="container-page py-16 text-center">
          <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold mb-2">Tutor Not Found</h2>
          <p className="text-muted-foreground mb-4">This tutor profile doesn't exist.</p>
          <Button asChild>
            <Link to="/tutors">Browse Tutors</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleBookSession = () => {
    if (!bookingSubject || !bookingDay) {
      toast({ title: 'Missing information', description: 'Please select a subject and day.', variant: 'destructive' });
      return;
    }
    toast({ title: 'Session Requested!', description: `Your session request has been sent to ${tutor.name}. They will confirm shortly.` });
    setIsBookingOpen(false);
    setBookingSubject('');
    setBookingDay('');
    setBookingMessage('');
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    toast({ title: 'Message Sent!', description: `Your message has been sent to ${tutor.name}.` });
    setIsMessageOpen(false);
    setMessageText('');
  };

  return (
    <Layout>
      <div className="container-page py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/tutors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tutors
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <Avatar className="h-24 w-24 border-4 border-primary/20">
                    <AvatarImage src={tutor.avatar} alt={tutor.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-serif font-bold text-2xl">
                      {tutor.name.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-2xl font-serif font-bold">{tutor.name}</h1>
                      {tutor.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>{tutor.department}</span>
                      <span className="text-border">•</span>
                      <MapPin className="h-4 w-4" />
                      <span>{tutor.university}</span>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        {tutor.rating}
                      </span>
                      <span className="text-muted-foreground text-sm">{tutor.totalReviews} reviews</span>
                      <span className="text-muted-foreground text-sm">{tutor.totalSessions} sessions</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {tutor.responseTime}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
                <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{tutor.bio}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Qualifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tutor.qualifications.map((q, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Award className="h-4 w-4 text-primary flex-shrink-0" />
                          {q}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="px-3 py-1">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-4">
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <TutorReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No reviews yet</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="portfolio" className="mt-4">
                {tutor.portfolio.length > 0 ? (
                  <div className="grid gap-4">
                    {tutor.portfolio.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-serif font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {item.course}
                                </Badge>
                                {item.grade && (
                                  <Badge variant="secondary" className="text-xs">
                                    Grade: {item.grade}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No portfolio items yet</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="schedule" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Weekly Availability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tutor.availability.map((slot, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                          <span className="font-medium text-sm">{slot.day}</span>
                          <span className="text-sm text-muted-foreground">
                            {slot.startTime} — {slot.endTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price & Actions Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-serif font-bold text-primary">
                    R {tutor.pricePerHour}
                  </p>
                  <p className="text-sm text-muted-foreground">per hour</p>
                </div>

                {/* Book Session Dialog */}
                <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full" size="lg">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book a Session
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-serif">Book a Session with {tutor.name}</DialogTitle>
                      <DialogDescription>
                        Select a subject and preferred day. The tutor will confirm availability.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Select value={bookingSubject} onValueChange={setBookingSubject}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            {tutor.subjects.map((subject) => (
                              <SelectItem key={subject} value={subject}>
                                {subject}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Day</Label>
                        <Select value={bookingDay} onValueChange={setBookingDay}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a day" />
                          </SelectTrigger>
                          <SelectContent>
                            {tutor.availability.map((slot) => (
                              <SelectItem key={slot.day} value={slot.day}>
                                {slot.day} ({slot.startTime} - {slot.endTime})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Message (optional)</Label>
                        <Textarea
                          placeholder="Describe what you need help with..."
                          value={bookingMessage}
                          onChange={(e) => setBookingMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-sm font-medium">Session Fee</p>
                        <p className="text-2xl font-serif font-bold text-primary">
                          R {tutor.pricePerHour}
                        </p>
                        <p className="text-xs text-muted-foreground">Payment after session confirmation</p>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBookingOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleBookSession}>
                        Request Session
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Send Message Dialog */}
                <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="lg">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="font-serif">Message {tutor.name}</DialogTitle>
                      <DialogDescription>
                        Ask a question before booking a session.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Textarea
                        placeholder="Hi! I need help with..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        rows={5}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsMessageOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSendMessage}>
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="border-t border-border pt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium text-xs text-right max-w-[160px]">{tutor.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sessions</span>
                    <span className="font-medium">{tutor.totalSessions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Member Since</span>
                    <span className="font-medium">
                      {tutor.joinedAt.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TutorDetail;
