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
import axios from "@/lib/axios";

interface Event {
  _id: string;
  title: string;
  name: string;
  dateTime: string;
  location: string;
  description: string;
  attendeeCount: number;
}

const MyEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events/my");
        setEvents(res.data);
      } catch (err) {
        toast({
          title: "Failed to fetch events",
          description: "Check your login session or try again.",
        });
      }
    };
    fetchEvents();
  }, []);

  const handleUpdateEvent = async (updated: Partial<Event>) => {
    if (!editingEvent) return;
    try {
      const res = await axios.put(`/events/${editingEvent._id}`, updated);
      setEvents((prev) =>
        prev.map((ev) => (ev._id === editingEvent._id ? res.data : ev))
      );
      toast({
        title: "Event updated",
        description: `"${res.data.title}" saved.`,
      });
      setEditingEvent(null);
      setIsEditDialogOpen(false);
    } catch {
      toast({ title: "Update failed", description: "Please try again." });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await axios.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((ev) => ev._id !== id));
      toast({ title: "Event deleted" });
    } catch {
      toast({ title: "Delete failed", description: "Please try again." });
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-gray-600">Manage your created events</p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events created yet
            </h3>
            <Button asChild className="gradient-primary hover:opacity-90">
              <a href="/add-event">Create Event</a>
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <Card
                key={event._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>Organized by {event.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    {formatDate(event.dateTime)} at {formatTime(event.dateTime)}
                  </div>
                  <div className="text-sm flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </div>
                  <p className="text-sm text-gray-700">{event.description}</p>
                  <div className="text-sm flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" /> {event.attendeeCount}{" "}
                    attending
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
                          onClick={() => setEditingEvent(event)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </DialogTrigger>
                      {editingEvent && editingEvent._id === event._id && (
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                            <DialogDescription>
                              Update your event info
                            </DialogDescription>
                          </DialogHeader>
                          <UpdateForm
                            event={editingEvent}
                            onCancel={() => {
                              setEditingEvent(null);
                              setIsEditDialogOpen(false);
                            }}
                            onUpdate={handleUpdateEvent}
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
                          <X className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete this event?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{event.title}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDeleteEvent(event._id)}
                          >
                            Delete
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

const UpdateForm = ({
  event,
  onCancel,
  onUpdate,
}: {
  event: Event;
  onCancel: () => void;
  onUpdate: (updated: Partial<Event>) => void;
}) => {
  const [title, setTitle] = useState(event.title);
  const [location, setLocation] = useState(event.location);
  const [description, setDescription] = useState(event.description);

  const [date, setDate] = useState(event.dateTime.split("T")[0]);
  const [time, setTime] = useState(
    new Date(event.dateTime).toISOString().split("T")[1].substring(0, 5)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedDateTime = new Date(`${date}T${time}`);
    onUpdate({
      title,
      location,
      description,
      dateTime: updatedDateTime.toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Label>Event Title</Label>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Time</Label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </div>

      <Label>Location</Label>
      <Input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        required
      />

      <Label>Description</Label>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <div className="flex gap-2 pt-4">
        <Button type="submit" className="gradient-primary flex-1">
          Update
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
