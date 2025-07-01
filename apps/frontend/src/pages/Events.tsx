/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
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
  userId: string;
  joinedUsers: string[];
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("profile") || "{}");
  const userId = user?._id || user?.id;

  console.log("userId", userId);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch {
        toast({ title: "Error", description: "Failed to fetch events." });
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, dateFilter, events]);

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const today = new Date();
    switch (dateFilter) {
      case "today":
        filtered = filtered.filter(
          (event) =>
            new Date(event.dateTime).toDateString() === today.toDateString()
        );
        break;
      case "current-week": {
        const start = new Date(today);
        const end = new Date(today);
        start.setDate(today.getDate() - today.getDay());
        end.setDate(start.getDate() + 6);
        filtered = filtered.filter((event) => {
          const date = new Date(event.dateTime);
          return date >= start && date <= end;
        });
        break;
      }
      case "last-week": {
        const start = new Date(today);
        const end = new Date(today);
        start.setDate(today.getDate() - today.getDay() - 7);
        end.setDate(start.getDate() + 6);
        filtered = filtered.filter((event) => {
          const date = new Date(event.dateTime);
          return date >= start && date <= end;
        });
        break;
      }
      case "current-month":
        filtered = filtered.filter((event) => {
          const date = new Date(event.dateTime);
          return (
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
          );
        });
        break;
      case "last-month": {
        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0
        );
        filtered = filtered.filter((event) => {
          const date = new Date(event.dateTime);
          return date >= lastMonth && date <= endOfLastMonth;
        });
        break;
      }
    }

    filtered.sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );
    setFilteredEvents(filtered);
  };

  const handleJoinEvent = async (id: string) => {
    try {
      await axios.post(`/events/join/${id}`);
      setEvents((prev) =>
        prev.map((event) =>
          event._id === id
            ? {
                ...event,
                attendeeCount: event.attendeeCount + 1,
                joinedUsers: [...(event.joinedUsers || []), userId],
              }
            : event
        )
      );
      toast({ title: "Joined event successfully!" });
    } catch (error: any) {
      toast({
        title: "Failed to join",
        description: error?.response?.data?.message || "Maybe already joined.",
      });
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover Events
          </h1>
          <p className="text-gray-400">
            Find and join amazing events in your community
          </p>
        </div>

        {/* Search & Filter */}
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
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const alreadyJoined = (event.joinedUsers || []).includes(userId);

              return (
                <Card
                  key={event._id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription>Organized by {event.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.dateTime)} at{" "}
                      {formatTime(event.dateTime)}
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
                        onClick={() => handleJoinEvent(event._id)}
                        disabled={alreadyJoined}
                      >
                        {alreadyJoined ? "Joined" : "Join Event"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;
