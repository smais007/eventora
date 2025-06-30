import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

const videos = [
  "/videos/event1.mp4",
  "/videos/event2.mp4",
  "/videos/event3.mp4",
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }, 10000); // every 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Animated Video Background */}
      <AnimatePresence mode="wait">
        <motion.video
          key={currentIndex}
          className="absolute top-0 left-0 w-full h-full object-cover"
          src={videos[currentIndex]}
          autoPlay
          muted
          loop
          playsInline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col justify-center items-center h-full text-center text-white px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Welcome to Eventora
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Create, discover, and join events that matter to you. Connect with
          your community and make unforgettable memories.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {user ? (
            <>
              <Button
                asChild
                size="lg"
                className="bg-white text-black hover:text-white"
              >
                <Link to="/events">
                  <Calendar className="mr-2 h-5 w-5" />
                  Browse Events
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-black"
              >
                <Link to="/add-event">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Event
                </Link>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              <Link to="/login">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
