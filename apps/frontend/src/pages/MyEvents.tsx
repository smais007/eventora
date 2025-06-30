import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  attendeeCount: number;
  createdBy: string;
  joinedUsers: string[];
}

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Load user's events from localStorage
    const storedEvents = JSON.parse(
      localStorage.getItem("eventSphereEvents") || "[]"
    );
    const userEvents = storedEvents.filter(
      (event: Event) => event.createdBy === user?.id
    );
    setEvents(userEvents);
  }, [user]);

  const handleUpdateEvent = (updatedEvent: Event) => {
    const allEvents = JSON.parse(
      localStorage.getItem("eventSphereEvents") || "[]"
    );
    const updatedAllEvents = allEvents.map((event: Event) =>
      event.id === updatedEvent.id ? updatedEvent : event
    );

    localStorage.setItem("eventSphereEvents", JSON.stringify(updatedAllEvents));
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setIsEditDialogOpen(false);
    setEditingEvent(null);

    toast({
      title: "Event updated successfully!",
      description: `"${updatedEvent.title}" has been updated.`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    const allEvents = JSON.parse(
      localStorage.getItem("eventSphereEvents") || "[]"
    );
    const updatedAllEvents = allEvents.filter(
      (event: Event) => event.id !== eventId
    );

    localStorage.setItem("eventSphereEvents", JSON.stringify(updatedAllEvents));
    setEvents(events.filter((event) => event.id !== eventId));

    toast({
      title: "Event deleted successfully!",
      description: "The event has been removed from your list.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01 ${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">Manage and track your created events</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events created yet
            </h3>
            <p className="text-gray-600 mb-4">
              Start by creating your first event!
            </p>
            <Button asChild className="gradient-primary hover:opacity-90">
              <a href="/add-event">Create Event</a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription>Organized by {event.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(event.date)} at {formatTime(event.time)}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>

                  <p className="text-sm text-gray-700 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {event.attendeeCount} attending
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Dialog
                      open={isEditDialogOpen}
                      onOpenChange={setIsEditDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </DialogTrigger>
                      {editingEvent && (
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Update Event</DialogTitle>
                            <DialogDescription>
                              Make changes to your event details below.
                            </DialogDescription>
                          </DialogHeader>
                          <UpdateEventForm
                            event={editingEvent}
                            onUpdate={handleUpdateEvent}
                            onCancel={() => {
                              setIsEditDialogOpen(false);
                              setEditingEvent(null);
                            }}
                          />
                        </DialogContent>
                      )}
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your event "{event.title}" and remove it from
                            all attendees' lists.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEvent(event.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Event
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const UpdateEventForm: React.FC<{
  event: Event;
  onUpdate: (event: Event) => void;
  onCancel: () => void;
}> = ({ event, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [time, setTime] = useState(event.time);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...event,
      title,
      date,
      time,
      location,
      description,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="update-title">Event Title</Label>
        <Input
          id="update-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="update-date">Date</Label>
          <Input
            id="update-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="update-time">Time</Label>
          <Input
            id="update-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="update-location">Location</Label>
        <Input
          id="update-location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="update-description">Description</Label>
        <Textarea
          id="update-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          className="gradient-primary hover:opacity-90 flex-1"
        >
          Update Event
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default MyEvents;
