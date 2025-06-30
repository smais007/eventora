import React, { useState, useEffect } from "react";
import { Search, Calendar, MapPin, Users, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const { user } = useAuth();

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = JSON.parse(
      localStorage.getItem("eventSphereEvents") || "[]"
    );
    setEvents(storedEvents);
    setFilteredEvents(storedEvents);
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, dateFilter, events]);

  const filterEvents = () => {
    let filtered = events;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Date filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateFilter) {
      case "today":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === today.toDateString();
        });
        break;

      case "current-week":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(today);
        endOfWeek.setDate(today.getDate() + (6 - today.getDay()));

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= startOfWeek && eventDate <= endOfWeek;
        });
        break;

      case "last-week":
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 7);
        const lastWeekEnd = new Date(today);
        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= lastWeekStart && eventDate <= lastWeekEnd;
        });
        break;

      case "current-month":
        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return (
            eventDate.getMonth() === today.getMonth() &&
            eventDate.getFullYear() === today.getFullYear()
          );
        });
        break;

      case "last-month":
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

        filtered = filtered.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate >= lastMonth && eventDate <= lastMonthEnd;
        });
        break;
    }

    // Sort by date and time (descending)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredEvents(filtered);
  };

  const handleJoinEvent = (eventId: string) => {
    if (!user) return;

    const updatedEvents = events.map((event) => {
      if (event.id === eventId) {
        if (event.joinedUsers.includes(user.id)) {
          toast({
            title: "Already joined!",
            description: "You have already joined this event.",
          });
          return event;
        }

        const updatedEvent = {
          ...event,
          attendeeCount: event.attendeeCount + 1,
          joinedUsers: [...event.joinedUsers, user.id],
        };

        toast({
          title: "Successfully joined!",
          description: `You've joined "${event.title}".`,
        });

        return updatedEvent;
      }
      return event;
    });

    setEvents(updatedEvents);
    localStorage.setItem("eventSphereEvents", JSON.stringify(updatedEvents));
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
    <div className="min-h-screen  py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Discover Events
          </h1>
          <p className="text-gray-400">
            Find and join amazing events in your community
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search events by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="current-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="current-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => (
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendeeCount} attending
                    </div>

                    <Button
                      onClick={() => handleJoinEvent(event.id)}
                      disabled={event.joinedUsers.includes(user?.id || "")}
                      className="gradient-primary hover:opacity-90"
                      size="sm"
                    >
                      {event.joinedUsers.includes(user?.id || "")
                        ? "Joined"
                        : "Join Event"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
