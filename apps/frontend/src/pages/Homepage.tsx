import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import EventSection from "@/components/EventSection";
import Ticket from "@/components/Ticket";

const Homepage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <Hero />

      {/* Features Section */}
      <Features />
      {/* CTA Section */}
      {/* <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of event organizers and attendees who trust
            <span className="font-bold ml-1">Eventora</span>.
          </p>
          {!user && (
            <Button
              asChild
              size="lg"
              className="gradient-primary hover:opacity-90"
            >
              <Link to="/register">Create Account</Link>
            </Button>
          )}
        </div>
      </section> */}
      <Ticket />
      <EventSection />
    </div>
  );
};

export default Homepage;
